import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChannelType } from '../enums/channel-type.enum';

export class ParticipateChannelDto {
  @ApiProperty({ description: '채널 타입', enum: ChannelType })
  @IsString()
  @IsEnum(ChannelType)
  type!: string;

  @ApiProperty({ description: '채널 ID' })
  @IsString()
  channelId!: string;

  @ApiPropertyOptional({ description: '채널 암호', type: String })
  @IsString()
  @IsOptional()
  password?: string | null;
}
