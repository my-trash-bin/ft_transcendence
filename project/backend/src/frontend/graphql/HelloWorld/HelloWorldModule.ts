import { Module } from '@nestjs/common';
import { HelloWorldService } from '../../../application/HelloWorldService';
import { AuthorModule } from '../Author/AuthorModule';
import { HelloWorldResolver } from './HelloWorldResolver';

@Module({
  imports: [AuthorModule],
  providers: [HelloWorldService, HelloWorldResolver],
  exports: [HelloWorldService],
})
export class HelloWorldModule {}
