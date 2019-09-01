const Subscription = {
    comment:{
        subscribe(parent,args,{db,pubsub},info){
            const {postId} = args
            const post = db.posts.find(post => post.id === postId && post.published)
            if(!post){
                throw new Error("没有找到文章")
            }
            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post:{
        subscribe(parent,args,{pubsub},info){
            return pubsub.asyncIterator("post")
        }
    }
}

export {Subscription}