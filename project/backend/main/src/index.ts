import 'dotenv/config';
import 'reflect-metadata';

import {
  Container,
  asClass,
  asFunction,
} from '@ft_transcendence/common/di/Container';
import { env } from '@ft_transcendence/common/env';
import { ApiExports } from './api/ApiExports';
import { start } from './api/start';
import { ApplicationExports } from './application/ApplicationExports';
import { UserService } from './application/implementation/User/UserService';
import { InfrastructureExports } from './infrastructure/InfrastructureExports';
import { createRepository } from './infrastructure/Repository/Repository';

type Everything = ApiExports & ApplicationExports & InfrastructureExports;

(async () => {
  const PORT = parseInt(env('PORT'));
  const container = Container.empty<Everything>()
    .register('repository', asFunction(createRepository))
    .register('userService', asClass(UserService));
  start(container, PORT);
  console.log(`🚀 Server ready on port ${PORT}`);
})();
