import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function connectSocket(accessToken: string): Socket {
  if (socket) return socket;

  socket = io(VITE_API_URL, {
    path: '/ws',
    auth: { token: accessToken },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Heartbeat: send every 20 seconds
  const heartbeatInterval = setInterval(() => {
    if (socket?.connected) {
      socket.emit('heartbeat');
    }
  }, 20_000);

  socket.on('disconnect', () => {
    clearInterval(heartbeatInterval);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}