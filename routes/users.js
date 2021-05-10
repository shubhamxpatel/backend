var express = require('express');
var router = express.Router();
var path = require('path')
var mongodb = require('mongodb');
var conn = require('../public/javascripts/connect.js')

/* GET users listing. */

router.use((req, res, next) => {
    console.log(req.session)
    if (req.session.ID) {
        res.setHeader('set-cookie', `auth=1;`) // expires=${new Date(new Date().getTime()+60 * 60 * 1000 * 24*30)}; path=/; samesite=none; secure;`);
        next()
    } else {
        res.setHeader('set-cookie', `auth=0;`) // expires=${new Date(new Date().getTime()+60 * 60 * 1000 * 24*30)}; path=/; samesite=none; secure;`);
        res.send({ auth: 0 })
    }
})
async function fetchr(watchlist, i, response, movies, res) {
    if (i == -1) {
        delete res.watchlist
        console.log(movies)
        res.movie = movies

        //console.log(res.file.buffer.toString('base64'))
        response.send(res)
    } else {
        let rr = await conn.collection("recommend").aggregate([{ $match: { movie: watchlist[i] } },
            { $project: { recommendArr: { movie_name: 1, poster_url: 1 }, _id: 0 } },

        ])
        rr.toArray().then(rr1 => {
            //console.log(rr1[0].recommendArr)
            rr1[0].recommendArr.splice(9)
                // console.log(rr1[0].recommendArr.length)
            movies = [...movies, ...rr1[0].recommendArr]
            i = i - 1;
            fetchr(watchlist, i, response, movies, res)

        })
    }
}
// async function fun(s, response) {
//   await conn.collection("comments").insertOne({ "comment": s }).then(res => {
//     ans = res["ops"]
//     console.log(ans)
//     response.send(ans)
//   })
//   //console.log(p["ops"])
//   //ans = p["ops"]
// }
// router.post('/', function (req, res, next) {
//   let id = ""
//   if (req) {
//     id = req.body["comment"]
//   }
//   fun(id, res)
//   //console.log(ans)
//   //res.send(ans);
//   //console.log(res)
// });
async function fetch_user(id, response) {
    console.log("_id:" + `ObjectId("${id}")`)
    await conn.collection("login").findOne({ "_id": mongodb.ObjectID(id) }).then(async res => {

            console.log(res)
            if (res) {
                res.auth = 1
                delete res.pass
                delete res._id
                res.watchlist.splice(0, res.watchlist.length - 4)
                console.log(res.watchlist)
                let movies = []
                await fetchr(res.watchlist, 3, response, movies, res)



            } else {
                res.auth = 0
                response.send({ "res": "login unsuccessful1" })
            }
        })
        .catch(err => {

            response.send({ "res": "login unsuccessful2" })

        })

}
router.get('/', function(req, res, next) {
    let id = req.session.ID
        //console.log(id)
    fetch_user(id, res)
})

/*async function create(req, res) {
  let email = req.body.email
  let otp = Math.floor(Math.random() * 1000000).toString()
  //console.log(otp)
  let mailOptions = {
    from: 'sp1651999@gmail.com',
    to: email,
    subject: 'email authentication',
    html: `<p>your otp for movie recommendation website is <strong>${otp}</strong></p>`,
  };


  
    await conn.collection("otp").insertOne({ "otp": otp }).then(result => {
      console.log(result, otp)
      res.send({ "auth_id": result.insertedId })
    }).catch(err => {
      throw err
    })

  

}

router.post('/createotp', (req, res) => {
  console.log(req.body)
  //res.send({"otp":"hello"})
  create(req, res)
})

async function verifyotp(req, response) {
  let otp = req.body.otp
  let auth_id = req.body.auth_id
  await conn.collection("otp").findOne({ "_id": mongodb.ObjectId(auth_id) }, {}).then(res => {
    console.log(res)
    if (res.otp !== null && res.otp === otp) {
      console.log(res)
      response.send({ "res": "otp verified" })
    }
    else {
      response.send({ "res": "otp not verified" })
    }
  }).catch(err => { throw err })
}
router.post('/verifyotp', (req, res) => {
  console.log(req.body)
  verifyotp(req, res)
})*/
module.exports = router;