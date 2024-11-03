import {ApolloLink, HttpLink} from "@apollo/client";
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
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
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