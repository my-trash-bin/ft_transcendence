import 'dotenv/config';
import 'reflect-metadata';

import { Container } from '@ft_transcendence/common/di/Container';
import { env } from '@ft_transcendence/common/env';
import { start } from './api/start';

(async () => {
  const PORT = parseInt(env('PORT'));
  start(Container.empty(), PORT);
  console.log(`🚀 Server ready on port ${PORT}`);
})();
