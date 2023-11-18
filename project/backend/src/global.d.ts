import { JwtPayload } from './auth/auth.service';

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}
