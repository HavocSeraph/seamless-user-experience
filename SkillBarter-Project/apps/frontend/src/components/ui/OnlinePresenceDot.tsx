import React from 'react';
import { usePresence } from '../../hooks/usePresence';

interface Props {
  userId: string;
}

export const OnlinePresenceDot: React.FC<Props> = ({ userId }) => {
  const { isOnline } = usePresence();
  
  const online = isOnline(userId);

  return (
    <span 
      className={`inline-block w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
        online ? 'bg-green-500' : 'bg-gray-400'
      }`}
      title={online ? 'Online' : 'Offline'}
    />
  );
};
