import { Module } from '@nestjs/common';

import { V1Controller } from './V1Controller';
import { V1Service } from './V1Service';

@Module({
  controllers: [V1Controller],
  providers: [V1Service],
})
export class V1Module {}
