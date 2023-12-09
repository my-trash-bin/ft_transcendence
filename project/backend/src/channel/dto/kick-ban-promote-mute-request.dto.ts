import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { ChangeActionType } from '../channel.service';

export class KickBanPromoteMuteRequestDto {
  @ApiProperty({ description: '대상 채널 UUID' })
  @IsUUID()
  channelId!: string;

  @ApiProperty({ description: '대상 유저 UUID' })
  @IsUUID()
  targetUserId!: string;

  @ApiProperty({
    description: 'KICK|BAN|PROMOTE|MUTE 중 enum 하나',
    enum: ChangeActionType,
  })
  @IsEnum(ChangeActionType)
  actionType!: ChangeActionType;
}
