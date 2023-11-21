import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './auth.service';

export const Phase = (phase: JwtPayload['phase']) =>
  SetMetadata('phase', phase);

@Injectable()
export class PhaseGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const phase = this.reflector.get<JwtPayload['phase']>(
      'phase',
      context.getHandler(),
    );
    if (!phase) {
      return true;
    }
    const requestPhase: JwtPayload['phase'] | undefined = context
      .switchToHttp()
      .getRequest().user?.phase;
    return phase === requestPhase;
  }
}
