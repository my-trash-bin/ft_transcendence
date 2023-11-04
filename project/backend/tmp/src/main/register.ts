import { Exports } from './Exports';
import { Imports } from './Imports';
import { UserService } from './application/implementation/User/UserService';
import { Container, asClass } from './util/di/Container';
import { Merge } from './util/type/object/Merge';

export function register<T extends Imports>(
  container: Container<T>,
): Container<Merge<[T, Exports]>> {
  return container.register('userService', asClass(UserService)) as any;
}
