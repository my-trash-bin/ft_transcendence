import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({
    example: 'uuid-generated-string',
    description: 'Notification ID',
  })
  id!: string;

  @ApiProperty({ example: 'uuid-for-user', description: 'User ID' })
  userId!: string;

  @ApiProperty({ example: false, description: 'Read Status' })
  isRead!: boolean;

  @ApiProperty({
    example: '2023-11-27T00:00:00.000Z',
    description: 'Creation Date',
  })
  createdAt!: Date;

  @ApiProperty({
    example:
      '{"title":"New Achievement","message":"You have unlocked a new achievement!"}',
    description: 'Content JSON',
  })
  contentJson!: string;
}
