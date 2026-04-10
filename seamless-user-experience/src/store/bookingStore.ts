import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockSessions } from '@/lib/mock-data';

export interface SessionConfig {
  id: string;
  mentorId: string;
  studentId: string;
  skillId: string;
  skillTitle: string;
  mentorName: string;
  mentorAvatar: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "DISPUTED" | "CANCELLED";
}

interface BookingState {
  sessions: SessionConfig[];
  bookSession: (session: Omit<SessionConfig, 'id' | 'status'>) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      sessions: mockSessions as SessionConfig[],
      bookSession: (session) => set((state) => {
        const newSession: SessionConfig = {
          ...session,
          id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'PENDING',
        };
        return {
          sessions: [newSession, ...state.sessions],
        };
      })
    }),
    {
      name: 'booking-storage',
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'booking-storage') {
      useBookingStore.persist.rehydrate();
    }
  });
}