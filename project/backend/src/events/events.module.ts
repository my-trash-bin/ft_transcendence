import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { ChannelModule } from '../channel/channel.module';
import { ChannelService } from '../channel/channel.service';
import { DmModule } from '../dm/dm.module';
import { DmService } from '../dm/dm.service';
import { UserFollowModule } from '../user-follow/user-follow.module';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    UsersModule,
    UserFollowModule,
    forwardRef(() => ChannelModule),
    DmModule,
    BaseModule,
  ],
  providers: [
    UsersService,
    UserFollowService,
    ChannelService,
    DmService,
    EventsGateway,
  ],
  exports: [EventsGateway],
})
export class EventsModule {}
