import {GraphQLServer,PubSub} from 'graphql-yoga'
import {Query} from "./resolvers/Query"
import {Comment} from "./resolvers/Comment"
import {Mutation} from "./resolvers/Mutation"
import {Subscription} from "./resolvers/Subscription"
import {Post} from "./resolvers/Post"
import {User} from "./resolvers/User"
import {db} from './db'

const pubsub = new PubSub()

const server = new GraphQLServer({
    context:{db,pubsub},
    typeDefs:'./src/schema.graphql',
    resolvers:{
        Query,
        Comment,
        Mutation,
        Post,
        User,
        Subscription
    }
})

server.start(()=>{
    console.log('Server is running at http://localhost:4000')
})  