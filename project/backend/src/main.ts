import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { env } from './util/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setVersion('1')
    .addServer('http://localhost:60080') // TODO: ENV 활용하는 값으로 수정해주세요 맹님^^
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: 'http://localhost:53000', credentials: true });

  await app.listen(env('PORT'));
}
bootstrap();
