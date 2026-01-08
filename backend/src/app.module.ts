import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpotifyModule } from './spotify/spotify.module';
import { TelegramModule } from './telegram/telegram.module';
import { MetricsModule } from './metrics/metrics.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // Глобальная конфигурация для .env файлов
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Глобальный HTTP модуль для запросов
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    SpotifyModule,
    TelegramModule,
    MetricsModule,
  ],
})
export class AppModule {}