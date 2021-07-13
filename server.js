
const express=require("express");
const{Server}=require("socket.io");
const app=express();
const http=require("http");


const server=http.createServer(app);

const io=new Server(server);
const {v4: uuidV4}=require("uuid");

app.set('view engine','ejs');
app.use(express.static('public'));


app.get('/',function(req,res){
res.redirect(`/${uuidV4()}`);

});

app.get('/:room',function(req,res){
    res.render('room',{roomId:req.params.room});
})

io.on('connction',function(socket){
    socket.on('join-room',function(roomId,userId){
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);
    })
})

server.listen(5500,function(){
    console.log("server started");
})