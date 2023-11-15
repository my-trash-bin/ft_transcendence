import { DMMessageView } from '../../application/interface/DMMessage/view/DMMessageView';
import { DMMessageViewModel } from './DMMessageViewModel';

export function mapToDMMessageViewModel(
  view: DMMessageView,
): DMMessageViewModel {
  const viewModel = new DMMessageViewModel();
  viewModel.id = view.id.value;
  viewModel.channelId = view.channelId.value;
  viewModel.memberId = view.memberId.value;
  viewModel.sentAt = view.sentAt;
  viewModel.messageJson = view.messageJson;
  return viewModel;
}
