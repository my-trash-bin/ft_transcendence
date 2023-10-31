import { Module } from '@nestjs/common';
import { UserService } from '../../../application/basic/User/UserService';
import { BaseModule } from '../../../base/BaseModule';
import { UserResolver } from './UserResolver';

@Module({
  imports: [BaseModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
