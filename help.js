const { AsyncLocalStorage } = require('async_hooks')
var fs=require('fs')

let data=fs.readFileSync('help.txt')
let ans=data.toString()

let buff=new Buffer(ans,'base64')
//console.log('buff')
fs.writeFile('shubham.mp4',buff,'binary',(err)=>{
    console.log('failed')

})
