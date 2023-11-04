import { IAuthService } from './interface/Auth/IAuthService';
import { IUserService } from './interface/User/IUserService';

export interface ApplicationExports {
  authService: IAuthService;
  userService: IUserService;
}
