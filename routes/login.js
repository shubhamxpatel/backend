var express = require('express');
var router = express.Router();
var path = require('path')
var mongodb = require('mongodb')

//console.log(path.join(__dirname,'../public'))
var conn = require("../public/javascripts/connect.js")
var ans = ""

/* GET users listing. */
async function fun(req, response) {
    let cursor = await conn.collection("login").find({ "user": req.email, "pass": req.pass })
    ans = await cursor.toArray()
    if (ans.length > 0) {
        console.log(ans)
        response.cookie('name', ans[0]._id, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true,
            // domain:'.github.com',
            //secure: true,


        })
        response.send({ "res": "login successful", "id": ans[0]._id, "cook": "response.cookies" })
            //response.send({ "res": "login successful", "id": ans[0]._id })
        await conn.collection("login").updateMany({ "_id": mongodb.ObjectID(ans[0]._id) }, { $set: { "logStatus": 1 } })
            .then(res2 => {
                console.log(res2)
            })
            .catch(err => {
                console.log(err)
            })

    } else {
        response.send({ "res": "login unsuccessful" })
    }
    //response.send(ans)
    //console.log(p["ops"])
    //ans = p["ops"]
}
async function fun1(id, res) {
    await conn.collection("login").updateMany({ "_id": mongodb.ObjectID(id) }, { $set: { "logStatus": 0 } }).then(res1 => {
            res.send({ "res": 1 })
        })
        .catch(err => {
            res.send({ "res": 0 })
        })
}
router.post('/in', function(req, res, next) {
    let id = ""
    console.log(req.body)
    fun(req.body, res)
        //console.log(ans)
        //res.send(ans);
        //console.log(res)
});
router.get('/out/:id', function(req, res, next) {
    let id = ""
    console.log(req.params.id)
    fun1(req.params.id, res)
        //console.log(ans)
        //res.send(ans);
        //console.log(res)
});

module.exports = router;