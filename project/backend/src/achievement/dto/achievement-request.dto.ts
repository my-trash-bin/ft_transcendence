import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class GrantAchievementDto {
  @ApiProperty({ description: '업적 타이틀' })
  @IsString()
  title!: string;

  @ApiProperty({ description: '업적 부여할 유저' })
  @IsUUID()
  userId!: string;
}
