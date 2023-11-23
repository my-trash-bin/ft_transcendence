import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [AuthModule],
  providers: [EventsGateway],
})
export class EventsModule {}
