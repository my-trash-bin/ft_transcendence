import { RequestContext, RequestContextForSystem } from '../RequestContext';
import { InvalidAccessException } from '../exception/InvalidAccessException';

export function ensureSystem(
  requestContext: RequestContext,
): RequestContextForSystem {
  if (!requestContext.isSystem) throw new InvalidAccessException();
  return requestContext;
}
