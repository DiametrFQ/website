import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { Post } from './dto/post.dto';

const TELEGRAM_CHANNEL = 'diametrpd';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly rssParser = new Parser();

  constructor(private readonly httpService: HttpService) {}

  async fetchTelegramPosts(): Promise<Post[]> {
    const feedUrl = `https://rsshub.app/telegram/channel/${TELEGRAM_CHANNEL}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(feedUrl, { responseType: 'text' }),
      );

      const feed = await this.rssParser.parseString(response.data);
      if (!feed.items) {
        return [];
      }

      return feed.items.map(item => {
        const content = item.content || '';
        const $ = cheerio.load(content);
        const imageUrl = $('img').attr('src');
        const contentSnippet = $('body').text().trim().replace(/\\s+/g, ' ');

        return {
          title: item.title || 'Без заголовка',
          link: item.link || '#',
          contentSnippet,
          imageUrl: imageUrl || null,
        };
      });
    } catch (error) {
      this.logger.error(`Failed to fetch or parse RSS feed: ${error.message}`);
      // Возвращаем пустой массив как fallback, как было в Rust
      return [];
    }
  }
}