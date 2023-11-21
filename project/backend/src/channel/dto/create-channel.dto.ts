import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { ChannelType } from '../enums/channel-type.enum';

export class CreateChannelDto {
  @ApiProperty({ description: '채널 타입', enum: ChannelType })
  @IsString()
  @IsEnum(ChannelType)
  type!: string;

  @ApiProperty({ description: '채널 제목' })
  @IsString()
  @Length(6, 20)
  title!: string;

  @ApiPropertyOptional({ description: '채널 암호', format: 'email' })
  @IsString()
  @Length(6, 12)
  password?: string | null;

  @IsInt()
  @Max(20)
  @Min(1)
  @ApiProperty({ description: '채널 최대 인원수' })
  capacity!: number;
}
