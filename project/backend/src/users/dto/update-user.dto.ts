import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: '6~12 영문, 숫자 ㅡ하이픈, 언더스코어만 사용가능한 닉네임',
    required: false,
  })
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{6,12}$/, {
    message:
      '닉네임은 6-12자의 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.',
  })
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({
    description: '프로필 아바타 이미지 주소',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @ApiPropertyOptional({ description: '프로필 상태 메세지', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  statusMessage?: string;
}
