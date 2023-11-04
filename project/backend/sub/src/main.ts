import { buildSubgraphSchema } from '@apollo/subgraph';
import {
  printSchemaWithDirectives,
  type IResolvers,
} from '@graphql-tools/utils';
import gql from 'graphql-tag';
import deepMerge from 'lodash.merge';
import {
  buildSchema,
  createResolversMap,
  type BuildSchemaOptions,
} from 'type-graphql';

export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: IResolvers,
) {
  const schema = await buildSchema({
    ...options,
    skipCheck: true,
  });

  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql(printSchemaWithDirectives(schema)),
    resolvers: deepMerge(createResolversMap(schema) as any, referenceResolvers),
  });

  return federatedSchema;
}
