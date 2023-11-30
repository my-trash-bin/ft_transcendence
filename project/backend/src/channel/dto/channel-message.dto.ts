import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChannelMessageDto {
  @ApiProperty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @IsUUID()
  channelId!: string;

  @ApiProperty()
  @IsUUID()
  memberId!: string;

  @ApiProperty()
  @ApiProperty({ type: Date })
  sentAt!: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  messageJson!: string;
}

export const channelMessageDtoSelect = {
  id: true,
  channelId: true,
  memberId: true,
  sentAt: true,
  messageJson: true,
};
