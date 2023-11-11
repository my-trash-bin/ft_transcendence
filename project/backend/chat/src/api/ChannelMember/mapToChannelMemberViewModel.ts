import { ChannelMemberView } from "../../application/interface/ChannelMember/view/ChannelMemberView";
import { ChannelMemberViewModel } from "./ChannelMemberViewModel";

export function mapToChannelMemberViewModel(channelMemberView: ChannelMemberView): ChannelMemberViewModel {
  const viewModel = new ChannelMemberViewModel();
  viewModel.channelId = channelMemberView.channelId.value;
  viewModel.memberId = channelMemberView.memberId.value;
  viewModel.memberType = channelMemberView.memberType;
  viewModel.mutedUntil = channelMemberView.mutedUntil;
  return viewModel;
}
