import 'dotenv/config';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { FrontendModule } from './frontend/frontend.module';

async function bootstrap() {
  const app = await NestFactory.create(FrontendModule);
  await app.listen(80);
}
bootstrap();
