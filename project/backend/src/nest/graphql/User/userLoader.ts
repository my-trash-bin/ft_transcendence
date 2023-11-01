import DataLoader = require('dataloader');

import { IUserService } from '../../../main/application/interface/User/IUserService';
import {
  UserId,
  UserView,
} from '../../../main/application/interface/User/view/UserView';
import { Context } from '../../Context';

export function userLoader(
  context: Context,
  userService: IUserService,
): DataLoader<UserId, UserView> {
  return (
    context.userLoader ??
    (context.userLoader = new DataLoader<UserId, UserView>(
      async (ids) => await userService.getMany(ids),
    ))
  );
}
