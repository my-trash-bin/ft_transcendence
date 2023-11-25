import { ApiProperty } from '@nestjs/swagger';
import { UserId } from '../../common/Id';

// export enum EnumRelation {
//   'friend',
//   'block',
//   'none',
//   'me',
// }

// export type RelationKey = 'friend' | 'block' | 'none' | 'me';

export enum RelationStatus {
  Friend = 'friend',
  Block = 'block',
  None = 'none',
  Me = 'me',
}

export class RecordDto {
  @ApiProperty({ description: '승리 수', type: Number })
  win!: number;

  @ApiProperty({ description: '패배 수', type: Number })
  lose!: number;

  @ApiProperty({ description: '승률', type: Number })
  ratio!: number;

  constructor({
    win,
    lose,
    ratio,
  }: {
    win: number;
    lose: number;
    ratio: number;
  }) {
    this.win = win;
    this.lose = lose;
    this.ratio = ratio;
  }
}

interface UserProfileDtoInput {
  id: UserId;
  imageUrl: string | null;
  nickname: string;
  record: RecordDto;
  relation: RelationStatus;
  statusMessage: string;
}

export class UserProfileDto {
  @ApiProperty({ description: '아이디', type: String })
  id: string;

  @ApiProperty({ description: '닉네임', type: String })
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    required: false,
    type: String,
  })
  imageUrl: string | null;

  @ApiProperty({ description: '전적', type: () => RecordDto })
  record: RecordDto;

  @ApiProperty({ description: '상태메시지', type: String })
  statusMessage: string;

  @ApiProperty({ description: '관계', enum: RelationStatus })
  relation: RelationStatus;

  constructor(input: UserProfileDtoInput) {
    this.id = input.id.value;
    this.nickname = input.nickname;
    this.imageUrl = input.imageUrl;
    this.record = input.record;
    this.relation = input.relation;
    this.statusMessage = input.statusMessage;
  }
}
