import {execute, parse, print} from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import dbConnect from "@/app/lib/utils/dbConnect";
import {schema} from "@/app/lib/graphql/resolvers";
import {GraphQLError} from "graphql/error";
import {unstable_cache} from "next/cache";
import {nanoid} from "nanoid";

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

  // Extracting the unique name of query, otherwise disabling cache by a unique id
  const queryName = "name" in document.definitions[0] ? document.definitions[0].name?.value ?? nanoid() : nanoid();

  // Create a cache key from the query and variables
  const cacheKey = [
    queryName,
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
