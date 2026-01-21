const { AccessToken } =require('livekit-server-sdk');
const express=require('express');
const cors=require('cors');
const app=express();
const dotenv=require('dotenv');
dotenv.config();

app.use(cors(
{origin:'http://localhost:3000'}
));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// const roomName = 'room1';
let count=1;




app.get("/api/getToken",(req,res)=>{
    count++;
    const participantName = req.query.participantName;
    const roomId=req.query.roomName;
    console.log(participantName,roomId);
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomId });
    let token=null;
    async function genToken(){
    token = await at.toJwt();
    console.log('access token', token);
    return res.send(token);
    }
    genToken();
    
})



app.listen(5005,()=>{
    console.log("Server Running...");
});