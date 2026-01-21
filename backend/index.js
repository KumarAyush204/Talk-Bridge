// const express=require('express');
// const cors=require('cors');
// const http=require('http');

// const app=express();
// const {Server}=require('socket.io');
// const server=http.createServer(app);
// const io=new Server(server,{cors:{origin:'*'}});
// app.use(cors({
//     origin: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));

// io.on('connection',(socket)=>{
//     console.log("Connected with client",socket.id);
   

//     socket.on('offer',(offer)=>{
//         console.log(offer);
//         socket.broadcast.emit('offer',offer);
//     });
    
//     socket.on('answer',(answer)=>{
//         console.log(answer);
//         socket.broadcast.emit('answer',answer);
//     });

//     socket.on('ice-candidate',(candidate)=>{
//         console.log(candidate);
//         socket.broadcast.emit('ice-candidate',candidate);
//     })

// });

// let offer=null;
// let answer=null;




// //User A -> Create Offer -> Server -> User B -> Sees Offer -> Create Answer -> Server send back answer to user A -> User A receives answer and then connect.

// server.listen(5003,()=>{
//     try{
//     console.log("Server Running ");
//     }
//     catch(error){
//         console.log(error);
//     }
    
// });

const { AccessToken } = require('livekit-server-sdk');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://talk-bridge-hvdhbxt86-kumar-ayushs-projects-8c0afea8.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.get("/api/getToken", async (req, res) => {
  const participantName = req.query.participantName;
  const roomId = req.query.roomName;

  if (!participantName || !roomId) {
    return res.status(400).send("Missing participantName or roomName");
  }

  try {
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity: participantName,
    });

    at.addGrant({ roomJoin: true, room: roomId });

    const token = await at.toJwt();
    return res.send(token);

  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).send("Internal Server Error");
  }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
        console.log(`Server Running on port ${PORT}...`);
    });
}

module.exports = app;