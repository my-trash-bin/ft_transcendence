import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { baseContainer } from '../baseContainer';
import { RequestContext } from '../main/base/RequestContext';
import { asValue } from '../main/util/di/Container';

export const MiddlewareSymbol = Symbol.for('Middleware');

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestContext: RequestContext = {};
    const scopedContainer = baseContainer
      .scope()
      .register('requestContext', asValue(requestContext));
    (req as any)[MiddlewareSymbol] = { container: scopedContainer };
    next();
  }
}
