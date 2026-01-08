import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get()
  async getTelegramPosts() {
    try {
      return await this.telegramService.fetchTelegramPosts();
    } catch (error) {
      // Если сервис вернул пустой массив из-за ошибки, отдаем его клиенту
      if (Array.isArray(error) && error.length === 0) {
        return [];
      }
      throw new HttpException('Failed to fetch Telegram posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}