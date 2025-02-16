import {GraphQLError} from "graphql/error";
import {GraphQLErrorExtensions} from "graphql/error/GraphQLError";

interface GraphQLExtensionsWithLocale extends GraphQLErrorExtensions {
  localeKey: string
}

interface GraphQLErrorWithLocale extends GraphQLError {
  extensions: GraphQLExtensionsWithLocale
}

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

export function isGraphQLErrorsWithLocaleKey(error: unknown): error is Record<"graphQLErrors", GraphQLErrorWithLocale[]> {
  return (isGraphQLErrors(error) &&
      "localeKey" in error.graphQLErrors[0].extensions &&
      typeof error.graphQLErrors[0].extensions?.localeKey === "string"
  );
}

export function isRedirectError(error: unknown): error is Error & { digest: string } {
  return (
    error instanceof Error &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}
