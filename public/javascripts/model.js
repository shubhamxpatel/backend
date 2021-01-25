const mongoose = require('mongoose');
var conn=require('./connect.js')
var schema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required fiel'],
        unique:[true,'name field should be unique']
    },
    pass:{
        type:String,
        required:[true,'pass is required fiel']
    },
    createTime:{
        type:Date,
        default:Date()
    }
}
)
 
  
setTimeout(async () => {
    var movie_model=mongoose.model('movies',schema)
  let models=new movie_model({"name":"spgshdfgjkdsbvghghg479gh644","pass":"12345"})
  await models.save().then(res=>{
    console.log(res)
  }).catch(err=>{
    for(let key in err)
    {
      console.log(key,err[key])
    }
  })
   console.log(Date())
   //console.log(mongoose.connection.db)
    //console.log(mongoose.connection.db)
}, 15000);