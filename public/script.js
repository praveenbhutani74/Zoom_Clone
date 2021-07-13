const socket=io('/');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
    var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

const VideoGrid=document.getElementById('video-grid');

const myPeer=new Peer(undefined,{

    host:'/',
    port:'3001',
    
})

const myVideo=document.createElement('video');
myVideo.muted=true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(function(stream){

    addVideo(myVideo,stream);

    myPeer.on('call',function(call){
        call.answer(stream);
    })

    socket.on('user-connected',function(userId){
        connectToNewUser(userId,stream);
    })
})

myPeer.on('open',function(id){
    console.log(ROOM_ID,id);
    socket.emit('join-room',ROOM_ID,id);
    
})

function connectToNewUser(userId,stream){

    const call=myPeer.call(userId,stream);
    const video=document.createElement('video');
    call.on('stream',function(userMedia){
        addVideo(video,userMedia);
    })
    call.on('close',function(){
        video.remove();
    })

}


function addVideo(video,stream){

    video.srcObject=stream;
    video.addEventListener('loadedmetadata',function(){
        video.play();
    })
    VideoGrid.append(video);
}