import { Module } from '@nestjs/common';
import { HelloWorldService } from '../../../application/HelloWorldService';
import { AuthorModule } from '../author/author.model';
import { HelloWorldResolver } from './helloworld.resolver';

@Module({
  imports: [AuthorModule],
  providers: [HelloWorldService, HelloWorldResolver],
  exports: [HelloWorldService],
})
export class HelloWorldModule {}
