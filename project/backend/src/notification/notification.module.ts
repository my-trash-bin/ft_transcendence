import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [BaseModule],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
