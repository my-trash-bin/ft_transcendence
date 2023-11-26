import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { EventsModule } from '../events/events.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [BaseModule, forwardRef(() => EventsModule)],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
