import {ApolloClient, HttpLink, InMemoryCache, useQuery} from "@apollo/client";
import {createFragmentRegistry} from "@apollo/client/cache";
import {MANGA_CARD} from "@/app/lib/graphql/queries";
import {setContext} from "@apollo/client/link/context";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`,
  credentials: 'same-origin', // Ensure cookies are included in requests
  fetchOptions: {
    credentials: "include",
  }
});

// const createApolloClient = (cookies: ReadonlyRequestCookies) => {
//   const authLink = setContext((req, { headers }) => {
//     console.log("Cookies", cookies.toString())
//     return {
//       ...headers,
//       cookie: cookies ? cookies.toString() : ""
//     };
//   });
//
//   return new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache({
//       fragments: createFragmentRegistry(MANGA_CARD),
//     }),
//   });
// };

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Add any additional headers here if needed
    },
  };
});

const createApolloClient = () => new ApolloClient({
  ssrMode: true,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    fragments: createFragmentRegistry(MANGA_CARD)
  }),
})

export default createApolloClient;