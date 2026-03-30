import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Users, Gavel, ArrowRight, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

export default function AdminPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('skill_barter_token');
      const res = await fetch('http://localhost:3000/api/admin/disputes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch protocol disputes');
      const data = await res.json();
      setDisputes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id: string, decision: string) => {
    try {
      const token = localStorage.getItem('skill_barter_token');
      const res = await fetch(`http://localhost:3000/api/admin/disputes/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ decision, adminNotes: "Resolved via Admin Portal" })
      });

      if (!res.ok) throw new Error('Failed to synchronize resolution');
      
      toast({ title: "DISPUTE RESOLVED", description: `Protocol decision: ${decision.replace(/_/g, ' ')}` });
      fetchDisputes();
    } catch (error) {
      toast({ title: "RESOLUTION FAILED", variant: "destructive", description: "Could not broadcast resolution." });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] selection:bg-rose-500/30">
      <Navbar isAuthenticated />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px] uppercase font-black border-rose-500/50 text-rose-500 bg-rose-500/5 px-4 tracking-[0.4em]">High Authority</Badge>
                <div className="w-12 h-px bg-white/10" />
              </div>
              <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Moderation <span className="text-gradient-kinetic">Matrix</span></h1>
              <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Overseeing protocol integrity and dispute resolution.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bento-card py-4 px-8 bg-white/[0.02] flex items-center gap-4 border-rose-500/10">
                <Users className="w-5 h-5 text-rose-500" />
                <div>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Nodes</p>
                   <p className="text-xl font-black text-white tracking-tighter">1.2K</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disputes Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Active Disputes</h2>
            </div>

            {loading ? (
              <div className="py-20 text-center animate-pulse">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-white/5" />
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Scanning for protocol failures...</p>
              </div>
            ) : disputes.length === 0 ? (
              <div className="bento-card py-24 text-center border-dashed border-white/5">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-success-500/20" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Network Integrity: 100%</p>
                <p className="text-white/10 text-[9px] mt-2 uppercase">No active disputes detected in the current cycle.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {disputes.map((dispute) => (
                  <motion.div
                    key={dispute.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bento-card bg-white/[0.01] border-rose-500/10 hover:border-rose-500/30 transition-all duration-700 p-0 overflow-hidden group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      {/* Left: Metadata */}
                      <div className="p-8 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                          <Badge variant="premium" className="bg-rose-500/20 text-rose-500 border-rose-500/30 text-[9px]">ID: #{dispute.sessionId.slice(-6).toUpperCase()}</Badge>
                          <span className="text-[9px] font-black text-white/20 uppercase">{format(new Date(dispute.createdAt), "MMM dd, HH:mm")}</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                             <p className="text-xs font-black text-white uppercase tracking-tight">Status: {dispute.status}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                             <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">Locked Value</p>
                             <p className="text-2xl font-black text-white tracking-tighter">{dispute.session.escrow?.amount || 0} <span className="text-[10px] font-black text-primary uppercase">STC</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Entities & Reason */}
                      <div className="p-8 flex-1 space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Initiator</p>
                            <p className="text-sm font-black text-white truncate">{dispute.raisedBy.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Participants</p>
                            <p className="text-[10px] font-black text-white/40 uppercase truncate">{dispute.session.student.email} ↔ {dispute.session.mentor.email}</p>
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 italic">
                          <p className="text-[9px] font-black text-rose-500/50 uppercase tracking-[0.3em] mb-3 not-italic">Issue Log:</p>
                          <p className="text-white/60 text-sm leading-relaxed">&ldquo;{dispute.reason}&rdquo;</p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="p-8 lg:w-72 bg-white/[0.02] flex flex-col gap-3 justify-center">
                        <Button 
                          onClick={() => resolveDispute(dispute.sessionId, 'REFUND_TO_STUDENT')}
                          className="h-12 bg-white/5 hover:bg-rose-500 hover:text-white border border-white/5 text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Full Refund
                        </Button>
                        <Button 
                          onClick={() => resolveDispute(dispute.sessionId, 'SPLIT')}
                          className="h-12 bg-white/5 hover:bg-secondary hover:text-white border border-white/5 text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" /> Split 50/50
                        </Button>
                        <Button 
                          onClick={() => resolveDispute(dispute.sessionId, 'RELEASE_TO_MENTOR')}
                          className="h-12 bg-rose-500 text-white shadow-lg shadow-rose-500/20 text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                          <Gavel className="w-4 h-4 mr-2" /> Release to Mentor
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
