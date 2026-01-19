const express=require('express');
const cors=require('cors');
const http=require('http');

const app=express();
const {Server}=require('socket.io');
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:'*'}});
app.use(cors({
    origin: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

io.on('connection',(socket)=>{
    console.log("Connected with client",socket.id);
   

    socket.on('offer',(offer)=>{
        console.log(offer);
        socket.broadcast.emit('offer',offer);
    });
    
    socket.on('answer',(answer)=>{
        console.log(answer);
        socket.broadcast.emit('answer',answer);
    });

    socket.on('ice-candidate',(candidate)=>{
        console.log(candidate);
        socket.broadcast.emit('ice-candidate',candidate);
    })

});

let offer=null;
let answer=null;




//User A -> Create Offer -> Server -> User B -> Sees Offer -> Create Answer -> Server send back answer to user A -> User A receives answer and then connect.

server.listen(5003,()=>{
    try{
    console.log("Server Running ");
    }
    catch(error){
        console.log(error);
    }
    
});