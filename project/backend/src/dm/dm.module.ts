import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';

@Module({
  imports: [BaseModule],
  providers: [DmService],
  exports: [DmService],
  controllers: [DmController],
})
export class DmModule {}
