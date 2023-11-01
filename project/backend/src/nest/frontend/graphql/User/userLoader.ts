import DataLoader = require('dataloader');
import { UserService } from '../../../../main/implementation/User/UserService';
import {
  UserId,
  UserView,
} from '../../../../main/interface/User/view/UserView';

export function userLoader(
  context: any,
  userService: UserService,
): DataLoader<UserId, UserView> {
  return (
    context.userLoader ??
    (context.userLoader = new DataLoader<UserId, UserView>(
      async (ids) => await userService.getMany(ids),
    ))
  );
}
