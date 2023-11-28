import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AchievementDto } from './achievement.dto';

export class UserAchievementDto {
  @ApiProperty({ example: 'uuid-for-user', description: 'User ID' })
  userId!: string;

  @ApiProperty({
    example: 'uuid-for-achievement',
    description: 'Achievement ID',
  })
  achievementId!: string;

  @ApiProperty({
    example: '2023-11-27T00:00:00.000Z',
    description: 'Achievement Attained Date',
  })
  achievedAt!: Date;

  @Type(() => AchievementDto)
  achievement!: AchievementDto;
}
