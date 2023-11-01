import { Module } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { PubSubService } from './PubSubService';

@Module({
  providers: [PubSubService, PrismaService],
  exports: [PubSubService, PrismaService],
})
export class BaseModule {}
