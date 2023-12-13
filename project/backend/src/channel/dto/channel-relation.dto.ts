import { ApiProperty } from '@nestjs/swagger';
import { Channel, ChannelMemberType } from '@prisma/client';
import { EnumChannelMemberType } from '../enums/channel-member-type.enum';
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

export class ChannelRelationDto {
  @ApiProperty({ example: 'uuid', description: '채널 ID', format: 'uuid' })
  id!: string;

  @ApiProperty({ example: '채널 이름', description: '채널 제목' })
  title!: string;

  @ApiProperty({ example: 'public', description: '채널 타입' })
  type!: string;

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

  @ApiProperty({ description: '채팅 금지 시간', type: Date })
  mutedUntil!: Date;

  @ApiProperty({
    example: 'MEMBER',
    description: '채널 멤버 타입',
    enum: EnumChannelMemberType,
  })
  memberType!: ChannelMemberType;

  @ApiProperty({
    example: '안녕 나는 메세지라고해!',
    description: '채널 메시지 1개',
  })
  message!: string;

  constructor({
    channel,
    mutedUntil,
    memberType,
  }: {
    channel: Channel & { messages: { messageJson: string }[] };
    mutedUntil: Date;
    memberType: ChannelMemberType;
  }) {
    this.id = channel.id;
    this.title = channel.title;
    this.type = setChannelType(channel.isPublic, channel.password !== null);
    this.createdAt = channel.createdAt;
    this.lastActiveAt = channel.lastActiveAt;
    this.ownerId = channel.ownerId;
    this.memberCount = channel.memberCount;
    this.maximumMemberCount = channel.maximumMemberCount;
    this.mutedUntil = mutedUntil;
    this.memberType = memberType;
    this.message = channel.messages[0]?.messageJson ?? '';
  }
}
