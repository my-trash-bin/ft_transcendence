import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class TargetUserDto {
  @ApiProperty({ description: '타게 유저 UUID' })
  @IsUUID()
  targetUser!: string;
}
