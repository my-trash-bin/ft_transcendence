import { Injectable } from '@nestjs/common';
import { GraphQLHelloWorld } from '../graphql/type/GraphQLHelloWorld';

@Injectable()
export class HelloWorldService {
  findOneById(id: string): GraphQLHelloWorld {
    return { message: `Hello ${id}!`, id, authorId: 'jmaing' };
  }
}
