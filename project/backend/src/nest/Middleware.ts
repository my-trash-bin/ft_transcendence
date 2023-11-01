import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createRepository } from '../main/base/Repository';
import { RequestContext } from '../main/base/RequestContext';
import { register } from '../main/register';
import { Container, asValue } from '../main/util/di/Container';

export const MiddlewareSymbol = Symbol.for('Middleware');

const container = register(
  Container.register('repository', asValue(createRepository())) as any,
);

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestContext: RequestContext = {};
    const scopedContainer = container
      .scope()
      .register('requestContext', asValue(requestContext));
    (req as any)[MiddlewareSymbol] = { container: scopedContainer };
    next();
  }
}
