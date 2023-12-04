import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { NotificationModule } from '../notification/notification.module';
import { UserFollowController } from './user-follow.controller';
import { UserFollowService } from './user-follow.service';

@Module({
  imports: [BaseModule, forwardRef(() => NotificationModule)],
  controllers: [UserFollowController],
  providers: [UserFollowService],
  exports: [UserFollowService],
})
export class UserFollowModule {}
