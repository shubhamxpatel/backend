var express = require('express');
var router = express.Router();
var conn = require('../public/javascripts/connect.js')
var mongodb = require('mongodb')
    /* GET home page. */
async function login(req, res) {
    let admin = req.body.admin
    let pass = req.body.pass
    console.log(admin, pass)
    await conn.collection("admin").findOne({ "admin": admin, "pass": pass }, {}).then((resp) => {
            console.log(resp)
            if (resp) {
                console.log("yes")
                res.cookie('name', resp.admin, {
                        expires: new Date(Date.now() + 300000),
                        httpOnly: true,
                        //secure: true,

                        path: '/'
                    })
                    //console.log(res.cookies.name)
                res.send({ "id": resp._id })


            } else {
                console.log("no")
                res.send({ "result": "wrong credentials" })
            }
        })
        .catch((err) => {
            throw err
        })
}

router.post('/login', function(req, res, next) {
    console.log(req.body)
        //res.render('index',{msg:"hello"})
    login(req, res)
});
router.get('/login', (req, res, next) => {
    console.log(req.body, req.params)
    res.redirect('/')
})

router.get('/user/:id', async(req, res, next) => {
    //console.log(req.params.id);
    if (mongodb.ObjectId.isValid(req.params.id)) {
        console.log("Valid ObjectID")
        await conn.collection("admin").findOne({ _id: mongodb.ObjectId(req.params.id) }, {}).then((resp) => {
                console.log(resp)
                if (resp) {
                    console.log("yes")

                    res.send({ "user_name": resp.name, "correct": "yes" })

                } else {
                    console.log("no")
                    res.send({ "result": "wrong credentials" })
                }
            })
            .catch((err) => {
                throw err
            })
    }
    /**/
    else {
        res.send({})
    }

})


module.exports = router;