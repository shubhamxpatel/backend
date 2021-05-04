const mongoose = require('mongoose')
    //mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect("mongodb+srv://shubhamp:Kumar@123@cluster0.n5lab.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const conn = mongoose.connection
conn.on('connected', () => {
    console.log('connected')
	//conn.collection("actors").findOne({}).then(res=>{console.log(res)})
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
conn.on('error', () => {
    console.log('error')
})
module.exports = conn
