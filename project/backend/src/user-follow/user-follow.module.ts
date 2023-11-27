import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { UserFollowController } from './user-follow.controller';
import { UserFollowService } from './user-follow.service';

@Module({
  imports: [BaseModule],
  controllers: [UserFollowController],
  providers: [UserFollowService],
  exports: [UserFollowService],
})
export class UserFollowModule {}
