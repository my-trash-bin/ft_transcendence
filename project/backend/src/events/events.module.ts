import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { ChannelModule } from '../channel/channel.module';
import { ChannelService } from '../channel/channel.service';
import { DmModule } from '../dm/dm.module';
import { DmService } from '../dm/dm.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [UsersModule, ChannelModule, DmModule, BaseModule],
  providers: [UsersService, ChannelService, DmService, EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
