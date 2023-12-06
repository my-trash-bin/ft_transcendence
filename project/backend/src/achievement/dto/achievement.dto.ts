import { ApiProperty } from '@nestjs/swagger';

export class AchievementDto {
  @ApiProperty({
    example: 'uuid-generated-string',
    description: 'Achievement ID',
  })
  id!: string;

  @ApiProperty({
    example: 'Master of NestJS',
    description: 'Achievement Title',
  })
  title!: string;

  @ApiProperty({ example: 'url-to-image', description: 'Image URL' })
  imageUrl!: string;

  @ApiProperty({
    example: 'Achieved something important in NestJS',
    description: 'Achievement Description',
  })
  description!: string;
}

export const achievementSelect = {
  id: true,
  title: true,
  imageUrl: true,
  description: true,
};
