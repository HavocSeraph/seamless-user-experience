import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, BookOpen, Flame, Clock, ArrowRight, Plus, Trophy, Sparkles, Zap, ShieldCheck, ChevronRight, Activity, Cpu, Globe, Signal, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { mockUser, mockSessions, mockTransactions, mockNotifications } from "@/lib/mock-data";
import { format } from "date-fns";
import { authApi } from "@/lib/api-client";

const quickStats = [
  { label: "COIN BALANCE", value: mockUser.tokenBalance, unit: "STC", icon: Coins, color: "text-primary", bg: "bg-primary/10", pulse: true },
  { label: "REP SCORE", value: mockUser.reputationScore.toFixed(1), unit: "XP", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10", pulse: false },
  { label: "TEACHING STREAK", value: mockUser.teachingStreak, unit: "DAYS", icon: Flame, color: "text-rose-500", bg: "bg-rose-500/10", pulse: true },
  { label: "COMPLETED", value: mockSessions.length, unit: "SESSIONS", icon: BookOpen, color: "text-teal-400", bg: "bg-teal-400/10", pulse: false },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authApi.getMe();
        setUser(data);
      } catch (err) {
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const actualUser = user?.user ? user.user : user;
  const dUser = actualUser || mockUser;
  const upcomingSessions = mockSessions.filter(s => s.status === "PENDING").slice(0, 3);
  const recentTx = mockTransactions.slice(0, 5);

  const repScore = typeof dUser.reputationScore === "string" ? parseFloat(dUser.reputationScore) : dUser.reputationScore;

  const qStats = [
    { label: "COIN BALANCE", value: dUser.tokenBalance ?? 0, unit: "STC", icon: Coins, color: "text-primary", bg: "bg-primary/10", pulse: true },
    { label: "REP SCORE", value: repScore != null && !isNaN(repScore) ? repScore.toFixed(1) : "4.7", unit: "XP", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10", pulse: false },
    { label: "TEACHING STREAK", value: dUser.teachingStreak || 0, unit: "DAYS", icon: Flame, color: "text-rose-500", bg: "bg-rose-500/10", pulse: true },
    { label: "COMPLETED", value: mockSessions.length, unit: "SESSIONS", icon: BookOpen, color: "text-teal-400", bg: "bg-teal-400/10", pulse: false },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D12] selection:bg-primary/30 selection:text-primary">
      <Navbar isAuthenticated />

      {/* Network Integrity Header - Gold Master Polish */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-[#0D0D12]/80 backdrop-blur-md border-b border-white/5 py-2 px-6 hidden lg:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="network-pulse">
                <span className="network-pulse-ring" />
                <span className="network-pulse-dot" />
              </div>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Network Stability: <span className="text-secondary">99.98%</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Signal className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Latency: <span className="text-primary">1.2ms</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-accent" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Synapse Load: <span className="text-accent">14%</span></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">PROTOCOL LAYER 4 // ACTIVE</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-44 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-white/5 pb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="ghost" className="text-[10px] uppercase tracking-[0.4em] text-primary font-black border-primary/20 bg-primary/5 px-4 mb-0">Control Center</Badge>
                <div className="w-12 h-px bg-white/10" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none uppercase">
                Welcome Base,<br />
                <span className="text-gradient-kinetic">{dUser.name?.split(" ")[0]}</span>
              </h1>
              <p className="text-xl text-white/30 leading-relaxed font-bold max-w-xl">
                Your neural-knowledge graph is expanding. <span className="text-white/60">3 intelligence requests</span> are awaiting your protocol synchronization.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pb-2">
              <Link to="/skills/new">
                <Button className="h-20 px-10 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-xl">
                  <Plus className="w-5 h-5 mr-3 text-primary" /> List Protocol
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button className="h-20 px-10 rounded-3xl bg-kinetic-gradient text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-kinetic hover:shadow-kinetic-glow transition-all active:scale-95 group overflow-hidden relative">
                  <span className="relative z-10 flex items-center">SYNCHRONIZE NOW <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" /></span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {qStats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bento-card group p-8"
              >
                {/* Network Pulse Indicator */}
                <div className="absolute top-4 right-4">
                  {stat.pulse && (
                    <div className="network-pulse">
                      <span className={`network-pulse-ring ${stat.color === 'text-primary' ? 'bg-primary' : 'bg-rose-500'}`} />
                      <span className={`network-pulse-dot ${stat.color === 'text-primary' ? 'bg-primary' : 'bg-rose-500'}`} />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-10">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <Database className="w-4 h-4 text-white/10 group-hover:text-white/20 transition-colors" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter leading-none">{stat.value}</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${stat.color}`}>{stat.unit}</span>
                  </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Upcoming Sessions - Mission Control Panel */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="bento-card flex-1 p-0">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <Zap className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Intelligence Exchange</h2>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Active Protocols: {upcomingSessions.length}</p>
                    </div>
                  </div>
                  <Link to="/sessions">
                    <Button variant="ghost" className="h-12 px-6 rounded-xl border border-white/5 bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all">
                      Archive <Archive className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="p-8 space-y-4">
                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                      <Globe className="w-16 h-16 mx-auto mb-6 text-white/5 animate-spin-slow" />
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No Live Protocol Links</p>
                      <Button variant="ghost" className="mt-6 text-primary font-black uppercase tracking-widest text-[9px]">Request Synchronization</Button>
                    </div>
                  ) : (
                    upcomingSessions.map((session, i) => (
                      <motion.div 
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative flex flex-col md:flex-row md:items-center gap-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-700 cursor-pointer overflow-hidden"
                      >
                        <div className="relative shrink-0">
                          <img src={session.mentorAvatar} alt="" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/5 group-hover:ring-primary/20 transition-all duration-500" />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-kinetic-gradient flex items-center justify-center shadow-kinetic">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-center gap-4">
                            <Badge variant="premium" className="text-[9px] px-3">Live Protocol</Badge>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                              <Clock className="w-3 h-3 text-secondary" /> {format(new Date(session.startTime), "h:mm a")}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors truncate">{session.skillTitle}</h3>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Mentor ID: {session.mentorName.toUpperCase().replace(" ", "_")}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-10">
                          <div className="text-right hidden sm:block">
                            <p className="text-[24px] font-black text-white tracking-tighter leading-none">{format(new Date(session.startTime), "MMM dd")}</p>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">{format(new Date(session.startTime), "EEEE")}</p>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 group-hover:shadow-kinetic-glow">
                            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        
                        {/* Background subtle glow highlight */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Advanced Bento Ticker Bar */}
              <div className="bento-card py-6 px-10 bg-white/[0.02]">
                <div className="flex items-center gap-8 overflow-hidden whitespace-nowrap">
                  <div className="flex items-center gap-2 shrink-0">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Market Pulse</span>
                  </div>
                  <div className="flex gap-12 animate-marquee">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                       Python <ArrowRight className="w-3 h-3" /> Brand Strategy <span className="text-primary font-black ml-4">50 STC</span>
                    </span>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                       React <ArrowRight className="w-3 h-3" /> UI Design <span className="text-primary font-black ml-4">120 STC</span>
                    </span>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                       Solidity <ArrowRight className="w-3 h-3" /> Growth <span className="text-primary font-black ml-4">400 STC</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel - Identity & Performance */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* Profile Inset Overlay - Inset style from Stitch Design */}
              <div className="bento-card group p-0 overflow-hidden bg-white/[0.01]">
                <div className="h-24 bg-kinetic-gradient opacity-20 relative">
                   <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                </div>
                <div className="px-8 pb-10 -mt-12 relative z-10 text-center">
                  <div className="inline-block relative mb-6">
                    <div className="p-1 rounded-3xl bg-kinetic-gradient">
                      <img src={dUser.avatar || ("https://api.dicebear.com/7.x/bottts/svg?seed=" + (dUser.id || dUser.name))} alt="" className="w-24 h-24 rounded-[22px] object-cover border-4 border-[#0D0D12]" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#0D0D12] border border-white/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-8">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{dUser.name}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Identity: #{dUser.role === 'ADMIN' ? 'NETWORK_MASTER' : 'NETWORK_ELITE'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Rep Level</p>
                      <p className="text-lg font-black text-white">{repScore != null && !isNaN(repScore) ? repScore.toFixed(1) : "4.7"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Synced</p>
                      <p className="text-lg font-black text-white">{mockSessions.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger - Clean Glass List */}
              <div className="bento-card flex-1 flex flex-col p-0">
                <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                  <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Protocol Ledger</h2>
                  <Link to="/wallet" className="text-[9px] font-black text-white/20 uppercase hover:text-white transition-colors">History</Link>
                </div>
                
                <div className="flex-1 p-8 space-y-8">
                  {recentTx.map((tx, i) => (
                    <div key={tx.id} className="flex items-center gap-6 group cursor-pointer">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                        tx.type === "EARN" || tx.type === "BOUNTY" 
                        ? "bg-secondary/10 border-secondary/20 text-secondary group-hover:bg-secondary/20" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-500 group-hover:bg-rose-500/20"
                      }`}>
                        <Coins className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">{tx.description}</p>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">{format(new Date(tx.createdAt), "MMM d, h:mm a")}</p>
                      </div>
                      <div className={`text-lg font-black tracking-tighter ${
                        tx.type === "EARN" || tx.type === "BOUNTY" ? "text-secondary" : "text-rose-500"
                      }`}>
                        {tx.type === "EARN" || tx.type === "BOUNTY" ? "+" : "-"}{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

const Archive = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"></polyline>
    <rect x="1" y="3" width="22" height="5"></rect>
    <line x1="10" y1="12" x2="14" y2="12"></line>
  </svg>
);

