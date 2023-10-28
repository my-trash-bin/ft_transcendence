import { Module } from '@nestjs/common';
import { AuthorService } from '../../../application/AuthorService';
import { AuthorResolver } from './AuthorResolver';

@Module({
  providers: [AuthorService, AuthorResolver],
  exports: [AuthorService],
})
export class AuthorModule {}
