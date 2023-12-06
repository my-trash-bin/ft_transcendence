import { forwardRef, Module } from '@nestjs/common';
import { AchievementModule } from '../achievement/achievement.module';
import { AchievementService } from '../achievement/achievement.service';
import { BaseModule } from '../base/base.module';
import { NotificationModule } from '../notification/notification.module';
import { UserFollowController } from './user-follow.controller';
import { UserFollowService } from './user-follow.service';

@Module({
  imports: [
    BaseModule,
    forwardRef(() => NotificationModule),
    forwardRef(() => AchievementModule),
  ],
  controllers: [UserFollowController],
  providers: [UserFollowService, AchievementService],
  exports: [UserFollowService, AchievementService],
})
export class UserFollowModule {}
