import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type Notification = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export const useNotifications = () => {
  const queryClient = useQueryClient();
  
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('notification.new', (notification: Notification) => {
      queryClient.setQueryData(['notifications'], (old: Notification[] = []) => [notification, ...old]);
    });

    return () => {
      socket.off('notification.new');
    };
  }, [queryClient]);

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], []);
    }
  });

  return {
    notifications,
    markAllAsRead: () => markAllAsRead.mutate()
  };
};
