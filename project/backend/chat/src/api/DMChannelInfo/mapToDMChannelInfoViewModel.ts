import { DMChannelInfoView } from '../../application/interface/DMChannelInfo/view/DMChannelInfoView';
import { DMChannelInfoViewModel } from './DMChannelInfoViewModel';

export function mapToDMChannelInfoViewModel(
  view: DMChannelInfoView,
): DMChannelInfoViewModel {
  const viewModel = new DMChannelInfoViewModel();
  viewModel.fromId = view.fromId.value;
  viewModel.toId = view.toId.value;
  viewModel.channelId = view.channelId.value;
  viewModel.name = view.name;
  return viewModel;
}
