const Query = {
    me(){
        return {
            id:'23aasdf',
            name:'Tom',
            email:"Tom@gamail.com",
            english:97.3
        }
    },
    users(parent,args,{db},info){
        let {query} = args
        if(query){
            return db.users.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
        }else{
            return db.users
        }
    },
    post(parent,args,{db},info){
        let {id} = args
        if(!id){
            return {
                id:'2342',
                title:'asdfasdfa',
                body:'sadfqewrq',
                published:true
            }
        }else{
            return db.posts.find(post => post.id === id)
        }
    },
    posts(parent,args,{db},info){
        let {query} = args
        if(!query){
            return db.posts
        }else{
            return db.posts.filter(post=>{
                const titleExist = post.title.toLowerCase().includes(query.toLowerCase())
                const bodyExist = post.body.toLowerCase().includes(query.toLowerCase())
                return titleExist || bodyExist
            })
        }
    },
    comments(parent,args,{db},info){
        return db.comments
    }
}

export {Query}