import { ChannelView } from '../../application/interface/Channel/view/ChannelView';
import { ChannelViewModel } from './ChannelViewModel';

export function mapToChannelViewModel(view: ChannelView): ChannelViewModel {
  const viewModel = new ChannelViewModel();
  viewModel.id = view.id.value;
  viewModel.title = view.title;
  viewModel.isPublic = view.isPublic;
  viewModel.password = view.password;
  viewModel.createdAt = view.createdAt;
  viewModel.lastActiveAt = view.lastActiveAt;
  viewModel.ownerId = view.ownerId?.value;
  viewModel.memberCount = view.memberCount;
  viewModel.maximumMemberCount = view.maximumMemberCount;
  return viewModel;
}
