import {GraphQLServer} from 'graphql-yoga'
import uuid from 'uuid'

let users = [{
    id:'1',
    name:'Tom1',
    english:97.3
},{
    id:'2',
    name:'jack',
    english:97.3
},{
    id:'3',
    name:'Jack',
    english:97.3
},{
    id:'4',
    name:'Jonh',
    english:97.3
}]

let posts = [{
    id:'1',
    title:'123',
    body:'aaaa',
    published:true,
    author:'1'
},{
    id:'2',
    title:'345',
    body:'bbbb',
    published:false,
    author:'2'
},{
    id:'3',
    title:'456',
    body:'cccd',
    published:true,
    author:'3'
},{
    id:'4',
    title:'567',
    body:'dddb',
    published:false,
    author:'1'
},{
    id:'5',
    title:'789',
    body:'ffff',
    published:true,
    author:'4'
}]
let comments = [{
    id:101,
    text:'text101',
    author:'1',
    post:'1'
},{
    id:102,
    text:'text102',
    author:'3',
    post:'2'
},{
    id:103,
    text:'text103',
    author:'2',
    post:'3'
},{
    id:104,
    text:'text104',
    author:'1',
    post:'4'
},{
    id:105,
    text:'text105',
    author:'2',
    post:'5'
},{
    id:106,
    text:'text106',
    author:'2',
    post:'1'
},{
    id:107,
    text:'text107',
    author:'3',
    post:'4'
},{
    id:108,
    text:'text108',
    author:'1',
    post:'3'
}]
const typeDefs = `
    type Query{
        users(query:String):[User!]!
        me:User
        post(id:String):Post!
        posts(query:String):[Post!]!
        comments:[Comment!]!
    }
    type Mutation{
        creatUser(data:CreateUserInput!):User!
        deleteUser(id:ID!):User!
        deletePost(id:ID!):Post!
        creatPost(data:CreatePostInput!):Post!
        creatComment(data:CreateComment):Comment!
    }

    input CreateUserInput{
        name:String!
        email:String!
        age:Int
    }

    input CreatePostInput{
        title:String!
        body:String!
        published:Boolean!
        author:ID!
    }

    input CreateComment{
        text:String!
        author:ID!
        post:ID!
    }

    type User{
        id:ID!
        name:String!
        age:Int,
        english:Float!
        inClass:Boolean
        posts:[Post!]!
        comments:[Comment!]!
    }
    type Post{
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author:User!
        comments:[Comment!]!
    }
    type Comment{
        id:ID!
        text:String!
        author:User!
        post:Post!
    }
`

// scalar type ----> String,Int,Float,Boolean,ID

const resolvers = {
    Query:{
        me(){
            return {
                id:'23aasdf',
                name:'Tom',
                english:97.3
            }
        },
        users(parent,args,ctx,info){
            let {query} = args
            if(query){
                return users.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
            }else{
                return users
            }
        },
        post(parent,args,ctx,info){
            let {id} = args
            if(!id){
                return {
                    id:'2342',
                    title:'asdfasdfa',
                    body:'sadfqewrq',
                    published:true
                }
            }else{
                return posts.find(post => post.id === id)
            }
        },
        posts(parent,args,ctx,info){
            let {query} = args
            if(!query){
                return posts
            }else{
                return posts.filter(post=>{
                    const titleExist = post.title.toLowerCase().includes(query.toLowerCase())
                    const bodyExist = post.body.toLowerCase().includes(query.toLowerCase())
                    return titleExist || bodyExist
                })
            }
        },
        comments(parent,args,ctx,info){
            return comments
        }
    },
    Mutation:{
        creatUser(parent,args,ctx,info){
            const {data} = args
            const emailToken = users.some(user => user.email === data.email)
            if(emailToken){
                throw new Error('邮箱已存在')
            }
            const user = {
                id:uuid(),
                ...data
            }
            users.push(user)
            return user
        },
        deleteUser(parent,args,ctx,info){
            const {id} = args
            const user = users.find(u=>u.id = id)
            if(!user){
                throw new Error('用户不存在')
            }
            users = users.filter(u=>u.id!==id)

            posts = posts.filter(p => {
                if(p.author === id){
                    comments = comments.filter(c => p.id !== c.post)
                }
                return p.author !==id
            })
            
            comments = comments.filter(c => c.author !== id)
            return user
        },
        creatPost(parent,args,ctx,info){
            const {data} = args
            const authorToken = users.some(user => user.id === data.author)
            if(!authorToken){
                throw new Error('该用户不存在')
            }
            let post = {
                id:uuid(),
                ...data
            }
            posts.push(post)
            return post
        },
        deletePost(parent,args,ctx,info){
            const {id} = args
            const post = posts.find(p=>p.id = id)
            if(!post){
                throw new Error('文章不存在')
            }
            posts = posts.filter(p => p.id !==id)
            comments = comments.filter(c => c.post !==id)
            return post
        },
        creatComment(parent,args,ctx,info){
            const {data} = args
            const authorExit = users.some(user => user.id === data.author)
            const postExit = posts.some(po => po.id === data.post && po.published)

            if(!authorExit || !postExit){
                throw new Error('作者或者文章不存在!')
            }

            const comment = {
                id:uuid(),
                ...data
            }
            comments.push(comment)
            return comment
        }
    },
    Post:{
        author(parent,args,ctx,info){
            return users.find(user=>{
                return user.id === parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter(comment => comment.post === parent.id)
        }
    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter(post => post.author === parent.id)
        },
        comments(parent,args,ctx,info){
            return comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find(user => user.id === parent.author)
        },
        post(parent,args,ctx,info){
            return posts.find(post => post.id === parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log('Server is running at http://localhost:4000')
})  