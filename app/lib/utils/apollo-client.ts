import {ApolloLink, HttpLink} from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`,
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
              httpLink,
            ])
            : httpLink,
  }) as ApolloClient<any>
}

export default createApolloClient;