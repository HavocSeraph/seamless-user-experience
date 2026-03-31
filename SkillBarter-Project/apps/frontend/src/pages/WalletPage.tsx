import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Flame, Star, Coins } from 'lucide-react';
import axios from 'axios';
import CountUp from 'react-countup';

// Mocking custom fetcher assuming auth interceptor exists
const api = axios.create({ baseURL: 'http://localhost:3000' });

export function WalletPage() {
  const [filterType, setFilterType] = useState('All Types');

  const { data: balanceData } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => (await api.get('/wallet/balance')).data
  });

  const { data: summaryData } = useQuery({
    queryKey: ['wallet', 'summary'],
    queryFn: async () => (await api.get('/wallet/summary')).data,
    staleTime: 30000,
  });

  const { data: txData } = useQuery({
    queryKey: ['transactions', 'me', filterType],
    queryFn: async () => {
      const typeParams = filterType !== 'All Types' ? `?type=${filterType}` : '';
      return (await api.get(`/transactions/me${typeParams}`)).data;
    }
  });

  return (
    <div className="p-6 w-full max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl flex justify-between items-center"
      >
        <div>
          <h2 className="text-lg font-semibold opacity-90">Current Balance</h2> 
          <div className="text-5xl font-bold flex items-center gap-2 mt-2">     
            <Coins size={40} />
            <CountUp end={balanceData?.balance ?? 0} duration={2} separator="," />
          </div>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="flex items-center gap-1 justify-end"><Flame className="text-orange-400"/> <span className="text-xl font-bold">{balanceData?.teachingStreak ?? 0}</span></div>
            <div className="text-sm opacity-80">Teaching Streak</div>
          </div>
          <div>
            <div className="flex items-center gap-1 justify-end"><Star className="text-yellow-400"/> <span className="text-xl font-bold">{balanceData?.reputationScore ?? '0.0'}</span></div>
            <div className="text-sm opacity-80">Reputation</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">Total Earned</div>
          <div className="text-2xl font-bold text-green-600">+{summaryData?.totalEarned ?? 0}</div>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">Total Spent</div>
          <div className="text-2xl font-bold text-red-600">-{summaryData?.totalSpent ?? 0}</div>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">Sessions Completed</div>       
          <div className="text-2xl font-bold text-blue-600">{summaryData?.totalSessions ?? 0}</div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">    
        <div className="p-4 border-b flex justify-between items-center">        
          <h3 className="font-semibold text-lg">Transaction History</h3>        
          <select
            className="border rounded p-2 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>All Types</option>
            <option>EARN</option>
            <option>SPEND</option>
            <option>ESCROW_LOCK</option>
            <option>ESCROW_RELEASE</option>
            <option>TAX</option>
            <option>PENALTY</option>
            <option>BOUNTY</option>
          </select>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Reference</th>
              </tr>
            </thead>
            <tbody>
              {txData?.data?.map((tx: any) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold">
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 font-body font-semibold">
                    {['EARN', 'ESCROW_RELEASE', 'BOUNTY'].includes(tx.type) ? '+' : '-'}{tx.amount}
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{tx.referenceId ?? 'N/A'}</td>
                </tr>
              ))}
              {!txData?.data?.length && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
