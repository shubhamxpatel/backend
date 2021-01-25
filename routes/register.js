var express = require('express');
var router = express.Router();
var path=require('path')
var fileupload=require('express-fileupload')
var fs=require('fs')
var binary=require('mongodb').Binary 
//var multer=require('multer')
//var grid=require('gridfs-stream')

//console.log(path.join(__dirname,'../public'))
var {conn} = require("../public/javascripts/connect.js");
const { Z_BINARY } = require('zlib');
const { deleteuser } = require('./users.js');
var ans=""
router.use(fileupload())
/* GET users listing. */
async function fun(image,req,response){
    console.log(image.name)

    let check=await conn.collection("login").find({"user":req.body.email})
    let r=await check.toArray()
    //console.log(r.length)
    if(r.length===0){
        let data1=image.data
        delete(image.data)
        await conn.collection("user_image").insertOne(image).then(async res2=>{
            let id=res2["ops"][0]._id
            console.log(id)
            const up_path=path.join(__dirname,'../../back/public/images/')
            console.log(up_path)
            let ext=image.name.split(".")
            let title=ext[ext.length-1]
            //await image.mv(`${up_path}${id}.${title}`).then(async ()=>{
                await conn.collection("login").insertOne({"user":req.body.email,"pass":req.body.pass,"img":`${id}`,"type":image.mimetype,"file":binary(data1),"logStatus":0})
                .then(res=>{
                    console.log("Registration Successful")  
                    response.send({"res":"Registration Successful!"})
                })
                .catch(err=>{
                    response.send(err)
                })
                
            /*}).catch(err=>{
                console.log(err)
                response.send({"res":"image uploading failed retry1"})
            })*/
        })
        .catch(err=>{
            response.send({"res":"image uploading failed retry2"})
        })
        
    }
    else{
        response.send({"res":"email already registered"})
    }
    
	//console.log(p["ops"])
	//ans = p["ops"]
}
router.post('/', function(req, res, next) {
  const image=req.files.image
  console.log(image)
//   fs.writeFile(image.name,image.data,function(err){
//             if(err){throw err}
//             console.log('file written')
//   })
// fs.writeFile('image1.txt',binary(image.data),(err)=>{
//     if(err){throw err}
//     console.log("file written")
// })
        //          console.log(image.data.toString('binary'))  
  fun(image,req,res)
});
async function fun1(req,res){
    let result=await conn.collection("login").find({"user":req.params.image},{})
    await result.toArray().then(data=>{
        let buff=new Buffer(data[0].file.buffer.toString('base64'),'base64')
        fs.writeFileSync(req.params.image+".png",buff)
        //console.log(data[0].file.buffer.toString('base64'))
        res.render('index',{title:"data:image/png;base64,"+data[0].file.buffer.toString('base64'),user:req.params.image+".png"})    
    })
    .catch(err=>{
        throw err
    })

}
router.get('/addmovie',(req,res)=>{
    res.render('addmovie')
})
router.get('/:image',(req,res)=>{
    console.log(req.params.image)

   
    fun1(req,res)
})

module.exports = router;
