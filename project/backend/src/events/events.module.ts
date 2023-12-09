import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { ChannelModule } from '../channel/channel.module';
import { DmModule } from '../dm/dm.module';
import { NotificationModule } from '../notification/notification.module';
import { PongLogModule } from '../pong-log/pong-log.module';
import { UserFollowModule } from '../user-follow/user-follow.module';
import { UsersModule } from '../users/users.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => UserFollowModule),
    forwardRef(() => ChannelModule),
    forwardRef(() => DmModule),
    forwardRef(() => PongLogModule),
    forwardRef(() => NotificationModule),
    BaseModule,
  ],
  providers: [EventsGateway, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
