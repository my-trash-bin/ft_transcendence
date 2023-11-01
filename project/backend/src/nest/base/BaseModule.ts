import { Module } from '@nestjs/common';
import { PubSubService } from '../../main/base/PubSubService';

@Module({
  providers: [PubSubService],
  exports: [PubSubService],
})
export class BaseModule {}
