import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { env } from './util/env';

import { ValidationPipe } from '@nestjs/common';

import * as express from 'express';
import { join } from 'path';
// import serveIndex from 'serve-index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // 폴더 자동생성 확인
  const staticDir = join(__dirname, '..', 'dist', 'uploads');
  app.use('/uploads', express.static(staticDir));
  // app.use('/uploads', serveIndex(staticDir, { icons: true }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(env('PORT'));
}
bootstrap();
