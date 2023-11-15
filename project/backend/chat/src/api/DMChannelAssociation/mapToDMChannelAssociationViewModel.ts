import { DMChannelAssociationView } from '../../application/interface/DMChannelAssociation/view/DMChannelAssociationView';
import { DMChannelAssociationViewModel } from './DMChannelAssociationViewModel';

export function mapToDMChannelAssociationViewModel(
  view: DMChannelAssociationView,
): DMChannelAssociationViewModel {
  const viewModel = new DMChannelAssociationViewModel();
  viewModel.id = view.id.value;
  viewModel.member1Id = view.member1Id.value;
  viewModel.member2Id = view.member2Id.value;
  return viewModel;
}
