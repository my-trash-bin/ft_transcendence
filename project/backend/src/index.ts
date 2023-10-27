import 'dotenv/config';

import { NestFactory } from '@nestjs/core';

import { FrontendModule } from './frontend/frontend.module';

async function main() {
  const app = await NestFactory.create(FrontendModule);
  await app.init();
  await app.listen(80);
}

main();
