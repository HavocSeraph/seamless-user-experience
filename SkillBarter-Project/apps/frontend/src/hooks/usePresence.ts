import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';

export const usePresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('user.online', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    });

    socket.on('user.offline', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.off('user.online');
      socket.off('user.offline');
    };
  }, []);

  const isOnline = (userId: string) => onlineUsers.has(userId);

  return { isOnline, onlineUsers };
};
