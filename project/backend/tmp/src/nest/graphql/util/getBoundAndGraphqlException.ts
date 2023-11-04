import { ObjectType, createUnionType } from '@nestjs/graphql';

import { Exception } from '../../../main/exception/Exception';
import { ExceptionHandler } from './ExceptionHandler';
import { GraphqlIException } from './GraphqlIException';

let map = new Map<
  new (...args: any[]) => Exception,
  new (exception: Exception, logId: string) => GraphqlIException
>();

function exceptionToGraphQLException(
  exceptionClass: new (...args: any[]) => Exception,
): new (exception: Exception, logId: string) => GraphqlIException {
  const existing = map.get(exceptionClass);
  if (existing) return existing;

  @ObjectType(`${exceptionClass.name}Result`, { implements: GraphqlIException })
  class Result implements GraphqlIException {
    message: string;
    logId: string;
    constructor(exception: Exception, logId: string) {
      this.message = exception.message;
      this.logId = logId;
    }
  }

  map.set(exceptionClass, Result);
  return Result;
}

export function getBoundAndGraphqlException<
  TGraphQLResult,
  TExceptionTypes extends (new (...args: any[]) => Exception)[],
>(
  exceptionTypes: TExceptionTypes,
  resultTypeOnSuccess: new (...args: any[]) => TGraphQLResult,
  unionTypeName: string,
): [
  bound: (
    func: () => Promise<TGraphQLResult>,
    exceptionHandler: ExceptionHandler,
  ) => Promise<TGraphQLResult | GraphqlIException>,
  graphqlType: GraphqlIException | TGraphQLResult,
] {
  const graphQLExceptionTypes = exceptionTypes.map(exceptionToGraphQLException);

  return [
    async (
      func: () => Promise<TGraphQLResult>,
      exceptionHandler: ExceptionHandler,
    ) => {
      try {
        return await func();
      } catch (e) {
        for (let i = 0; i < exceptionTypes.length; i++) {
          if (e instanceof exceptionTypes[i]) {
            const { exception, logId } = await exceptionHandler(e);
            return new graphQLExceptionTypes[i](exception, logId);
          }
        }
        throw e;
      }
    },
    createUnionType({
      name: unionTypeName,
      types: () => [resultTypeOnSuccess, ...graphQLExceptionTypes],
    }),
  ];
}
