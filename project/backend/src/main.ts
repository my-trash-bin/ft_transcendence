import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
import * as express from 'express';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { env } from './util/env';

export const STATIC_UPLOADS_DIR = join(__dirname, '..', 'dist', 'uploads');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // 폴더 자동생성 확인
  app.use(
    '/uploads',
    cors({ origin: process.env.FRONTEND_ORIGIN }),
    express.static(STATIC_UPLOADS_DIR),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(env('PORT'));
}
bootstrap();
