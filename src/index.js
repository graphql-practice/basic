import {GraphQLServer} from 'graphql-yoga'
import {Query} from "./resolvers/Query"
import {Comment} from "./resolvers/Comment"
import {Mutation} from "./resolvers/Mutation"
import {Post} from "./resolvers/Post"
import {User} from "./resolvers/User"
import {db} from './db'

const server = new GraphQLServer({
    context:{db},
    typeDefs:'./src/schema.graphql',
    resolvers:{
        Query,
        Comment,
        Mutation,
        Post,
        User
    }
})

server.start(()=>{
    console.log('Server is running at http://localhost:4000')
})  