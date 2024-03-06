import {ApolloServer} from "@apollo/server";
import {startServerAndCreateNextHandler} from "@as-integrations/next";
import {NextRequest} from "next/server";
import Manga from "@/app/lib/models/Manga";
import Chapter from "@/app/lib/models/Chapter";
import {typeDefs} from "@/app/lib/graphql/schema";
import dbConnect from "@/app/lib/dbConnect";
import {getZodObjectName} from "nestjs-graphql-zod";
import {MangaSchema} from "@/app/lib/zodSchemas";

export type Context = {
  mongoose: {
    Manga: typeof Manga,
    Chapter: typeof Chapter
  }
}

const server = new ApolloServer<Context>({
  resolvers: {
    Query: {
      async manga (_parent: any, {id}: { id: string }, {mongoose: {Manga}}){
        return Manga.findOne({id});
      }
    }
  },
  typeDefs
});

// Starting server and creating api/graphql endpoint
const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async req => {
    // Connecting to mongoDB here. Seems to work fine
    await dbConnect();

    return {
      req,
      mongoose: {
        Manga,
        Chapter
      }
    }
  },
});

export { handler as GET, handler as POST };