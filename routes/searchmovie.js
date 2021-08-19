var express = require('express');
var router = express.Router();
var path = require('path')
var fetch = require('node-fetch')
var mongodb = require('mongodb');
var conn = require('../public/javascripts/connect.js');
var nightupdate = require('../dailyUpdate')


router.use((req, res, next) => {

    if (req.session.ID) {
        next()
    } else {
        res.send({ auth: 0, movie: [] })
    }
})
async function getmovie(s) {
    let arr = s.split(" ")
    let result = await conn.collection("movies").aggregate([{
            $addFields: {
                arr1: { $split: ['$movie_name', " "] }
            }
        },
        {
            $project: {
                ans1: { $size: { $setIntersection: [arr, '$arr1'] } },
                ans2: { $size: { $setUnion: [arr, '$arr1'] } },
                movie_name: '$movie_name',
                poster_url: '$poster_url'
            }
        },
        {
            $addFields: {
                ans3: { $divide: ['$ans1', '$ans2'] }
            }
        },
        {
            $match: {
                poster_url: { $not: { $eq: "N/A" } },
                ans3: { $gt: 0 }
            }
        },
        {
            $project: {
                movie_name: 1,
                poster_url: 1,
                ans3: 1,
                _id: 0
            }
        },
        {
            $sort: { ans3: -1 }
        },

        {
            $limit: 10
        }


    ])
    let res = await result.toArray()
    return res;
}

async function getLang(s) {
    let result = await conn.collection("movies").aggregate([{ $match: { movie_lang: s, poster_url: { $not: { $eq: "N/A" } } } }, { $project: { movie_name: 1, poster_url: 1, _id: 0 } }, { $limit: 20 }])
    let arr = await result.toArray()
    return arr
}
async function getActor(s) {
    let result = await conn.collection("movies").aggregate([{ $match: { movie_actors: s, poster_url: { $not: { $eq: "N/A" } } } }, { $project: { movie_name: 1, poster_url: 1, _id: 0 } }, { $limit: 20 }])
    let arr = await result.toArray()
    return arr
}

async function getGener(s) {
    let result = await conn.collection("movies").aggregate([{ $match: { movie_gener: s, poster_url: { $not: { $eq: "N/A" } } } }, { $project: { movie_name: 1, poster_url: 1, _id: 0 } }, { $limit: 20 }])
    let arr = await result.toArray()
    return arr
}

async function getDirector(s) {
    let result = await conn.collection("movies").aggregate([{ $match: { director_name: s, poster_url: { $not: { $eq: "N/A" } } } }, { $project: { movie_name: 1, poster_url: 1, _id: 0 } }, { $limit: 20 }])
    let arr = await result.toArray()
    return arr
}
async function getYear(s) {
    let result = await conn.collection("movies").aggregate([{ $addFields: { year: { $dateToString: { format: "%Y", date: "$release_date" } } } }, { $match: { year: s, poster_url: { $not: { $eq: "N/A" } } } }, { $project: { movie_name: 1, poster_url: 1, _id: 0 } }, { $skip: parseInt(0) }, { $limit: parseInt(20) }])
    let arr = await result.toArray()
    return arr
}

router.get('/', async(req, res, next) => {
    let name = req.query.name.toLowerCase()
    let value = req.query.value.toLowerCase()
    let p = []
    if (name === "movie") {
        p = await getmovie(value)
        res.send({ movie: p, auth: 1 })
        if (p.length == 0 || p[0].movie_name !== value) {
            console.log("movie_not found")
            await conn.collection("pendingmovies").insertOne({ name: value }, (err5, res5) => {
                console.log(res5);
                fetch('https://spmovieserver.herokuapp.com')
                    //nightupdate()
            })
        }
    }
    if (name === "year") {
        p = await getYear(value)
        res.send({ movie: p, auth: 1 })
    }
    if (name === "lang") {
        p = await getLang(value)
        res.send({ movie: p, auth: 1 })
    }
    if (name === "actor") {
        p = await getActor(value)
        res.send({ movie: p, auth: 1 })
    }
    if (name === "gener") {
        p = await getGener(value)
        res.send({ movie: p, auth: 1 })

    }
    if (name === "director") {
        p = await getDirector(value)
        res.send({ movie: p, auth: 1 })
    }

    console.log(p)

})

module.exports = router