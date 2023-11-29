import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class FrinedUserTdo {
  @ApiProperty()
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{6,12}$/, {
    message:
      '닉네임은 6-12자의 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.',
  })
  nickname!: string;
}
