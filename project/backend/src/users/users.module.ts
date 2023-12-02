import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { PongLogService } from '../pong-log/pong-log.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [BaseModule],
  controllers: [UsersController],
  providers: [UsersService, UserFollowService, PongLogService],
  exports: [UsersService],
})
export class UsersModule {}
