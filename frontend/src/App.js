import { useEffect, useRef } from "react";

function App() {
  const localVideoRef = useRef(null); // reference to <video>

  useEffect(() => {
    async function startMedia() {
      try {
        // Get video + audio stream from the default devices
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        // Attach stream to <video>
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        console.log("MediaStream:", stream);
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
      }
    }

    startMedia();
  }, []);

  return (
    <div>
      <h1>Video Calling App</h1>
      {/* Video element to show your camera */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted // mute self to avoid echo
        style={{ width: "400px", height: "300px", background: "black" }}
      />
    </div>
  );
}

export default App;
