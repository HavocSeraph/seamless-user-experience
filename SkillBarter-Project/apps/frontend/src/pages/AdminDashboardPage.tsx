import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/auth');
        return;
      }

      const res = await fetch('http://localhost:3000/admin/disputes', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch disputes');

      const data = await res.json();
      setDisputes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id: string, decision: 'REFUND_TO_STUDENT' | 'RELEASE_TO_MENTOR' | 'SPLIT') => {
    if (!window.confirm(`Are you sure you want to ${decision}?`)) return;

    try {
      const storedToken = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/admin/disputes/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ decision }),
      });

      if (!res.ok) throw new Error('Failed to resolve dispute');

      // Refresh list
      fetchDisputes();
      alert('Dispute resolved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error resolving dispute');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Disputes</h1>

        {loading ? (
          <p className="text-gray-400">Loading disputes...</p>
        ) : disputes.length === 0 ? (
          <div className="bg-[#111] border border-gray-800 rounded-xl p-8 text-center text-gray-400">
            No active disputes at this time.
          </div>
        ) : (
          <div className="space-y-6">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl"
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1 text-red-500">
                      Dispute (Session #{dispute.sessionId.slice(-6)})
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Raised on {new Date(dispute.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-sm font-medium">
                    {dispute.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Raised By</p>
                    <p className="font-medium">{dispute.raisedBy.email}</p>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Locked Amount</p>
                    <p className="font-medium text-green-400">
                      {dispute.session.escrow?.amount || 0} Coins
                    </p>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Student</p>
                    <p className="font-medium">{dispute.session.student.email}</p>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Mentor</p>
                    <p className="font-medium">{dispute.session.mentor.email}</p>
                  </div>
                </div>

                <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-lg mb-6">
                  <p className="text-sm text-red-400 mb-2 font-semibold">Reason for Dispute:</p>
                  <p className="text-gray-300 whitespace-pre-wrap">{dispute.reason}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => resolveDispute(dispute.sessionId, 'REFUND_TO_STUDENT')}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-colors"
                  >
                    Refund Learner
                  </button>
                  <button
                    onClick={() => resolveDispute(dispute.sessionId, 'SPLIT')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-black font-semibold py-3 rounded-lg transition-colors"
                  >
                    Split 50/50
                  </button>
                  <button
                    onClick={() => resolveDispute(dispute.sessionId, 'RELEASE_TO_MENTOR')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-colors"
                  >
                    Pay Mentor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}