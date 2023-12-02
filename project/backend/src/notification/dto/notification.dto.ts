import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class NotificationDto {
  @ApiProperty({ description: '알림 고유 UUID' })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: '알림 생성 대상 UUID' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: '읽기 여부' })
  isRead!: boolean;

  @ApiProperty({ description: '생성된 날짜', type: Date })
  createdAt!: Date;

  @ApiProperty({
    description: '알림 내용. JSON 형식 데이터를 stringfy해서 전달',
  })
  contentJson!: string;
}
