import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { NotificationModule } from '../notification/notification.module';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

@Module({
  imports: [BaseModule, forwardRef(() => NotificationModule)],
  providers: [AchievementService],
  exports: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
