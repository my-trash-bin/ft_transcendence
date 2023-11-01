import { Module } from '@nestjs/common';
import { BaseModule } from '../../../base/BaseModule';
import { UserResolver } from './UserResolver';

@Module({
  imports: [BaseModule],
  providers: [UserResolver],
  exports: [],
})
export class UserModule {}
