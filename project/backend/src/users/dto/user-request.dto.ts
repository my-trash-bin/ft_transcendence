import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Matches } from 'class-validator';

export class GetUserQuery {
  @ApiProperty({ description: '타겟 유저의 UUID' })
  @IsUUID()
  targetUser!: string; // userId
}

export class SearchByNicknameQuery {
  @ApiProperty({
    description: '검색용 닉네임의 일부',
  })
  @IsString()
  q!: string; //nickname
}

export class GetUsetByNicknameParam {
  @ApiProperty({
    description: '6~12 영문, 숫자 ㅡ하이픈, 언더스코어만 사용가능한 닉네임',
  })
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{6,12}$/, {
    message:
      '닉네임은 6-12자의 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.',
  })
  nickname!: string;
}

export class FindOneParam {
  @ApiProperty({ description: '타겟 유저의 UUID' })
  @IsUUID()
  id!: string;
}
