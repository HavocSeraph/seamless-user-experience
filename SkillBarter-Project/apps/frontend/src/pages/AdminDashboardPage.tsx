import { useEffect, useState } from 'react';

import { Shield, AlertTriangle, Users, Activity, CheckCircle, Ban, Search } from 'lucide-react';
import api from '../lib/axios';

interface Dispute {
  id: string;
  sessionId: string;
  reason: string;
  status: string;
  createdAt: string;
  session: {
    student: { email: string };
    mentor: { email: string };
    escrow: { amount: number };
  };
  raisedBy: { email: string };
}

interface Stats {
  totalUsers: number;
  activeSessions: number;
  totalEscrow: number;
  totalDisputes: number;
  onlineUsers: number;
}

interface User {
  id: string;
  email: string;
  roles: string[];
  isBanned?: boolean;
  createdAt: string;
}

export function AdminDashboardPage() {
  
  const [activeTab, setActiveTab] = useState<'stats' | 'disputes' | 'users'>('stats');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'disputes') {
        const res = await api.get('/admin/disputes');
        setDisputes(res.data);
      } else if (activeTab === 'stats') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'users') {
        const res = await api.get(`/admin/users?search=${search}`);
        setUsers(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id: string, decision: 'REFUND_TO_STUDENT' | 'RELEASE_TO_MENTOR' | 'SPLIT') => {
    if (!window.confirm(`Are you sure you want to ${decision}?`)) return;

    try {
      await api.post(`/admin/disputes/${id}/resolve`, { decision, adminNotes: 'Resolved via dashboard' });
      fetchData();
      alert('Dispute resolved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error resolving dispute');
    }
  };

  const toggleBanUser = async (id: string, currentlyBanned: boolean) => {
    if (!window.confirm(`Are you sure you want to ${currentlyBanned ? 'unban' : 'ban'} this user?`)) return;
    try {
      await api.post(`/admin/users/${id}/ban`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error changing user ban status');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold">Admin Controls</h1>
        </div>

        <div className="flex gap-4 border-b border-gray-800 mb-8">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-4 font-semibold ${activeTab === 'stats' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-2"><Activity className="w-4 h-4"/> System Stats</div>
          </button>
          <button 
            onClick={() => setActiveTab('disputes')}
            className={`py-3 px-4 font-semibold ${activeTab === 'disputes' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Active Disputes</div>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 font-semibold ${activeTab === 'users' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-2"><Users className="w-4 h-4"/> User Directory</div>
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-sm mb-2">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg, border border-gray-800">
                  <p className="text-gray-400 text-sm mb-2">Online Now</p>
                  <p className="text-3xl font-bold text-green-400">{stats.onlineUsers}</p>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-sm mb-2">Active Sessions</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.activeSessions}</p>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-sm mb-2">Value Locked (Escrow)</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.totalEscrow || 0} Coins</p>
                </div>
              </div>
            )}

            {activeTab === 'disputes' && (
              <div className="space-y-6">
                {disputes.length === 0 ? (
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-8 text-center text-gray-400">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    No active disputes at this time.
                  </div>
                ) : (
                  disputes.map((dispute) => (
                    <div key={dispute.id} className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold mb-1 text-red-500">Dispute #{dispute.id.slice(0,8)}</h2>
                          <p className="text-gray-400 text-sm">Raised on {new Date(dispute.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-sm font-medium">{dispute.status}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#1A1A1A] p-4 rounded-lg">
                          <p className="text-sm text-gray-400 mb-1">Locked Amount</p>
                          <p className="font-medium text-green-400">{dispute.session.escrow?.amount || 0} Coins</p>
                        </div>
                        <div className="bg-[#1A1A1A] p-4 rounded-lg">
                          <p className="text-sm text-gray-400 mb-1">Raised By</p>
                          <p className="font-medium">{dispute.raisedBy.email}</p>
                        </div>
                      </div>
                      <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-lg mb-6">
                        <p className="text-sm text-red-400 mb-2 font-semibold">Reason for Dispute:</p>
                        <p className="text-gray-300 whitespace-pre-wrap">{dispute.reason}</p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => resolveDispute(dispute.id, 'REFUND_TO_STUDENT')} className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/50 font-semibold py-2 rounded-lg transition-colors">Refund Learner</button>
                        <button onClick={() => resolveDispute(dispute.id, 'SPLIT')} className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 font-semibold py-2 rounded-lg transition-colors">Split 50/50</button>
                        <button onClick={() => resolveDispute(dispute.id, 'RELEASE_TO_MENTOR')} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 font-semibold py-2 rounded-lg transition-colors">Pay Mentor</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">User Directory</h2>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Search email..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                      className="bg-[#1A1A1A] border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-[#1A1A1A]">
                      <tr>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Roles</th>
                        <th className="px-6 py-3">Joined</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-[#151515]">
                          <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                          <td className="px-6 py-4">
                            {user.roles.map(r => (
                              <span key={r} className="bg-gray-800 text-xs px-2 py-1 rounded-full mr-1">{r}</span>
                            ))}
                          </td>
                          <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            {user.isBanned ? (
                              <span className="text-red-400 flex items-center gap-1"><Ban className="w-3 h-3"/> Banned</span>
                            ) : (
                              <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Active</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => toggleBanUser(user.id, !!user.isBanned)}
                              className={`px-3 py-1 rounded text-xs font-semibold ${user.isBanned ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                            >
                              {user.isBanned ? 'Unban' : 'Ban User'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
