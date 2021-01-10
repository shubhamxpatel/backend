const app = require('express')();

const options = { /* ... */ };
var server=app.listen(6000,()=>{console.log("server start at 4000 port")});
//console.log(server)
server.on('listening',()=>{
    //console.log(server)
    const io = require('socket.io')(server);
    console.log("socket established")



io.on('connection', socket => { console.log("hello")});
})


