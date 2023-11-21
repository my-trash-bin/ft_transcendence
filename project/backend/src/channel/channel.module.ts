import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [BaseModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
