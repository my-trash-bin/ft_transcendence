import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ChangeActionType } from '../channel/channel.service';

export class ChannelMessageDto {
  @IsUUID()
  channelId!: string;

  @IsString()
  @IsNotEmpty()
  msg!: string;
}

export class DmMessageDto {
  @IsUUID()
  memberId!: string;

  @IsString()
  @IsNotEmpty()
  msg!: string;
}

class UserIdentityDto {
  @IsUUID()
  memberId!: string;

  @IsString()
  @IsNotEmpty()
  nickname!: string;
}

export class CreateDmChannelDto {
  info!: UserIdentityDto;
}

export class ChannelIdentityDto {
  @IsUUID()
  channelId!: string;
}

export class KickBanPromoDto {
  @IsUUID()
  channelId!: string;

  @IsUUID()
  memberId!: string;

  actionType!: ChangeActionType;
}
