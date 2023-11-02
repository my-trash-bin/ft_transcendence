import 'dotenv/config';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { env } from './main/util/env';
import { FrontendModule } from './nest/FrontendModule';

async function bootstrap() {
  const app = await NestFactory.create(FrontendModule);
  await app.listen(env('PORT'));
}
bootstrap();
