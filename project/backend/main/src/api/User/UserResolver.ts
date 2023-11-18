import { Resolver, ResolverInterface } from 'type-graphql';

import { GraphqlUser } from './GraphqlUser';

@Resolver((of) => GraphqlUser)
export class UserResolver implements ResolverInterface<object> {}
