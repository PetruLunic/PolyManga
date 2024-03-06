import {getZodObjectName, modelFromZod} from "nestjs-graphql-zod";
import {MangaSchema} from "@/app/lib/zodSchemas";

export const typeDefs = {
  dsf: getZodObjectName(MangaSchema)
}