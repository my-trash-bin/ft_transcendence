import { ChatUserView } from '../../application/interface/ChatUser/view/ChatUserView';
import { ChatUserViewModel } from './ChatUserViewModel';

export function mapToChatUserViewModel(view: ChatUserView): ChatUserViewModel {
  const viewModel = new ChatUserViewModel();
  viewModel.id = view.id.value;
  viewModel.authUserId = view.authUserId.value;
  return viewModel;
}
