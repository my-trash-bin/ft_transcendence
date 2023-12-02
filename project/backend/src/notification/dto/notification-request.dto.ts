import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: '알림 내용' })
  @IsString()
  @IsNotEmpty()
  contentJson!: string;
}
