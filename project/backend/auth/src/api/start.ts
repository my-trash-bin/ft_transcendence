import { Container, asValue } from '@ft_transcendence/common/di/Container';
import { env } from '@ft_transcendence/common/env';
import { start as commonStart } from '@ft_transcendence/sub/api';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import expressSession from 'express-session';
import {
  authenticate,
  deserializeUser,
  initialize,
  serializeUser,
  session,
  use,
} from 'passport';
import FTStrategy from 'passport-42';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApplicationExports } from '../application/ApplicationExports';
import { ApplicationImports } from '../application/ApplicationImports';
import { RequestContextForSystem } from '../application/RequestContext';
import { ApiExports } from './ApiExports';
import { ApiImports } from './ApiImports';
import { Context } from './Context';
import { JwtPayload } from './JwtPayload';
import { schema } from './schema';

async function makeContext(
  container: Container<ApiImports & ApiExports>,
  authToken?: string,
): Promise<Context> {
  const scope = container
    .scope()
    .register('requestContext', asValue(authToken));
  return { container: scope };
}

export async function start(
  container: Container<ApplicationImports & ApplicationExports>,
  port: number,
) {
  const systemRequestContext: RequestContextForSystem = {
    isSystem: true,
  };
  const systemContainer = container
    .scope()
    .register('requestContext', asValue(systemRequestContext), true);
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
      app.use(json());
      app.use(urlencoded({ extended: true }));
      app.use(cookieParser(env('COOKIE_SECRET')));
      app.use(expressSession({ secret: env('SESSION_SECRET') }));
      app.use(initialize());
      app.use(session());
      serializeUser((user, done) => {
        console.log({ user });
        done(null, (user as any).id);
      });
      deserializeUser((id: string, done) => {
        done(null, { id });
      });
      use(
        new Strategy(
          {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env('JWT_SECRET'),
          },
          (payload: JwtPayload, done) => {
            console.log({ payload });
            done(null, false);
          },
        ),
      );
      use(
        new FTStrategy(
          {
            clientID: env('API_42_UID'),
            clientSecret: env('API_42_SECRET'),
            callbackURL: env('API_42_CALLBACK'),
          },
          (accessToken, refreshToken, profile, callback) => {
            console.log({ accessToken, refreshToken, profile, callback });
            callback(undefined, profile);
          },
        ),
      );
      app.get('/api/auth/jwt', authenticate('jwt'));
      app.get('/api/auth/42', authenticate('42'));
      app.get(
        '/api/auth/42/callback',
        authenticate('42', { failureRedirect: '/login' }),
        function (req, res) {
          res.redirect('/');
        },
      );
    },
  );
}
