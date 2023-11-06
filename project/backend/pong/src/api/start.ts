import { Container } from '@ft_transcendence/common/di/Container';
import { start as commonStart } from '@ft_transcendence/sub/api';

import { ApiInput } from './ApiInput';
import { Context } from './Context';
import { schema } from './schema';

async function makeContext(
  container: Container<ApiInput>,
  authToken?: string,
): Promise<Context> {
  const scope = container.scope();
  return { container: scope };
}

export async function start(container: Container<ApiInput>, port: number) {
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
