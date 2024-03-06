import {Context} from "@/app/api/graphql/route";


class QueryResolvers {
  manga (_parent: any, {id}: { id: string }, {Manga}: Context){
    return Manga.findOne({id});
  }
}

export default {
  Query: {
    ...new QueryResolvers()
  }
}