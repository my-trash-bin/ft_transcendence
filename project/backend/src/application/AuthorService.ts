import { Injectable } from '@nestjs/common';
import { GraphQLAuthor } from '../frontend/graphql/author/author.type';

@Injectable()
export class AuthorService {
  findOneById(id: string): GraphQLAuthor | null {
    return id === 'jmaing' ? { id, name: 'Juyeong Maing' } : null;
  }
}
