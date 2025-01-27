import {execute, parse, print} from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import dbConnect from "@/app/lib/utils/dbConnect";
import {schema} from "@/app/lib/graphql/resolvers";
import {auth} from "@/auth";
import {GraphQLError} from "graphql/error";
import {isGraphQLError} from "@/app/lib/utils/errorsNarrowing";

// Graphql query executor
export async function queryGraphql<TData, TVariables extends { [key: string]: unknown } | undefined>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  options?: {
    withSession?: boolean
  }
): Promise<{data: TData | null, errors: readonly GraphQLError[] | undefined}> {
  try {
    await dbConnect(); // Connecting to mongoDB

    const contextValue = options?.withSession ? {
        user: (await auth())?.user
      }
      : null

    const result = await execute({
      schema,
      document: parse(print(document)),
      variableValues: variables,
      contextValue
    });

    return {data: result.data as TData, errors: result.errors};
  } catch (e) {
    const errorMessage = `Error at querying graphQL document "${document.loc?.source.name}"`
    console.error(errorMessage, e);
    return {data: null, errors: [new GraphQLError(errorMessage)]}
  }
}