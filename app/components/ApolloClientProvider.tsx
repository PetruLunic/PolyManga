"use client"

import {ReactNode} from "react";
import {ApolloProvider} from "@apollo/client";
import createApolloClient from "@/app/lib/apollo-client";

interface Props{
    children: ReactNode
}

export default function ApolloClientProvider({children}: Props) {
 return <ApolloProvider client={createApolloClient()}>{children}</ApolloProvider>
};