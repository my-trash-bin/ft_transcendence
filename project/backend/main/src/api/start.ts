import { Container, asValue } from '@ft_transcendence/common/di/Container';
import { start as commonStart } from '@ft_transcendence/sub/api';

import { ApplicationExports } from '../application/ApplicationExports';
import { ApplicationImports } from '../application/ApplicationImports';
import { RequestContextForUser } from '../application/RequestContext';
import { AuthUserId } from '../application/interface/User/view/UserView';
import { ApiExports } from './ApiExports';
import { ApiImports } from './ApiImports';
import { Context } from './Context';
import { schema } from './schema';

interface TokenData {
  user: {
    id: AuthUserId;
  };
}

async function getUser(
  container: Container<ApiImports & ApiExports>,
  tokenData: TokenData,
): Promise<RequestContextForUser> {
  const systemContainer = container
    .scope()
    .register('requestContext', asValue({ isSystem: true }), true);
  return {
    isSystem: false,
    user: {
      id: await systemContainer
        .resolve('userService')
        .getOrCreateIdByAuthId(tokenData.user.id),
    },
  };
}

async function makeContext(
  container: Container<ApiImports & ApiExports>,
  userHeader?: string,
): Promise<Context> {
  const scope = container
    .scope()
    .register(
      'requestContext',
      asValue(
        userHeader ? await getUser(container, JSON.parse(userHeader)) : null,
      ),
    );
  return { container: scope };
}

export async function start(
  container: Container<ApplicationImports & ApplicationExports>,
  port: number,
) {
  return commonStart(
    port,
    await schema,
    async ({ req }) =>
      await makeContext(
        container,
        req.headers.authorization?.startsWith('Bearer ')
          ? req.headers.authorization.slice('Bearer '.length)
          : undefined,
      ),
  );
}
