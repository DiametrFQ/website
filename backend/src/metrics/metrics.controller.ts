import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Response } from 'express';

@Controller() // Контроллер будет висеть на корне /api
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', this.metricsService.getContentType());
    res.send(await this.metricsService.getMetrics());
  }
}