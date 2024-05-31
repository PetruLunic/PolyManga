import {ApolloServer} from "@apollo/server";
import {startServerAndCreateNextHandler} from "@as-integrations/next";
import {NextRequest} from "next/server";
import dbConnect from "@/app/lib/utils/dbConnect";
import {schema} from "@/app/lib/graphql/resolvers";
import createApolloClient from "@/app/lib/utils/apollo-client";

const server = new ApolloServer({
  schema
});

// Starting server and creating api/graphql endpoint
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async req => {
    // Connecting to mongoDB on first graphQL request. Next requests extracting from cache
    await dbConnect();

    return {
      req
    }
  },
});

export { handler as GET, handler as POST };