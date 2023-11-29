import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';

@Module({
  imports: [BaseModule],
  providers: [AchievementService],
  exports: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
