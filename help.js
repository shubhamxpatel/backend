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
    let movies = []
    for (let m = watchlist.length - 1; m >= 0; m--) {
        let rr = await conn.collection("recommend").aggregate([{ $match: { movie: watchlist[m] } },
            { $project: { recommendArr: { movie_name: 1, poster_url: 1 }, _id: 0 } },

        ])
        rr.toArray().then(rr1 => {
            console.log(rr1[0].recommendArr)
            rr1[0].recommendArr.splice(0, 5)
            movies = [...movies, ...rr1[0].recommendArr]
            if (m === 0) {

            }
        })
    }
}