import { Injectable } from '@nestjs/common';
import { GraphQLHelloWorld } from '../frontend/graphql/HelloWorld/GraphQLHelloWorld';

@Injectable()
export class HelloWorldService {
  findOneById(id: string): GraphQLHelloWorld {
    return { message: `Hello ${id}!`, id, authorId: 'jmaing' };
  }
}
