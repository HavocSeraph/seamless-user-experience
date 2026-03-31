import React, { useState } from 'react';
import axios from 'axios';

export const CreateBountyModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rewardCoins, setRewardCoins] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/bounties', {
        title,
        description,
        category,
        rewardCoins: Number(rewardCoins)
      }, { withCredentials: true });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create bounty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Post a Bounty</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Help configuring Webpack for React"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Be specific)</label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                value={category} 
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Frontend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward (Tokens)</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                value={rewardCoins} 
                onChange={e => setRewardCoins(Number(e.target.value))}
                placeholder="50"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Bounty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};