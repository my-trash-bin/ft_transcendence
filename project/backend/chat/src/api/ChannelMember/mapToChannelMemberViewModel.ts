import { ChannelMemberView } from '../../application/interface/ChannelMember/view/ChannelMemberView';
import { ChannelMemberViewModel } from './ChannelMemberViewModel';

export function mapToChannelMemberViewModel(
  view: ChannelMemberView,
): ChannelMemberViewModel {
  const viewModel = new ChannelMemberViewModel();
  viewModel.channelId = view.channelId.value;
  viewModel.memberId = view.memberId.value;
  viewModel.memberType = view.memberType;
  viewModel.mutedUntil = view.mutedUntil;
  return viewModel;
}
