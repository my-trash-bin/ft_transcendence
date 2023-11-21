import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class UserFollowDto {
  // @ApiProperty({ description: '팔로워의 아이디' })
  // followerId!: string;

  // @ApiProperty({ description: '팔로우 대상의 아이디' })
  // followeeId!: string;

  @ApiProperty({ description: '차단 여부', type: Boolean })
  isBlock!: boolean;

  @ApiProperty({ description: '팔로우 또는 차단된 날짜', type: Date })
  followOrBlockedAt!: Date;

  // @ApiProperty({ description: '팔로우 또는 차단된 날짜', type: UserDto })
  // follower!: UserDto;

  @ApiProperty({ description: '팔로우/블록 대상', type: () => UserDto })
  followee!: UserDto;

  constructor(obj: {
    isBlock: boolean;
    followOrBlockedAt: Date;
    followee: {
      id: string;
      joinedAt: Date;
      isLeaved: boolean;
      leavedAt: Date | null;
      nickname: string;
      profileImageUrl: string | null;
      statusMessage: string;
    };
  }) {
    this.isBlock = obj.isBlock;
    this.followOrBlockedAt = obj.followOrBlockedAt;
    this.followee = obj.followee;
  }
}
