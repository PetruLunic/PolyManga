import {ApolloServer} from "@apollo/server";
import {startServerAndCreateNextHandler} from "@as-integrations/next";
import {NextRequest} from "next/server";
import Manga from "@/app/lib/models/Manga";
import Chapter from "@/app/lib/models/Chapter";
import dbConnect from "@/app/lib/utils/dbConnect";
import {schema} from "@/app/lib/graphql/resolvers";

// export type Context = {
//   mongoose: {
//     Manga: typeof Manga,
//     Chapter: typeof Chapter
//   }
// }

const server = new ApolloServer({
  schema
});

// Starting server and creating api/graphql endpoint
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async req => {
    // Connecting to mongoDB here. Seems to work fine
    await dbConnect();

    return {
      req
    }
  },
});

export { handler as GET, handler as POST };