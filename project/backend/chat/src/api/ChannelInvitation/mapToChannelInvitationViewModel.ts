import { ChannelInvitationView } from '../../application/interface/ChannelInvitaion/view/ChannelInvitationView';
import { ChannelInvitationViewModel } from './ChannelInvitationViewModel';

export function mapToChannelInvitationViewModel(
  view: ChannelInvitationView,
): ChannelInvitationViewModel {
  const viewModel = new ChannelInvitationViewModel();
  viewModel.channelId = view.channelId.value;
  viewModel.memberId = view.memberId.value;
  viewModel.invitedAt = view.invitedAt;
  return viewModel;
}
