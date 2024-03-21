"use client"

import {ReactNode} from "react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

interface Props{
    children: ReactNode
}

export default function ApolloClientProvider({children}: Props) {
  const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`,
    cache: new InMemoryCache()
  })

 return <ApolloProvider client={client}>{children}</ApolloProvider>
};