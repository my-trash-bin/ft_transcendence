import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChannelIdDto {
  @ApiProperty({ description: '채널 ID', format: 'uuid' })
  @IsUUID()
  channelId!: string;
}
