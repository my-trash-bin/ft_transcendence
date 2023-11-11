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
  async getChannelMembersByChannel(
    @Arg("channelId") channelId: string
  ) {
    const results = await this.channelMemberService.findByChannel(idOf(channelId));
    return results.map(mapToChannelMemberViewModel);
  }

  @Query(() => [ChannelMemberViewModel])
  async getChannelMembersByMember(
    @Arg("memberId") memberId: string
  ) {
    const results = await this.channelMemberService.findByMember(idOf(memberId));
    return results.map(mapToChannelMemberViewModel);
  }

  @Mutation(() => ChannelMemberViewModel)
  async joinChannel(
    @Arg("channelId") channelId: string,
    @Arg("memberType") memberType: ChannelMemberType
  ) {
    const result = await this.channelMemberService.create(idOf(channelId), memberType);
    return mapToChannelMemberViewModel(result);
  }

  @Mutation(() => ChannelMemberViewModel)
  async leaveChannel(
    @Arg("channelId") channelId: string,
    @Arg("memberId") memberId: string,
  ) {
    // TODO: 정교한 로직 구현 필요. 1. 유저가 나가기를 요청 2. 권한에 있는자에 의해 강퇴
    const result = await this.channelMemberService.delete(idOf(channelId), idOf(memberId));
    return mapToChannelMemberViewModel(result);
  }
}
