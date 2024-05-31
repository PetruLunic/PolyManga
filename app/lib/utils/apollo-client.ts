import {ApolloClient, InMemoryCache} from "@apollo/client";

const createApolloClient = () => new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`,
  cache: new InMemoryCache({

  })
})

export default createApolloClient;