import {GraphQLError} from "graphql/error";


export function isGraphQLError(error: unknown): error is GraphQLError {
  return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      'locations' in error &&
      'path' in error &&
      Array.isArray((error as GraphQLError).locations) &&
      Array.isArray((error as GraphQLError).path)
  );
}

export function isGraphQLErrors(error: unknown): error is Record<"graphQLErrors", GraphQLError[]> {
  return (typeof error === 'object' &&
      error !== null &&
      "graphQLErrors" in error &&
      Array.isArray(error["graphQLErrors"]) &&
      error["graphQLErrors"].length > 0 &&
      isGraphQLError(error["graphQLErrors"][0])
  );
}