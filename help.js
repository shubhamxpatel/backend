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
    let rr = await conn.collection("recommend").aggregate([{ $match: { movie: "queen" } },
        { $project: { recommendArr: { movie_name: 1, poster_url: 1 }, _id: 0 } },

    ])
    let rr1 = await rr.toArray()
    console.log(rr1[0])
}