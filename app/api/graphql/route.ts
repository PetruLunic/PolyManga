import {ApolloServer} from "@apollo/server";
import {startServerAndCreateNextHandler} from "@as-integrations/next";
import {NextRequest} from "next/server";
import dbConnect from "@/app/lib/utils/dbConnect";
import {schema} from "@/app/lib/graphql/resolvers";
import {auth} from "@/auth";
import {Session} from "next-auth";

export type ApolloContext = {
  req: NextRequest,
  user?: Session["user"]
}

const server = new ApolloServer<ApolloContext>({
  schema,
});

// Starting server and creating api/graphql endpoint
const handler = startServerAndCreateNextHandler<NextRequest, ApolloContext>(server, {
  context: async (req) => {
    // Connecting to mongoDB on first graphQL request. Next requests extracting from cache
    await dbConnect();

    const session = await auth();

    return {
      req,
      user: session?.user
    }
  },
});

export { handler as GET, handler as POST };