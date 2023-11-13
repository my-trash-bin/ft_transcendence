import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLScalarType, Kind } from 'graphql';

const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',

  parseValue(value: unknown): Date {
    if (typeof value === 'number') {
      return new Date(value);
    }
    throw new Error('Invalid date value');
  },

  serialize(value: unknown): number {
    if (value instanceof Date) {
      return value.getTime();
    }
    throw new Error('GraphQL Date Scalar parser expected a `number`');
  },

  parseLiteral(ast): Date {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    throw new Error('Invalid date value');
  },
});

const typeDefs = `#graphql
  scalar Date

  type Query {
    dmUser: [DmUser],
  }

  type DmUser {
    profileImageUrl: String,
    nickname: String,
    latestTime: Date,
    preViewMessage: String,
  }
`;

const casual = require('casual');

const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Hello World',
  Query: () => ({
    dmUser: () =>
      new Array(10).fill(1).map(() => ({
        profileImageUrl: '/avatar/avatar-small.svg',
        nickname: casual.name,
        latestTime: new Date(casual.date('YYYY-MM-DD HH:mm:ss')),
        preViewMessage: casual.sentence,
      })),
  }),
};

const server = new ApolloServer({
  schema: addMocksToSchema({
    schema: makeExecutableSchema({
      typeDefs,
      resolvers: {
        Date: DateType,
      },
    }),
    mocks,
  }),
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server listening at: ${url}`);
})();
