import { Injectable } from '@nestjs/common';
import { GraphQLHelloWorld } from '../frontend/graphql/helloworld/helloworld.type';

@Injectable()
export class HelloWorldService {
  findOneById(id: string): GraphQLHelloWorld {
    return { message: `Hello ${id}!`, id, authorId: 'jmaing' };
  }
}
