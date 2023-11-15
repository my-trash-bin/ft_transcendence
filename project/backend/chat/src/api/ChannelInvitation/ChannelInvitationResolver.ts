import { Arg, Mutation, Resolver } from 'type-graphql';
import { ChannelInvitationService } from '../../application/implementation/ChannelInvitation/ChannelInvitationService';
import { idOf } from '../../util/id/idOf';
import { ChannelInvitation } from './ChannelInvitation';
import { ChannelInvitationViewModel } from './ChannelInvitationViewModel';
import { mapToChannelInvitationViewModel } from './mapToChannelInvitationViewModel';

@Resolver(() => ChannelInvitation)
export class ChannelInvitationResolver {
  constructor(
    private readonly channelInvitationService: ChannelInvitationService,
  ) {}

  @Mutation(() => ChannelInvitationViewModel)
  async sendInvitation(
    @Arg('channelId') channelId: string,
    @Arg('memberId') memberId: string,
  ): Promise<ChannelInvitationViewModel> {
    const result = await this.channelInvitationService.addInvitation(
      idOf(channelId),
      idOf(memberId),
    );
    // TODO: Noti랑 연결하기.
    return mapToChannelInvitationViewModel(result);
  }
  @Mutation(() => ChannelInvitationViewModel)
  async deleteInvitation(
    @Arg('channelId') channelId: string,
    @Arg('memberId') memberId: string,
  ): Promise<ChannelInvitationViewModel> {
    const result = await this.channelInvitationService.deleteInvitation(
      idOf(channelId),
      idOf(memberId),
    );
    // TODO: Noti랑 연결하기.
    return mapToChannelInvitationViewModel(result);
  }
}
