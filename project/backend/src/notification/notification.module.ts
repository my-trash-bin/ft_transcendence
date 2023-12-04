import { forwardRef, Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { EventsModule } from '../events/events.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [BaseModule, forwardRef(() => EventsModule)],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
