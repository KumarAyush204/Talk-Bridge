import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {io} from 'socket.io-client';
import './stream.css';
 function StreamVideo(){
    const localvideoRef=useRef(null);
    const remotevideoRef=useRef(null);
    const [socket,cngsocket]=useState(null);
    const [peerConnection,cngPeerConnection]=useState(null);
    useEffect(()=>{
        
        const s=io("https://f1162585770d.ngrok-free.app",{
            transports: ["websocket"]
            });
        cngsocket(s);

        async function setPeerConnect(){
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localvideoRef.current.srcObject = stream;
            const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
            const peerConnection = new RTCPeerConnection(configuration);
            cngPeerConnection(peerConnection);

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });


            peerConnection.ontrack = (event) => {
            const remoteStream = event.streams[0];
            remotevideoRef.current.srcObject = remoteStream;
            };
            peerConnection.onicecandidate= (event)=>
                {
                    if(event.candidate){
                        s.emit('ice-candidate',event.candidate);
                    }
                };
            peerConnection.onconnectionstatechange=(event)=>{
                if(peerConnection.connectionState==="connected"){
                    console.log("Peers Connected");
                }
            };
        }
        setPeerConnect();
    
        
    },[]);
   useEffect(()=>{
    if (!socket || !peerConnection){
        return;
    }
    //Listens for offer from another user
    socket.on("offer",async (offer)=>{
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer",answer);

    });
    //Listens for answer from another user
    socket.on("answer",async (answer)=>{
        const remoteDesc = new RTCSessionDescription(answer);
        await peerConnection.setRemoteDescription(remoteDesc);
    });
   
   socket.on('ice-candidate',async (remoteicecandidate)=>{
    try{
    await peerConnection.addIceCandidate(remoteicecandidate);
    }
    catch(error){
        console.log("ICE candidate not added");
    }
   });
   return ()=>{
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
   };

   },[socket,peerConnection]);
     async function StartCall(){
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer",offer);
    }

    return(<div>
        <h1>Video Calling App</h1>
        <div className="video-grid">
        <video ref={localvideoRef} autoPlay playsInline />
        <video ref={remotevideoRef} autoPlay playsInline />
        </div>

        <button onClick={StartCall}>StartCall</button>
    </div>);
}

export default StreamVideo;