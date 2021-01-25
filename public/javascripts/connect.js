const mongoose=require('mongoose')
//mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect("mongodb://shubham:12345@cluster0-shard-00-00.n5lab.mongodb.net:27017,cluster0-shard-00-01.n5lab.mongodb.net:27017,cluster0-shard-00-02.n5lab.mongodb.net:27017/test?ssl=true&replicaSet=atlas-12tbif-shard-0&authSource=admin&retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})

const conn=mongoose.connection
conn.on('connected',()=>{
    console.log('connected')
    //console.log(conn.db)
    //  var schema=new mongoose.Schema({
    //      name:{
    //          type:String,
    //          required:[true,'name is required fiel'],
    //          unique:[true,'name field should be unique']
    //      },
    //      pass:{
    //          type:String,
    //          required:[true,'pass is required fiel']
    //      }
    //  }
    //  )
    
    
    // var movie_model=mongoose.model('movies',schema)
    
    // console.log(movie_model)
   
    //     module.exports=conn 
    
    
    
    
})
conn.on('error',()=>{
    console.log('error')
})
module.exports=conn
