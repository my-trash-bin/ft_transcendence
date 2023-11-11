import { Container } from '@ft_transcendence/common/di/Container';

import { ApiExports } from './ApiExports';
import { ApiImports } from './ApiImports';

export interface Context {
  container: Container<ApiImports & ApiExports>;
}
