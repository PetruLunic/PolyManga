"use client"

import {ReactNode} from "react";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {ApolloNextAppProvider} from "@apollo/experimental-nextjs-app-support";

interface Props{
    children: ReactNode
}

export default function ApolloClientProvider({children}: Props) {
 return <ApolloNextAppProvider makeClient={createApolloClient}>{children}</ApolloNextAppProvider>
};