import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ChannelType } from '../enums/channel-type.enum';

export class UpdateChannelDto {
  @ApiProperty({ description: '채널 Id', required: false })
  @IsUUID()
  @IsOptional()
  channelId!: string;

  @ApiProperty({
    description: '채널 타입: public | protected | private',
    enum: ChannelType,
    required: false,
  })
  @IsString()
  @IsEnum(ChannelType)
  @IsOptional()
  type?: string;

  @ApiProperty({ description: '채널 제목', required: false })
  @IsString()
  @Length(6, 20)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: '채널 암호',
    type: String,
    required: false,
    nullable: true,
  })
  @IsString()
  @Length(6, 12)
  @IsOptional()
  password?: string | null;

  @ApiProperty({ description: '채널 최대 인원수', required: false })
  @IsInt()
  @Max(20)
  @Min(1)
  @IsOptional()
  capacity?: number;
}
