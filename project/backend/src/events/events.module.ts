import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { ChannelModule } from '../channel/channel.module';
import { DmModule } from '../dm/dm.module';
import { UserFollowModule } from '../user-follow/user-follow.module';
import { UsersModule } from '../users/users.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { GameService } from './events.game';

@Module({
  imports: [
    UsersModule,
    UserFollowModule,
    forwardRef(() => ChannelModule),
    DmModule,
    BaseModule,
  ],
  providers: [EventsGateway, EventsService, GameService],
  exports: [EventsService, GameService]
})
export class EventsModule {}