import { ChannelView } from "../../application/interface/Channel/view/ChannelView";
import { ChannelViewModel } from "./ChannelViewModel";

export function mapToChannelViewModel(channelView: ChannelView): ChannelViewModel {
  const viewModel = new ChannelViewModel();
  viewModel.id = channelView.id.value;
  viewModel.title = channelView.title;
  viewModel.isPublic = channelView.isPublic;
  viewModel.password = channelView.password;
  viewModel.createdAt = channelView.createdAt;
  viewModel.lastActiveAt = channelView.lastActiveAt;
  viewModel.ownerId = channelView.ownerId?.value;
  viewModel.memberCount = channelView.memberCount;
  viewModel.maximumMemberCount = channelView.maximumMemberCount;
  return viewModel;
}
