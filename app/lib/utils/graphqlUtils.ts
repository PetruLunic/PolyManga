import {execute, parse, print} from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import dbConnect from "@/app/lib/utils/dbConnect";
import {schema} from "@/app/lib/graphql/resolvers";
import {GraphQLError} from "graphql/error";
import {unstable_cache} from "next/cache";

// Graphql query executor, only server-side
export async function queryGraphql<TData, TVariables extends { [key: string]: unknown } | undefined> (
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  options?: {
    withSession?: boolean;
    tags?: string[];
    revalidate?: number;
  }
): Promise<{ data: TData | null, errors: readonly GraphQLError[] | undefined }> {

  console.log("Query: ", document.loc?.source.name);

  // Create a cache key from the query and variables
  const cacheKey = [
    document.loc?.source.name || 'query',
    JSON.stringify(variables || {})
  ];

  const cachedQuery = unstable_cache(
    async () => {
      try {
        await dbConnect();

        const result = await execute({
          schema,
          document: parse(print(document)),
          variableValues: variables,
        });

        return { data: result.data as TData, errors: result.errors };
      } catch (e) {
        const errorMessage = `Error at querying graphQL document "${document.loc?.source.name}"`;
        console.error(errorMessage, e);
        return { data: null, errors: [new GraphQLError(errorMessage)] };
      }
    },
    cacheKey,
    {
      tags: options?.tags || [],
      revalidate: options?.revalidate || 60
    }
  );

  return await cachedQuery();
};
