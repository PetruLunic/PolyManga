import {buildSchema} from "graphql/utilities";


export const typeDefs = `#graphql
  type Manga {
    id: ID!
    title: String!
    description: String
    status: String!
    author: String
  }
  
  type Query {
    manga(id: ID!): Manga
  }
`