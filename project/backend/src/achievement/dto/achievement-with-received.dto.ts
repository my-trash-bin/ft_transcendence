import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class AchievementWithReceived {
  @ApiProperty({ description: 'Achievement UUID' })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'Achievement 타이틀',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Achievement 이미지 주소',
  })
  @IsString()
  imageUrl!: string;

  @ApiProperty({
    description: 'Achievement 설명',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Achievement 설명',
  })
  @IsBoolean()
  isMine!: boolean;
}
