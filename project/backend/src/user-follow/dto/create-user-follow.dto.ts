import { ApiProperty } from '@nestjs/swagger';

export class TargetUserDto {
  @ApiProperty()
  targetUser!: string;
}
