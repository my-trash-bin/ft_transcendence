import { ChannelMessageView } from '../../application/interface/ChannelMessage/view/ChannelMessageView';
import { ChannelMessageViewModel } from './ChannelMessageViewModel';

export function mapToChannelMessageViewModel(
  view: ChannelMessageView,
): ChannelMessageViewModel {
  const viewModel = new ChannelMessageViewModel();
  viewModel.id = view.id.value;
  viewModel.channelId = view.channelId.value;
  viewModel.memberId = view.memberId.value;
  viewModel.sentAt = view.sentAt;
  viewModel.messageJson = view.messageJson;
  return viewModel;
}
