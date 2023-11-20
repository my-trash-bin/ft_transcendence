import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: '사용자 ID', type: String })
  id!: string;

  @ApiProperty({ description: '닉네임', type: String })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    required: false,
    type: String,
  })
  profileImageUrl: string | null;

  @ApiProperty({ description: '가입 시기', type: Date })
  joinedAt: Date;

  @ApiProperty({ description: '탈퇴 여부', type: Boolean })
  isLeaved: boolean;

  // @ApiPropertyOptional({ description: '탈퇴 시기' }), 옵셔널
  @ApiProperty({ description: '탈퇴 시기', required: false, type: Date })
  leavedAt: Date | null;

  // enums
  // @ApiProperty({ enum: ['Admin', 'Moderator', 'User']}) 수동 설정 or
  // export enum UserRole{ Admin = 'Admin', ... } 직접 정의
  // role: UserRole;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
    this.joinedAt = user.joinedAt;
    this.isLeaved = user.isLeaved;
    this.leavedAt = user.leavedAt;
  }
}

export const userSelect = {
  id: true,
  joinedAt: true,
  isLeaved: true,
  leavedAt: true,
  nickname: true,
  profileImageUrl: true,
};
