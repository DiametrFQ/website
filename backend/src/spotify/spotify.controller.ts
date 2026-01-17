import { Controller, Get, Res, Sse, MessageEvent, HttpException, HttpStatus } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Observable, interval, map, switchMap } from 'rxjs';
import { Response } from 'express';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('now-playing')
  async getNowPlaying(@Res() res: Response) {
    try {
      const nowPlaying = await this.spotifyService.fetchNowPlaying();
      if (nowPlaying) {
        return res.status(HttpStatus.OK).json(nowPlaying);
      } else {
        return res.status(HttpStatus.NO_CONTENT).send();
      }
    } catch (error) {
      throw new HttpException('Failed to fetch from Spotify', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Sse('now_playing_stream')
  nowPlayingStream(): Observable<MessageEvent> {
    return interval(3000).pipe( // Проверяем каждые 3 секунды
      switchMap(async () => {
        try {
          return await this.spotifyService.getNowPlayingStreamData();
        } catch (error) {
          console.error('Error in SSE stream:', error);
          // В случае ошибки отправляем событие "не играет"
          return { isPlaying: false };
        }
      }),
      map((data): MessageEvent => {
        return { data: JSON.stringify(data) };
      }),
    );
  }
}