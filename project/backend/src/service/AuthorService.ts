import { Injectable } from '@nestjs/common';
import { GraphQLHelloWorld } from '../graphql/type/GraphQLHelloWorld';
import { GraphQLAuthor } from '../graphql/type/GraphQLAuthor';

@Injectable()
export class AuthorService {
  findOneById(id: string): GraphQLAuthor | null {
    return id === 'jmaing' ? { id, name: 'Juyeong Maing' } : null;
  }
}
