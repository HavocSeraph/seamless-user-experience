import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CreateBountyModal } from '../../components/bounties/CreateBountyModal';

export const BountyBoardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: bounties = [], isLoading } = useQuery({
    queryKey: ['bounties'],
    queryFn: async () => {
      // Mocked endpoint until full controller gets implemented if missed
      return []; 
    }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bounty Board</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Post a Bounty
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 animate-pulse">Loading bounties...</p>
      ) : bounties.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <h3 className="text-xl text-gray-500 font-medium">No open bounties right now</h3>
          <p className="text-gray-400 mt-2">Check back later or post your own question!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* BountyCards will go here */}
        </div>
      )}

      {isModalOpen && (
        <CreateBountyModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
