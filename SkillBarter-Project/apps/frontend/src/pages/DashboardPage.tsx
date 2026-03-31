import { useEffect, useState } from 'react';
import api from '../lib/axios';

// For the purposes of testing completion from Phase 4 to Phase 5
export function DashboardPage() {
  const [sessionEndToReview, setSessionEndToReview] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionEndedId = query.get('sessionEnd');
    if (sessionEndedId) {
      setSessionEndToReview(sessionEndedId);
    }
  }, []);

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      // 1. Mark logic as Complete
      console.log('Completing Session', sessionEndToReview);

      await api.post(`/sessions/${sessionEndToReview}/complete`);

      await api.post(`/sessions/${sessionEndToReview}/review`, { rating, comment });

      alert("Feedback submitted successfully! Escrow rules invoked.");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setErrorMsg("Error submitting feedback. See console.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispute = async () => {
    const reason = prompt("Describe the reason for the dispute:");
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await api.post(`/sessions/${sessionEndToReview}/dispute`, { reason });
      alert('Dispute officially filed. The Escrow transaction has been frozen awaiting Admin resolution.');
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert('Failed to submit dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-white">Your Dashboard</h1>
      <p className="text-gray-400 text-lg">Review your recent sessions, check escrow statuses, and resolve pending actions.</p>

      {/* Review Modal Popup Overlay */}
      {sessionEndToReview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 px-6 py-5">
               <h2 className="text-2xl font-bold text-white">Session Concluded</h2>
               <p className="text-indigo-100 text-sm mt-1">Please leave feedback for your peer.</p>
            </div>
            
            <div className="p-6 space-y-5 text-white">
               {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">{errorMsg}</div>
               )}
               
               <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Rating (1-5)</label>
                  <select 
                     value={rating} 
                     onChange={(e) => setRating(parseInt(e.target.value))}
                     className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                     <option value={5}>⭐⭐⭐⭐⭐ (5) Excellent</option>
                     <option value={4}>⭐⭐⭐⭐ (4) Good</option>
                     <option value={3}>⭐⭐⭐ (3) Okay</option>
                     <option value={2}>⭐⭐ (2) Needs Work</option>
                     <option value={1}>⭐ (1) Terrible</option>
                  </select>
               </div>

               <div>
                 <label className="block text-sm font-semibold mb-2 text-gray-300">Comment (Optional)</label>
                 <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How did the session go?"
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                 />
               </div>

               <div className="flex gap-4 pt-6 border-t border-gray-800 mt-2">
                 <button 
                    disabled={isSubmitting}
                    onClick={handleSubmitReview}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl transition-all font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                 >
                    {isSubmitting ? 'Processing...' : 'Submit & Release Escrow'}
                 </button>
                 <button 
                    disabled={isSubmitting}
                    onClick={handleDispute}
                    className="flex-[0.6] bg-red-500/10 text-red-500 hover:bg-red-500/20 py-3 rounded-xl transition-all font-semibold disabled:opacity-50"
                 >
                    File Dispute
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Dashboard Wireframe for UI filling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border border-gray-800 bg-gray-900 rounded-2xl p-8 shadow-sm">
           <h3 className="font-bold text-xl text-white mb-2">Pending Escrow</h3>
           <p className="text-gray-400 text-sm mb-6">Funds currently locked in active sessions.</p>
           <div className="flex items-center justify-center p-8 border border-dashed border-gray-700 rounded-xl bg-gray-800/50">
             <span className="text-gray-500 font-medium">No locked funds at this time.</span>
           </div>
        </div>
        <div className="border border-gray-800 bg-gray-900 rounded-2xl p-8 shadow-sm">
           <h3 className="font-bold text-xl text-white mb-2">Recent Sessions</h3>
           <p className="text-gray-400 text-sm mb-6">History of your completed exchanges.</p>
           <div className="space-y-4">
             {/* Mock Session Item */}
             <div className="p-4 rounded-xl border border-gray-700 bg-gray-800 flex justify-between items-center text-white">
                <div>
                   <div className="font-semibold">Advanced React Hooks</div>
                   <div className="text-sm text-gray-400">with @mentor_david</div>
                </div>
                <div className="text-right">
                   <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 font-semibold text-xs rounded-full border border-green-500/20">COMPLETED</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}