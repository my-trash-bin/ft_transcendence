import { ChannelMemberType } from '@prisma/client';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { ChannelMemberService } from '../../application/implementation/ChannelMember/ChannelMemberService';
import { idOf } from '../../util/id/idOf';
import { ChannelMember } from './ChannelMember';
import { ChannelMemberViewModel } from './ChannelMemberViewModel';
import { mapToChannelMemberViewModel } from './mapToChannelMemberViewModel';

@Resolver(() => ChannelMember)
export class ChannelMemberResolver {
  constructor(private readonly channelMemberService: ChannelMemberService) {}

  @Query(() => [ChannelMemberViewModel])
  async getChannelMembersByChannel(@Arg('channelId') channelId: string) {
    const results = await this.channelMemberService.findByChannel(
      idOf(channelId),
    );
    return results.map(mapToChannelMemberViewModel);
  }

  @Query(() => [ChannelMemberViewModel])
  async getChannelMembersByMember(@Arg('memberId') memberId: string) {
    const results = await this.channelMemberService.findByMember(
      idOf(memberId),
    );
    return results.map(mapToChannelMemberViewModel);
  }

  @Mutation(() => ChannelMemberViewModel)
  async joinChannel(
    @Arg('channelId') channelId: string,
    @Arg('memberType') memberType: ChannelMemberType,
  ) {
    // TODO: 인자의 enum 타입 어떻게 처리할지 확인하기
    const result = await this.channelMemberService.create(
      idOf(channelId),
      memberType,
    );
    return mapToChannelMemberViewModel(result);
  }

  @Mutation(() => ChannelMemberViewModel)
  async leaveChannel(
    @Arg('channelId') channelId: string,
    @Arg('memberId') memberId: string,
  ) {
    // TODO: 정교한 로직 구현 필요. 1. 유저가 나가기를 요청 2. 권한에 있는자에 의해 강퇴 (kick, ban)
    const result = await this.channelMemberService.delete(
      idOf(channelId),
      idOf(memberId),
    );
    return mapToChannelMemberViewModel(result);
  }

  @Mutation(() => ChannelMemberViewModel)
  async muteChannelMember(
    @Arg('channelId') channelId: string,
    @Arg('memberId') memberId: string,
  ) {
    // TODO: 관리자만 가능 토록
    const result = await this.channelMemberService.update(
      idOf(channelId),
      idOf(memberId),
      undefined,
      this.calculateMutedUntil(),
    );
    return mapToChannelMemberViewModel(result);
  }

  private calculateMutedUntil() {
    const MILLI_SEC_IN_SEC = 1000;
    const SEC_IN_MINUTE = 60;
    const DEFAULT_MUTE_MINUTE = 3;
    return new Date(
      new Date().getTime() +
        DEFAULT_MUTE_MINUTE * SEC_IN_MINUTE * MILLI_SEC_IN_SEC,
    );
  }
}
