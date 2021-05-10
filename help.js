const mongoose = require('mongoose')
const mongodb = require('mongodb')
    //mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect("mongodb+srv://shubhamp:Kumar@123@cluster0.n5lab.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const conn = mongoose.connection
conn.on('connected', () => {
    console.log('connected')
    fun("apocalypse now")
})
conn.on('error', () => {
    console.log('error')
})
async function fun(name) {
    //console.log(conn)
    await conn.collection("login").findOne({ _id: mongodb.ObjectId("6098f8d2fb580c002452cc9f") }, ((errr, resr) => {
        if (resr.movie_visited.includes(name) === false) { resr.movie_visited.push(name) }
        resr.watchlist = resr.watchlist.filter((x) => { return x !== name })
        resr.watchlist.push(name)
        console.log(resr.movie_visited, resr.watchlist)



    }))
}