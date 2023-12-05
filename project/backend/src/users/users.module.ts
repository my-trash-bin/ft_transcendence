import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { PongLogModule } from '../pong-log/pong-log.module';
import { PongLogService } from '../pong-log/pong-log.service';
import { UserFollowModule } from '../user-follow/user-follow.module';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    BaseModule,
    forwardRef(() => UserFollowModule),
    forwardRef(() => PongLogModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserFollowService, PongLogService],
  exports: [UsersService, UserFollowService, PongLogService],
})
export class UsersModule {}
