import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar as CalendarIcon, Clock, Coins } from 'lucide-react';

export function BookingModal({ skill, isOpen, onClose }: { skill: any, isOpen: boolean, onClose: () => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('14:00');
  const queryClient = useQueryClient();

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!date) return;
      const scheduledAt = new Date(date);
      const [hours, minutes] = time.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      const res = await fetch('http://localhost:3000/sessions/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          skillId: skill.id,
          providerId: skill.userId, 
          scheduledAt: scheduledAt.toISOString(),
          duration: 60,
          priceCoins: skill.priceCoins
        })
      });
      if (!res.ok) throw new Error('Booking failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletStats'] });
      onClose();
      alert('Session booked successfully! Escrow locked.');
    }
  });

  if (!skill || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Book a Session</h2>
          <p className="text-gray-600">
            You are about to book <strong>{skill.title}</strong> with {skill.user?.name || skill.teacherName}.
          </p>
        </div>

        <div className="grid gap-4 py-4">
          <div className="bg-gray-50 rounded-lg p-4 border flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Cost per Hour</span>
            <span className="text-xl font-bold flex items-center text-blue-600"> 
              {skill.priceCoins} <Coins className="w-5 h-5 ml-1" />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</label>
              <div className="border rounded-md p-2 flex items-center bg-white">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                <input
                  type="date"
                  value={date ? date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  className="w-full bg-transparent outline-none text-sm"        
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</label>
              <div className="border rounded-md p-2 flex items-center bg-white">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <input
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"        
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-center text-gray-500 mt-2">
            By confirming, {skill.priceCoins} coins will be locked in escrow.   
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 border rounded" onClick={onClose} disabled={bookMutation.isPending}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" onClick={() => bookMutation.mutate()} disabled={bookMutation.isPending || !date}>
            {bookMutation.isPending ? 'Locking Escrow...' : 'Confirm Booking'}  
          </button>
        </div>
      </div>
    </div>
  );
}