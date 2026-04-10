import { create } from 'zustand';

interface OnlineUsersState {
  onlineUsers: Set<string>;
  setOnline: (userId: string) => void;
  setOffline: (userId: string) => void;
  isOnline: (userId: string) => boolean;
}

export const useOnlineUsersStore = create<OnlineUsersState>((set, get) => ({
  onlineUsers: new Set(),
  setOnline: (userId) =>
    set((state) => {
      const newOnline = new Set(state.onlineUsers);
      newOnline.add(userId);
      return { onlineUsers: newOnline };
    }),
  setOffline: (userId) =>
    set((state) => {
      const newOnline = new Set(state.onlineUsers);
      newOnline.delete(userId);
      return { onlineUsers: newOnline };
    }),
  isOnline: (userId) => get().onlineUsers.has(userId),
}));