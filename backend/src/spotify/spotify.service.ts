import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { NowPlayingResponse, NowPlayingStreamData, TokenResponse } from './dto/spotify.dto';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);
  private accessToken: string | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async refreshTokenLogic(): Promise<void> {
    this.logger.log('Requesting a new Spotify token.');
    const clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
    const refreshToken = this.configService.get<string>('SPOTIFY_REFRESH_TOKEN');

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    try {
      const response = await firstValueFrom(
        this.httpService.post<TokenResponse>('https://accounts.spotify.com/api/token', params, {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
      this.accessToken = response.data.access_token;
      this.logger.log('Successfully refreshed Spotify token.');
    } catch (error) {
      this.logger.error('Failed to refresh Spotify token', error.response?.data);
      this.accessToken = null;
      throw new Error('Could not refresh Spotify token.');
    }
  }

  async fetchNowPlaying(): Promise<NowPlayingResponse | null> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      if (!this.accessToken) {
        await this.refreshTokenLogic();
      }

      try {
        const response = await firstValueFrom(
          this.httpService.get<NowPlayingResponse>('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
            },
          }),
        );
        
        // Spotify возвращает 204 No Content, если ничего не играет. Axios вернет null для data.
        if (response.status === 204 || !response.data) {
          return null;
        }

        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          this.logger.warn(`Spotify token unauthorized. Attempting refresh (attempt ${attempt}/2)`);
          this.accessToken = null; // Сброс токена для повторной попытки
          continue;
        }
        this.logger.error('Spotify API error', error.response?.data);
        throw error;
      }
    }
    throw new Error('Failed to fetch now playing after 2 attempts.');
  }
  
  async getNowPlayingStreamData(): Promise<NowPlayingStreamData> {
    const response = await this.fetchNowPlaying();

    if (!response || !response.is_playing || !response.item) {
        return { isPlaying: false };
    }

    const item = response.item;
    const artistNames = item.artists.map(a => a.name).join(', ');

    return {
        isPlaying: response.is_playing,
        title: item.name,
        artist: artistNames,
        albumImageUrl: item.album.images?.[0]?.url,
        songUrl: item.external_urls.spotify,
    };
  }
}