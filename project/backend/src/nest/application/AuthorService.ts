import { Injectable } from '@nestjs/common';
import { GraphqlAuthor } from '../frontend/graphql/Author/GraphqlAuthor';

@Injectable()
export class AuthorService {
  findOneById(id: string): GraphqlAuthor | null {
    return id === 'jmaing' ? { id, name: 'Juyeong Maing' } : null;
  }
}
