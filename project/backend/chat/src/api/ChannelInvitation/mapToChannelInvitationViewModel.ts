import { ChannelInvitationView } from "../../application/interface/ChannelInvitaion/view/ChannelInvitationView";
import { ChannelInvitationViewModel } from "./ChannelInvitationViewModel";

export function mapToChannelInvitationViewModel(channelInvitationView: ChannelInvitationView): ChannelInvitationViewModel {
  const viewModel = new ChannelInvitationViewModel();
  viewModel.channelId = channelInvitationView.channelId.value;
  viewModel.memberId = channelInvitationView.memberId.value;
  viewModel.invitedAt = channelInvitationView.invitedAt;
  return viewModel;
}
