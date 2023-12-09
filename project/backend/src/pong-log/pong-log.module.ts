import { forwardRef, Module } from '@nestjs/common';
import { AchievementModule } from '../achievement/achievement.module';
import { AchievementService } from '../achievement/achievement.service';
import { BaseModule } from '../base/base.module';
import { PongLogController } from './pong-log.controller';
import { PongLogService } from './pong-log.service';

@Module({
  imports: [BaseModule, forwardRef(() => AchievementModule)],
  controllers: [PongLogController],
  providers: [PongLogService, AchievementService],
  exports: [PongLogService, AchievementService],
})
export class PongLogModule {}
