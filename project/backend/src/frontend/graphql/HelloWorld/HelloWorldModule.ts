import { Module } from '@nestjs/common';
import { HelloWorldService } from '../../../application/HelloWorldService';
import { BaseModule } from '../../../base/BaseModule';
import { AuthorModule } from '../Author/AuthorModule';
import { HelloWorldResolver } from './HelloWorldResolver';

@Module({
  imports: [AuthorModule, BaseModule],
  providers: [HelloWorldService, HelloWorldResolver],
  exports: [HelloWorldService],
})
export class HelloWorldModule {}
