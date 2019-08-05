const Subscription = {
    somethingChanged:{
        subscribe(parent,args,{pubsub},info){
            let count = 0 
            setInterval(()=>{
                count++
                pubsub.publish("something_topic",{
                    somethingChanged:count
                })
            },1000)

            return pubsub.asyncIterator("something_topic")
        }
    },
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