import { Container, asValue } from '@ft_transcendence/common/di/Container';
import { MissingEnvError, env } from '@ft_transcendence/common/env';
import { start as commonStart } from '@ft_transcendence/sub/api';
import { AuthType } from '@prisma/client';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import expressSession from 'express-session';
import { sign } from 'jsonwebtoken';
import {
  authenticate,
  deserializeUser,
  initialize,
  serializeUser,
  session,
  use,
} from 'passport';
import FTStrategy from 'passport-42';

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
  userHeader?: string,
): Promise<Context> {
  const scope = container
    .scope()
    .register(
      'requestContext',
      asValue(userHeader ? JSON.parse(userHeader) : null),
    );
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
    async ({ req }) =>
      await makeContext(
        container,
        Array.isArray(req.headers.user)
          ? req.headers.user[0]
          : req.headers.user,
      ),
    (app) => {
      app.use(json());
      app.use(urlencoded({ extended: true }));
      app.use(cookieParser(env('COOKIE_SECRET')));
      app.use(
        expressSession({
          secret: env('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
        }),
      );
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
              user: { id: (req.user as AuthView).userId },
            };
            const token = sign(payload, env('JWT_SECRET'), { expiresIn: '1d' });
            res.cookie('jwt', token, {
              httpOnly: true,
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