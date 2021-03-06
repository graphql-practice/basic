import uuid from 'uuid'
const Mutation = {
    creatUser(parent,args,{db},info){
        const {data} = args
        const emailToken = db.users.some(user => user.email === data.email)
        if(emailToken){
            throw new Error('邮箱已存在')
        }
        const user = {
            id:uuid(),
            ...data
        }
        db.users.push(user)
        return user
    },
    deleteUser(parent,args,{db},info){
        const {id} = args
        const user = db.users.find(u=>u.id = id)
        if(!user){
            throw new Error('用户不存在')
        }
        db.users = db.users.filter(u=>u.id!==id)

        db.posts = db.posts.filter(p => {
            if(p.author === id){
                db.comments = db.comments.filter(c => p.id !== c.post)
            }
            return p.author !==id
        })
        
        db.comments = db.comments.filter(c => c.author !== id)
        return user
    },
    updateUser(parent,args,{db},info){
        const {id, data} = args
        const user = db.users.find(user => user.id === id)
        if(!user){
            throw new Error('作者不存在')
        }
        if(typeof data.email === "string"){
            const emailTaken = db.users.some(user => user.email === data.email)
            if(emailTaken){
                throw new Error("邮箱已经被占用！")
            }
            user.email = data.email
        }
        if(typeof data.name === "string"){
            user.name = data.name
        }
        if(typeof data.age!=="undefined"){
            user.age = data.age
        }
        return user
    },
    creatPost(parent,args,{db,pubsub},info){
        const {data} = args
        const authorToken = db.users.some(user => user.id === data.author)
        if(!authorToken){
            throw new Error('该用户不存在')
        }
        let post = {
            id:uuid(),
            ...data
        }
        db.posts.push(post)
        if(data.published){
            console.log(111)
            pubsub.publish("post",{
                post:{
                    mutation:"CREATED",
                    data:post
                }
            })
        }
        return post
    },
    deletePost(parent,args,{db,pubsub},info){
        const {id} = args
        const post = db.posts.find(p=>p.id === id)
        if(!post){
            throw new Error('文章不存在')
        }
        db.posts = db.posts.filter(p => p.id !==id)
        db.comments = db.comments.filter(c => c.post !==id)
        if(post.published){
            pubsub.publish("post",{
                post:{
                    mutation:"DELETED",
                    data:post
                }
            })
        }
        return post
    },
    updatePost(parent,args,{db,pubsub},info){
        const {id, data} = args
        const post = db.posts.find(po => po.id === id)
        const oldPost = JSON.parse(JSON.stringify(post))
        if(!post){
            throw new Error('文章不存在')
        }
        if(typeof data.title === "string"){
            post.title = data.title
        }
        if(typeof data.body ==="string"){
            post.body = data.body
        }

        const updated = (post)=>{
            pubsub.publish("post",{
                post:{
                    mutation:"UPDATED",
                    data:post
                }
            })
        }

        if(typeof data.published === "boolean"){
            post.published = data.published
            console.log(oldPost.published , post.published)
            if(!oldPost.published && post.published){ //published  false -> true  created
                pubsub.publish("post",{
                    post:{
                        mutation:"CREATED",
                        data:post
                    }
                })
            }

            if(oldPost.published && !post.published){ //published  true -> false  DELETED
                pubsub.publish("post",{
                    post:{
                        mutation:"DELETED",
                        data:post
                    }
                })
            }

            if(oldPost.published && post.published){
                updated(post)
            }
        }else if(post.published){
            updated(post)
        }
        return post
    },
    creatComment(parent,args,{db,pubsub},info){
        const {data} = args
        const authorExit = db.users.some(user => user.id === data.author)
        const postExit = db.posts.some(po => po.id === data.post && po.published)

        if(!authorExit || !postExit){
            throw new Error('作者或者文章不存在!')
        }

        const comment = {
            id:uuid(),
            ...data
        }
        db.comments.push(comment)
        pubsub.publish(`comment ${data.post}`,{comment:{
            mutation:"CREATED",
            data:comment
        }})
        return comment
    },
    deleteComment(parent,args,{db,pubsub},info){
        const {id} = args
        const comment = db.comments.find(com => com.id === id)
        if(!comment){
            throw new Error("评论不存在")
        }
        db.comments = db.comments.filter(com => com.id !== id)
        pubsub.publish(`comment ${comment.post}`,{comment:{
            mutation:"DELETEDD",
            data:comment
        }})
        return comment
    },
    updateComment(parent,args,{db,pubsub},info){
        const {id, data} = args
        const comment = db.comments.find(com => com.id === id)
        if(!comment){
            throw new Error('评论不存在')
        }
        if(typeof data.text === "string"){
            comment.text = data.text
        }
        console.log(comment.post)
        pubsub.publish(`comment ${comment.post}`,{comment:{
            mutation:"UPDATED",
            data:comment
        }})
        return comment
    }
}
export {Mutation}