import { Container, asValue } from '@ft_transcendence/common/di/Container';
import { MissingEnvError, env } from '@ft_transcendence/common/env';
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

import { AuthType } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { Strategy } from 'passport-jwt';
import { ApplicationExports } from '../application/ApplicationExports';
import { ApplicationImports } from '../application/ApplicationImports';
import { RequestContextForSystem } from '../application/RequestContext';
import { AuthView } from '../application/interface/Auth/view/AuthView';
import { idOf } from '../util/id/idOf';
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

      type SerializedUser = [AuthType, string];
      serializeUser((expressUser, done) => {
        const user = expressUser as unknown as AuthView;
        done(null, JSON.stringify(<SerializedUser>[user.type, user.id.value]));
      });
      deserializeUser((typeAndId: string, done) => {
        (async () => {
          try {
            const [type, id]: SerializedUser = JSON.parse(typeAndId);
            const authView = await systemContainer
              .resolve('authService')
              .get(type, id);
            done(null, authView);
          } catch (e) {
            done(e, false);
          }
        })();
      });

      use(
        new Strategy(
          {
            jwtFromRequest: (req) => req?.cookies?.jwt ?? null,
            secretOrKey: env('JWT_SECRET'),
          },
          (payload: JwtPayload, done) => {
            console.log({ payload });
            (async () => {
              try {
                const authView = await systemContainer
                  .resolve('authService')
                  .getById(payload.user.id);
                done(null, authView);
              } catch (e) {
                done(e, false);
              }
            })();
            done(null, false);
          },
        ),
      );
      app.get('/api/auth/jwt', authenticate('jwt'));

      try {
        use(
          new FTStrategy(
            {
              clientID: env('API_42_UID'),
              clientSecret: env('API_42_SECRET'),
              callbackURL: env('API_42_CALLBACK'),
            },
            (accessToken, refreshToken, profile, callback) => {
              (async () => {
                try {
                  const authView = await systemContainer
                    .resolve('authService')
                    .upsertFT(idOf(profile.id), profile._raw);
                  callback(null, authView);
                } catch (e) {
                  callback(e, false);
                }
              })();
            },
          ),
        );
        app.get('/api/auth/42', authenticate('42'));
        app.get(
          '/api/auth/42/callback',
          authenticate('42', { failureRedirect: '/login', session: false }),
          function (req, res) {
            const payload: JwtPayload = {
              exp: Math.floor(Date.now() / 1000) + 3900,
              user: { id: idOf((req.user as AuthView).id.value) },
            };
            const token = sign(payload, env('JWT_SECRET'));
            res.cookie('jwt', token, {
              httpOnly: true,
              expires: new Date(Date.now() + 3900000),
            });
            res.redirect('/welcome');
          },
        );
      } catch (e) {
        if (e instanceof MissingEnvError) {
          console.error(e);
        } else {
          throw e;
        }
      }
    },
  );
}
