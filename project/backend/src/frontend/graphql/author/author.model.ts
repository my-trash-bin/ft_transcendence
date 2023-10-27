import { Module } from '@nestjs/common';
import { AuthorService } from '../../../application/AuthorService';
import { AuthorResolver } from './author.resolver';

@Module({
  providers: [AuthorService, AuthorResolver],
  exports: [AuthorService],
})
export class AuthorModule {}
