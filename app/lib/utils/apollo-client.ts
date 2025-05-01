import {ApolloLink, FieldFunctionOptions, HttpLink} from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import {onError} from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const loggingLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  return forward(operation).map((result) => {
    console.log(`GraphQL Response:`, result);
    return result;
  });
});

const createApolloClient = () => {
  const isServer = typeof window === "undefined";

  // Dynamically set the API URL based on the environment
  const uri = isServer
      ? process.env.NEXT_PUBLIC_SITE_URL
              ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`
              : "http://localhost:3000/api/graphql"  // Default fallback for local development
      : "/api/graphql";  // Relative URL for client-side requests



  const httpLink = new HttpLink({
    uri,
    credentials: 'same-origin', // Ensure cookies are included in requests
    fetchOptions: {
      credentials: "include",
      next: {
        revalidate: 3600
      }
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            mangas: { // Caching mechanism for mangas pagination
              keyArgs: ["search", "statuses", "genres", "types", "sort", "sortBy", "languages", "locale"], // Cache based on these arguments
              merge(existing = [], incoming, { args }) {
                console.log({existing, incoming, args});
                const { offset = 0 } = args || {};
                const merged = existing ? existing.slice(0) : [];
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
                return merged;
              }
            },
          },
        },
        Manga: {
          fields: {
            chapters: { // FieldPolicy for Manga.chapters
              keyArgs: ["isDescending"], // Correct properties for a FieldPolicy
              merge(existing: any[] = [], incoming: any[] = [], { args }) {
                console.log({existing, incoming, args});
                const { offset = 0 } = args || {};
                const merged = existing ? existing.slice(0) : [];
                const itemsToMerge = Array.isArray(incoming) ? incoming : [];
                for (let i = 0; i < itemsToMerge.length; ++i) {
                  merged[offset + i] = itemsToMerge[i];
                }
                return merged;
              },
            }
          }
        }
      },
    }),
    link:
        typeof window === "undefined"
            ? ApolloLink.from([
              new SSRMultipartLink({
                stripDefer: true,
              }),
              loggingLink,
              errorLink,
              httpLink,
            ])
            : httpLink,
  }) as ApolloClient<any>
}

export default createApolloClient;