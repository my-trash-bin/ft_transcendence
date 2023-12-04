import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';

@Module({
  imports: [BaseModule],
  controllers: [DmController],
  providers: [DmService],
  exports: [DmService],
})
export class DmModule {}
