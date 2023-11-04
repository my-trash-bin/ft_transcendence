import { createRepository } from './main/base/Repository';
import { PubSubService } from './main/base/implementation/PubSubService';
import { register } from './main/register';
import { Container, asClass, asValue } from './main/util/di/Container';

export const baseContainer = register(
  Container.register('repository', asValue(createRepository())).register(
    'pubSubService',
    asClass(PubSubService),
  ) as any,
);
