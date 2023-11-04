import { Container, asValue } from '@ft_transcendence/common/di/Container';
import { env } from '@ft_transcendence/common/env';
import { start as commonStart } from '@ft_transcendence/sub/api';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { authenticate, initialize, session, use } from 'passport';
import FTStrategy from 'passport-42';

import { ApiInput } from './ApiInput';
import { Context } from './Context';
import { schema } from './schema';

async function makeContext(
  container: Container<ApiInput>,
  authToken?: string,
): Promise<Context> {
  const scope = container.scope().register('authToken', asValue(authToken));
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
    (app) => {
      app.use(cookieParser(env('COOKIE_SECRET')));
      app.use(expressSession({ secret: env('SESSION_SECRET') }));
      app.use(initialize());
      app.use(session());
      use(
        new FTStrategy(
          {
            clientID: env('API_42_UID'),
            clientSecret: env('API_42_SECRET'),
            callbackURL: env('API_42_CALLBACK'),
          },
          (accessToken, refreshToken, profile, callback) => {
            // TODO: implement it
            callback(undefined, profile);
          },
        ),
      );
      app.post('/api/auth/42', authenticate('42'));
      app.get(
        '/auth/42/callback',
        authenticate('42', { failureRedirect: '/login' }),
        function (req, res) {
          res.redirect('/');
        },
      );
    },
  );
}
