import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { DmService } from './dm.service';

@Module({
  imports: [BaseModule],
  // controllers: [UsersController],
  providers: [DmService],
  exports: [DmService],
})
export class DmModule {}
