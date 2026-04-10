import { useEffect, useState } from 'react';

export function OnlinePresence({ userId }: { userId: string }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Mock presence logic
    setIsOnline(Math.random() > 0.5);
  }, [userId]);

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
}
