const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var path = require('path')
var mongodb = require('mongodb');
var conn = require('../public/javascripts/connect.js');

const { response } = require('express');
var actorschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'actor name is empty'],
        unique: true
    },
    img_url: {
        type: String,
        required: [true, 'image url is empty'],
        unique: true
    },
    wiki_link: {
        type: String,
        required: [true, 'wikipedia link is empty'],
        unique: true
    },
})
let actormodel = new mongoose.model("actor", actorschema)
var movieschema = new mongoose.Schema({
    movie_name: {
        type: String,
        required: [true, 'name is required field'],
        unique: [true, 'name field should be unique']
    },
    movie_trailer: {
        type: String,
        required: [true, 'movie_trailer is required field'],
        unique: [true, 'movie_trailer field should be unique']
    },
    poster_url: {
        type: String,
        required: [true, 'poster_url fieldd is empty'],
    },
    director_name: {
        type: String,
        required: [true, 'director name field cannot be empty']
    },
    run_time: {
        type: Number,
        required: [true, 'time duration is not filled']
    },
    admin: {
        type: String,
        required: [true, 'admin field is empty']
    },
    movie_lang: {
        type: Array
    },
    actors: {
        type: Array
    },
    movie_gener: {
        type: Array
    },
    story: {
        type: String,
        required: [true, 'story field cannot be empty']
    },
    like: {
        type: Number,
        default: 0
    },
    page_visited: {
        type: Number,
        default: 0
    },
    release_date: {
        type: Date,
        required: [true, 'releasing date cannot be empty']
    },
    dislike: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date()
    }
})

var moviemodel = new mongoose.model("movie", movieschema)
router.use((req, res, next) => {
    if (req.session.ID) {
        next()
    } else {
        res.send({ auth: 0 })
    }
})

router.post('/', async(req, res, next) => {
    delete req.body.movie_data.actor
    delete req.body.movie_data.language
    delete req.body.movie_data.gener
    req.body.movie_data.name = req.body.movie_data.movie_name.toLowerCase()
    console.log(req.body.movie_data)
    let movie = new moviemodel(req.body.movie_data)
    await movie.save().then(response => {
            console.log(response)
            res.send({ "result": "movie added" })
        })
        .catch(err => {
            console.log(err)
            res.send({ "result": "unable to add movie" })
        })

})
router.get('/:name', async(req, response, next) => {
    let name = req.params.name.toLowerCase()
    console.log("my name is", name)
    await moviemodel.findOne({ movie_name: name }, { _id: 0 })
        .then(async res => {
            console.log(res)

            if (res) {
                await moviemodel.updateOne({ movie_name: name }, { $inc: { page_visited: 1 } }, (err4, res4) => {})

                await conn.collection("login").findOne({ _id: mongodb.ObjectId(req.session.ID) }, (async(errr, resr) => {
                    if (resr.movie_visited.includes(name) === false) { resr.movie_visited.push(name) }
                    resr.watchlist = resr.watchlist.filter((x) => { return x !== name })
                    resr.watchlist.push(name)
                    console.log(resr.movie_visited, resr.watchlist)
                    await conn.collection("login").updateOne({ _id: mongodb.ObjectId(req.session.ID) }, { $set: { movie_visited: resr.movie_visited, watchlist: resr.watchlist } }, (err7, res7) => {
                        console.log(err7, res7)
                        res.auth = 1
                        response.send(res);
                    })


                }))


            } else {
                console.log("movie not found")
                await conn.collection("pendingmovies").insertOne({ name: req.params.name }, (err5, res5) => { console.log(res5) })
                res.send({ auth: 1 })

            }

        })
        .catch(async err => {

            response.send(err)

        })
})
router.post('/addactor', async(req, res, next) => {
    let actor = new actormodel({ name: req.body.name.toLowerCase(), img_url: req.body.img_url, wiki_link: req.body.wiki })
    await conn.collection("actors").update({ name: req.body.name.toLowerCase() }, { name: req.body.name.toLowerCase(), img_url: req.body.img_url, wiki_link: req.body.wiki }, { upsert: true }).then(response => {
            console.log(response)
            res.send({ "error": "no_errors" })
        })
        .catch(err => {
            console.log(err)
            res.send({ "error": "unable to insert actor into ddatabase" })
        })
})

router.get('/actor/:data', async(req, res, next) => {
    console.log(req.params.data)
    let actor = req.params.data.toLowerCase()
    await actormodel.findOne({ name: actor }, { _id: 0, name: 1, img_url: 1, wiki_link: 1 }).then(response => {
        console.log(response)
        res.send({ "actor_name": response.name, "img_url": response.img_url, "wiki_link": response.wiki_link })
    }).catch(err => {
        res.send({ "result": "actor not in database" })
    })

})
module.exports = router