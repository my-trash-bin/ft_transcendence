import { Injectable } from '@nestjs/common';
import { GraphqlHelloWorld } from '../frontend/graphql/HelloWorld/GraphqlHelloWorld';

@Injectable()
export class HelloWorldService {
  findOneById(id: string): GraphqlHelloWorld {
    return { message: `Hello ${id}!`, id, authorId: 'jmaing' };
  }
}
