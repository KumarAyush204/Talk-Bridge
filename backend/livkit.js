const { AccessToken } =require('livekit-server-sdk');
const express=require('express');
const cors=require('cors');
const app=express();
const dotenv=require('dotenv');
dotenv.config();

app.use(cors(
{origin:[
  "https://talk-bridge-mm5r6j7al-kumar-ayushs-projects-8c0afea8.vercel.app",
  "http://localhost:3000"
]}
));
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get("/api/getToken",(req,res)=>{
    const participantName = req.query.participantName;
    const roomId=req.query.roomName;
    if (!participantName || !roomId) {
        return res.status(400).send("Missing participantName or roomName");
    }
    console.log(participantName,roomId);
    try{
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
    }
    catch(error){
        console.error(error);
    return res.status(500).send("Internal Server Error");
    }
    genToken();
    
})



const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}...`);
});