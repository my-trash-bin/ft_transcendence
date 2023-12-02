import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { PongLogController } from './pong-log.controller';
import { PongLogService } from './pong-log.service';

@Module({
  imports: [BaseModule],
  controllers: [PongLogController],
  providers: [PongLogService],
})
export class PongLogModule {}
