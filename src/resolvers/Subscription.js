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
    }
}

export {Subscription}