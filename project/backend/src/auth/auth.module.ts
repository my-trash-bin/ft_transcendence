import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { BaseModule } from '../base/base.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './ft.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule, BaseModule],
  providers: [AuthService, FtStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
