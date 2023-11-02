import DataLoader = require('dataloader');

import { Exports } from '../main/Exports';
import {
  UserId,
  UserView,
} from '../main/application/interface/User/view/UserView';
import { Container } from '../main/util/di/Container';

export interface Context {
  container: Container<Exports>;

  userLoader?: DataLoader<UserId, UserView>;
}
