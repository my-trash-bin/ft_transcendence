import 'dotenv/config';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { FrontendModule } from './frontend/FrontendModule';
import { env } from './util/env';

async function bootstrap() {
  const app = await NestFactory.create(FrontendModule);
  await app.listen(env('PORT'));
}
bootstrap();
