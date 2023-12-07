import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LeaveChannelDto {
  @ApiProperty({ description: '채널 ID' })
  @IsUUID()
  channelId!: string;
}
