const mongoose = require('mongoose')
    //mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect("mongodb+srv://shubhamp:Kumar@123@cluster0.n5lab.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const conn = mongoose.connection
conn.on('connected', () => {
    console.log('connected')
    fun()
})
conn.on('error', () => {
    console.log('error')
})
async function fun() {
    //console.log(conn)
    let watchlist = [
        'fanny and alexander',
        'blade runner',
        'the elephant man',
        "monty python's life of brian"
    ]

    await conn.collection("login").findOne({ user: "sp1651999@gmail.com" }, { watchlist: 1, movie_visited: 1 }, (res, err) => {
        console.log(err)
    })
}