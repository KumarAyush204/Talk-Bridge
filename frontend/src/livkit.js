import { useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";

function VideoApp() {
  const [token, setToken] = useState('');
  const [activeRoomId, setActiveRoomId] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [joinUsername, setJoinUsername] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  
  const livekitURL = "wss://video-caliing-w6rjaq2s.livekit.cloud";
  async function fetchToken(participantName, roomName) {
    try {
      const response = await axios.get(
      "https://talkbridge-backend-maid2sjnh-kumar-ayushs-projects-8c0afea8.vercel.app/api/getToken",
      {
        params: {
          participantName,
          roomName,
        },
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
      setToken(response.data);
      setActiveRoomId(roomName); 
    } catch (e) {
      console.error("Failed to get token:", e);
    }
  }
  const handleCreate = () => {
    if (!createUsername) {
        alert("Please enter your name"); 
        return;
    }
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const sanitizedUsername = createUsername.replace(/\s+/g, '_');
    const roomName = `${sanitizedUsername}-${uniqueSuffix}`;
    fetchToken(createUsername, roomName);
  };
  const handleJoin = () => {
    if (!joinUsername || !joinRoomId) {
        alert("Please enter both your name and the Room ID"); 
        return;
    }
    fetchToken(joinUsername, joinRoomId);
  };
  if (token) {
    return (
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>

        <div style={styles.topBar}>
            <span style={{color: '#666'}}>You are in Room:</span>
            <span style={styles.roomIdDisplay}>{activeRoomId}</span>
            <button 
                onClick={() => {navigator.clipboard.writeText(activeRoomId); alert("Copied!")}}
                style={styles.copyButton}
            >
                Copy
            </button>
        </div>

        <div style={{flex: 1}}>
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={livekitURL}
                data-lk-theme="default"
                style={{ height: '100%' }}
                onDisconnected={() => { setToken(''); setActiveRoomId(''); }}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{marginBottom: '20px'}}>Video App</h1>
        <div style={styles.section}>
            <h3 style={styles.header}>Create a Meeting</h3>
            <p style={styles.subText}>We will generate a unique Room ID for you.</p>
            
            <input
                type="text"
                placeholder="Enter your Name"
                value={createUsername}
                onChange={(e) => setCreateUsername(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleCreate} style={styles.createButton}>
                Start Meeting
            </button>
        </div>

        <div style={styles.divider}>
            <span style={styles.orText}>OR</span>
        </div>
        <div style={styles.section}>
            <h3 style={styles.header}>Join a Meeting</h3>
            
            <input
                type="text"
                placeholder="Your Name"
                value={joinUsername}
                onChange={(e) => setJoinUsername(e.target.value)}
                style={{...styles.input, marginBottom: '10px'}}
            />
            <input
                type="text"
                placeholder="Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleJoin} style={styles.joinButton}>
                Join Meeting
            </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
    backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif', padding: '20px'
  },
  card: {
    backgroundColor: 'white', padding: '30px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center'
  },
  section: { textAlign: 'left', marginBottom: '10px' },
  header: { margin: '0 0 5px 0', fontSize: '18px', color: '#333' },
  subText: { margin: '0 0 15px 0', fontSize: '13px', color: '#666' },
  input: {
    width: '100%', padding: '12px', fontSize: '15px', borderRadius: '6px',
    border: '1px solid #ccc', marginBottom: '15px', boxSizing: 'border-box'
  },
  createButton: {
    width: '100%', padding: '12px', fontSize: '16px', fontWeight: 'bold',
    backgroundColor: '#0066ff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
  },
  joinButton: {
    width: '100%', padding: '12px', fontSize: '16px', fontWeight: 'bold',
    backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
  },
  divider: {
    position: 'relative', height: '20px', margin: '25px 0', borderBottom: '1px solid #ddd', textAlign: 'center'
  },
  orText: {
    position: 'absolute', top: '10px', left: '50%', transform: 'translate(-50%, 0)',
    backgroundColor: 'white', padding: '0 10px', color: '#999', fontSize: '14px'
  },
  topBar: {
    backgroundColor: '#fff', padding: '10px 20px', borderBottom: '1px solid #ddd',
    display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center'
  },
  roomIdDisplay: {
    backgroundColor: '#eef', padding: '5px 10px', borderRadius: '4px', 
    fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px', border: '1px solid #ccd'
  },
  copyButton: {
    padding: '5px 10px', fontSize: '12px', cursor: 'pointer'
  }
};

export default VideoApp;