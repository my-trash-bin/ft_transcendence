import { ChatUserView } from "../../application/interface/ChatUser/view/ChatUserView";
import { ChatUserViewModel } from "./ChatUserViewModel";

export function mapToChatUserViewModel(chatUserView: ChatUserView): ChatUserViewModel {
  const viewModel = new ChatUserViewModel();
  viewModel.id = chatUserView.id.value;
  viewModel.authUserId = chatUserView.authUserId.value;
  return viewModel;
}