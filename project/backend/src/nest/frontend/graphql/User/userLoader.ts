import DataLoader = require('dataloader');
import { UserService } from '../../../application/basic/User/UserService';
import { UserId, UserView } from '../../../application/basic/User/UserView';

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
