import { forwardRef, Module } from '@nestjs/common';
import { AchievementModule } from '../achievement/achievement.module';
import { BaseModule } from '../base/base.module';
import { DmService } from '../dm/dm.service';
import { EventsModule } from '../events/events.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    BaseModule,
    forwardRef(() => EventsModule),
    forwardRef(() => AchievementModule),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, DmService],
  exports: [ChannelService],
})
export class ChannelModule {}
