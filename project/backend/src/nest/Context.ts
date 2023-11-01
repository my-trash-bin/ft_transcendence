import { Exports } from '../main/Exports';
import { Container } from '../main/util/di/Container';

export interface Context {
  container: Container<Exports>;
}
