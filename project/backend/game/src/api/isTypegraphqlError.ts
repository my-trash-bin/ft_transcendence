import { GraphQLError } from 'graphql';
import {
  CannotDetermineGraphQLTypeError,
  ConflictingDefaultValuesError,
  GeneratingSchemaError,
  InterfaceResolveTypeError,
  InvalidDirectiveError,
  MissingSubscriptionTopicsError,
  NoExplicitTypeError,
  ReflectMetadataMissingError,
  SymbolKeysNotSupportedError,
  UnionResolveTypeError,
  UnmetGraphQLPeerDependencyError,
  WrongNullableListOptionError,
} from 'type-graphql';

export function isTypegraphqlError(e: unknown): boolean {
  return (
    e instanceof CannotDetermineGraphQLTypeError ||
    e instanceof GeneratingSchemaError ||
    e instanceof ConflictingDefaultValuesError ||
    e instanceof InterfaceResolveTypeError ||
    e instanceof InvalidDirectiveError ||
    e instanceof MissingSubscriptionTopicsError ||
    e instanceof NoExplicitTypeError ||
    e instanceof ReflectMetadataMissingError ||
    e instanceof SymbolKeysNotSupportedError ||
    e instanceof UnionResolveTypeError ||
    e instanceof UnmetGraphQLPeerDependencyError ||
    e instanceof WrongNullableListOptionError ||
    e instanceof GraphQLError
  );
}
