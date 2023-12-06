import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

@Module({
  imports: [BaseModule],
  providers: [AchievementService],
  exports: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
