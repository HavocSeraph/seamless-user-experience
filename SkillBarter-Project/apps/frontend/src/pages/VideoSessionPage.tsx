import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference
} from '@livekit/components-react';
import '@livekit/components-styles';

export function VideoSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [token, setToken] = useState('');

  // Real world deployment would use environmental vars
  const serverUrl = 'wss://gsd-nipad1i5.livekit.cloud';

  useEffect(() => {
    // Basic fetch to our new endpoint
    const fetchToken = async () => {
      try {
        const id = sessionId || 'dummy-session-id';
        const res = await fetch(`http://localhost:3000/livekit/test-token/${id}`);
        const data = await res.json();
        if (data.token) setToken(data.token);
      } catch (error) {
        console.error('Failed to grab livekit token', error);
      }
    };

    fetchToken();
  }, [sessionId]);

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Loading secure session...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-950 text-white">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        // Use the default LiveKit components or customize fully
        data-lk-theme="default"
        style={{ height: '100vh' }}
        onDisconnected={() => {
          // Send completion trigger when user disconnects
          // For now, redirect to the Dashboard to do session feedback
          window.location.href = '/dashboard?sessionEnd=' + sessionId;
        }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
