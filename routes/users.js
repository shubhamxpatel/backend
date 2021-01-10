var express = require('express');
var router = express.Router();
var path=require('path')
var mongodb = require('mongodb');
//console.log(path.join(__dirname,'../public'))
var conn = require("../public/javascripts/connect.js")
var ans=""

/* GET users listing. */
async function fun(s,response){
	await conn.collection("comments").insertOne({"comment":s}).then(res=>{
		ans=res["ops"]
		console.log(ans)
		response.send(ans)
	})
	//console.log(p["ops"])
	//ans = p["ops"]
}
router.post('/', function(req, res, next) {
  let id=""
  if(req){
    id=req.body["comment"]
  }
  fun(id,res)
  //console.log(ans)
  //res.send(ans);
  //console.log(res)
});
async function fetch_user(id,response){
  console.log("_id:"+`ObjectId("${id}")`)
  await conn.collection("login").findOne({"_id":mongodb.ObjectID(id)}).then(res=>{
    
    console.log(res)
    if(res){
        //console.log(res.file.buffer.toString('base64'))
        response.send(res)
    }
    else{
        response.send({"res":"login unsuccessful1"})
    }
  })
  .catch(err=>{
    
      response.send({"res":"login unsuccessful2"})
  
  })
   
}
router.get('/:id',function(req,res,next){
  let id=req.params.id.toString()
  //console.log(id)
  fetch_user(id,res)
})

module.exports = router;
