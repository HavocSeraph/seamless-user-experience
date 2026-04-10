import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

export function Notifications() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock WebSocket connection
    const ws = new WebSocket('ws://localhost:8080/notifications');
    
    ws.onmessage = (event) => {
      setNotifications((prev) => [event.data, ...prev]);
      setUnreadCount((c) => c + 1);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="relative">
      <Button variant="ghost" className="relative" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
}
