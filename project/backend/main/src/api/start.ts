import { Container } from '@ft_transcendence/common/di/Container';
import { start as commonStart } from '@ft_transcendence/sub/api';

import { ApplicationExports } from '../application/ApplicationExports';
import { ApplicationImports } from '../application/ApplicationImports';
import { Context } from './Context';
import { schema } from './schema';

async function makeContext(
  container: Container<ApplicationImports & ApplicationExports>,
  authToken?: string,
): Promise<Context> {
  // TODO: jwt
  const scope = container.scope(); //.register('authToken', asValue(authToken));
  return { container: scope };
}

export async function start(
  container: Container<ApplicationImports & ApplicationExports>,
  port: number,
) {
  return commonStart(
    port,
    await schema,
    async (ctx) =>
      await makeContext(
        container,
        typeof ctx.connectionParams?.authToken === 'string'
          ? ctx.connectionParams.authToken
          : undefined,
      ),
    async ({ req }) =>
      await makeContext(
        container,
        req.headers.authorization?.startsWith('Bearer ')
          ? req.headers.authorization.slice('Bearer '.length)
          : undefined,
      ),
  );
}
