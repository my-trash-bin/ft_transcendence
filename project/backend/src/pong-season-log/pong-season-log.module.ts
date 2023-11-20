import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { PongSeasonLogController } from './pong-season-log.controller';
import { PongSeasonLogService } from './pong-season-log.service';

@Module({
  imports: [BaseModule],
  controllers: [PongSeasonLogController],
  providers: [PongSeasonLogService],
})
export class PongSeasonLogModule {}
