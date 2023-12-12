import { ApiProperty } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { ChannelType } from '../enums/channel-type.enum';

const setChannelType = (
  isPublic: boolean,
  usePassword: boolean,
): ChannelType => {
  if (isPublic) {
    return ChannelType.Public;
  }
  if (usePassword) {
    return ChannelType.Protected;
  }
  return ChannelType.Private;
};

export class ChannelDto {
  @ApiProperty({ example: 'uuid', description: '채널 ID', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: '채널 이름', description: '채널 제목' })
  title!: string;

  @ApiProperty({ example: 'true', description: '채널 공개 여부' })
  isPublic!: boolean;

  @ApiProperty({ example: 'false', description: '채널 비밀번호 설정여부' })
  needPassword!: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: '채널 생성 시각',
    type: Date,
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: '채널 마지막 활동 시각',
    type: Date,
  })
  lastActiveAt!: Date;

  @ApiProperty({
    example: 'uuid',
    description: '채널 소유자 ID',
    required: false,
    format: 'uuid',
  })
  ownerId!: string | null;

  @ApiProperty({ example: 10, description: '현재 채널 멤버 수' })
  memberCount!: number;

  @ApiProperty({ example: 50, description: '최대 채널 멤버 수' })
  maximumMemberCount!: number;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.title = channel.title;
    this.isPublic = channel.isPublic;
    this.needPassword = channel.password !== null;
    this.createdAt = channel.createdAt;
    this.lastActiveAt = channel.lastActiveAt;
    this.ownerId = channel.ownerId;
    this.memberCount = channel.memberCount;
    this.maximumMemberCount = channel.maximumMemberCount;
  }
}

export const prismaChannelSelect = {
  id: true,
  title: true,
  isPublic: true,
  password: true,
  createdAt: true,
  lastActiveAt: true,
  ownerId: true,
  memberCount: true,
  maximumMemberCount: true,
};

export const channelDtoSelect = {
  id: true,
  title: true,
  isPublic: true,
  createdAt: true,
  lastActiveAt: true,
  ownerId: true,
  memberCount: true,
  maximumMemberCount: true,
};
