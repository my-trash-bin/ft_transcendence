import { ChannelMessageView } from "../../application/interface/ChannelMessage/view/ChannelMessageView";
import { ChannelMessageViewModel } from "./ChannelMessageViewModel";

export function mapToChannelMessageViewModel(channelMessageView: ChannelMessageView): ChannelMessageViewModel {
  const viewModel = new ChannelMessageViewModel();
  viewModel.id = channelMessageView.id.value;
  viewModel.channelId = channelMessageView.channelId.value;
  viewModel.memberId = channelMessageView.memberId.value;
  viewModel.sentAt = channelMessageView.sentAt;
  viewModel.messageJson = channelMessageView.messageJson;
  return viewModel;
}
