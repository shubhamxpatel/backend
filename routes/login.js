var express = require('express');
var router = express.Router();
var path = require('path')
var mongodb = require('mongodb')

//console.log(path.join(__dirname,'../public'))
var conn = require("../public/javascripts/connect.js")
var ans = ""
router.use((req, res, next) => {
        req.session.email = "shubham patel";
        console.log(req.cookies)
            //  res.setHeader('set-cookie', `connect.sid=; path=/; samesite=none; secure;`)
        next()
    })
    /* GET users listing. */
async function fun(req, response) {
    //console.log(req.session)
    let cursor = await conn.collection("login").find({ "user": req.email, "pass": req.pass })
    ans = await cursor.toArray()
    if (ans.length > 0) {
        console.log(ans)
        req.session.email = req.email

        // response.cookie('auth_token', "token", {
        //         expires: new Date(Date.now() + 300000),
        //         //httpOnly: true,
        //         samesite: 'strict',
        //         secure: true,
        //         // domain: 'localhost:5000',
        //         path: '/'
        //     })

        await response.setHeader("set-cookie", `auth_token=token; samesite=none; expires=${new Date(new Date().getTime()+60*60*1000*24).toGMTString()}; secure; httpOnly`)
            // console.log(response.req.rawHeaders)
        response.send({ "res": "login successful", "id": ans[0]._id, "cook": response.req.rawHeaders })
            //response.send({ "res": "login successful", "id": ans[0]._id })
        await conn.collection("login").updateMany({ "_id": mongodb.ObjectID(ans[0]._id) }, { $set: { "logStatus": 1 } })
            .then(res2 => {
                // console.log(res2)
            })
            .catch(err => {
                // console.log(err)
            })
        return

    } else {
        response.send({ "res": "login unsuccessful" })
        return
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
router.post('/checkEmail', async(req, res, next) => {
    let result = await conn.collection("login").find({ "user": req.body.email })
    let arr = await result.toArray()
    let x = (arr.length) ? false : true
    res.send({ checkResult: x })
})
router.post('/in', function(req, res, next) {
    let id = ""


    console.log(req.body, req.session)

    fun(req.body, res)
        //console.log(ans)
        //res.send(ans);
        //console.log(res)
});
router.get('/out/:id', function(req, res, next) {
    let id = ""
    req.session.ID = req.params.id
    console.log(req.params.id)
    fun1(req.params.id, res)
        //console.log(ans)
        //res.send(ans);
        //console.log(res)
});

module.exports = router;