import { Type } from 'class-transformer';
import { AchievementDto } from './achievement.dto';
import { UserAchievementDto } from './user-achievement.dto';

export class UserAchievementWithAchievementDto extends UserAchievementDto {
  @Type(() => AchievementDto)
  achievement!: AchievementDto;
}
