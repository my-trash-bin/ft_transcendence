import { env } from '@ft_transcendence/common/env';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env('PORT'));
}
bootstrap();
