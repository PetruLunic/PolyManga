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
  introspection: true,
});

// Starting server and creating api/graphql endpoint
const handler = startServerAndCreateNextHandler<NextRequest, ApolloContext>(server, {
  context: async ( req ) => {
    try {
      await dbConnect(); // Ensure DB connection is available

      const session = await auth(); // Authentication handling

      return { req, user: session?.user };
    } catch (error) {
      console.error('Error in Apollo Server context:', error);
      throw new Error('Failed to initialize context');
    }
  },
});

export { handler as GET, handler as POST };