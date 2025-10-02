import { Injectable, OnModuleInit } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  onModuleInit() {
    collectDefaultMetrics();
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  getContentType(): string {
    return register.contentType;
  }
}