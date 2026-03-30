import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Filter, Zap, Activity, ShieldCheck, ChevronRight, Search, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { mockUser, mockTransactions } from "@/lib/mock-data";
import { format } from "date-fns";

const txTypes = ["All", "EARN", "SPEND", "BOUNTY"] as const;

export default function WalletPage() {
  const [filter, setFilter] = useState<typeof txTypes[number]>("All");

  const filtered = filter === "All" ? mockTransactions : mockTransactions.filter(t => t.type === filter);
  const totalEarned = mockTransactions.filter(t => t.type === "EARN" || t.type === "BOUNTY").reduce((s, t) => s + t.amount, 0);
  const totalSpent = mockTransactions.filter(t => t.type === "SPEND").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#0D0D12] selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar isAuthenticated />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Digital Asset Management</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none uppercase">
                YOUR <span className="text-gradient-kinetic">WALLET</span>
              </h1>
              <p className="text-lg text-white/40 leading-relaxed font-medium">
                Manage your SkillCoins and track your learning economy in real-time.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button className="h-16 px-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95">
                <Search className="w-5 h-5 mr-3 text-primary" /> Search History
              </Button>
              <Button className="h-16 px-8 rounded-2xl bg-kinetic-gradient text-white font-black uppercase tracking-widest text-xs shadow-kinetic transition-all active:scale-95">
                <CreditCard className="w-5 h-5 mr-3" /> Get More STC
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Balance Display */}
            <div className="lg:col-span-8 space-y-8">
              <div className="group relative bento-card overflow-hidden p-10 md:p-16 border-primary/20 bg-primary/[0.02]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-64 -mt-64 group-hover:bg-primary/30 transition-all duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-coin ring-1 ring-primary/20">
                      <Coins className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">Total Balance</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-4 mb-16">
                    <h2 className="text-8xl md:text-[10rem] font-black tracking-tighter leading-none text-white transition-transform group-hover:scale-[1.02] duration-700">
                      {mockUser.tokenBalance}
                    </h2>
                    <div className="mb-4">
                      <span className="text-2xl font-black text-primary uppercase tracking-widest">STC</span>
                      <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em] mt-2">SkillCoins Verified</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-teal-500/20 transition-all group/stat">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-5 h-5 text-teal-400" />
                        <span className="text-[10px] font-black text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full">+12% this month</span>
                      </div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Lifetime Earned</p>
                      <p className="text-2xl font-black text-white tracking-tighter">{totalEarned} STC</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-rose-500/20 transition-all group/stat">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingDown className="w-5 h-5 text-rose-400" />
                        <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full">-5% this month</span>
                      </div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Lifetime Spent</p>
                      <p className="text-2xl font-black text-white tracking-tighter">{totalSpent} STC</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Settings Card */}
              <div className="bento-card p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Security Protocol Active</h3>
                    <p className="text-sm text-white/40 font-medium tracking-wide">Your assets are secured by community-driven verification.</p>
                  </div>
                </div>
                <Button variant="outline" className="h-14 px-8 rounded-xl border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px]">
                  Vault Settings
                </Button>
              </div>
            </div>

            {/* Transaction Logs */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="bento-card flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white/40" />
                    </div>
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Ledger Logs</h2>
                  </div>
                  <Filter className="w-4 h-4 text-white/20 hover:text-white cursor-pointer transition-colors" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {txTypes.map(type => (
                    <Badge 
                      key={type} 
                      variant={filter === type ? "premium" : "ghost"} 
                      className="cursor-pointer px-4 py-2 hover:bg-white/10 transition-all"
                      onClick={() => setFilter(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>

                {/* History List */}
                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
                  <AnimatePresence mode="popLayout text">
                    {filtered.map((tx, i) => {
                      const isIncome = tx.type === "EARN" || tx.type === "BOUNTY";
                      return (
                        <motion.div 
                          key={tx.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.05 }}
                          className="group flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                            isIncome 
                            ? "bg-teal-500/10 border-teal-500/20 text-teal-400" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          }`}>
                            {isIncome ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors truncate">{tx.description}</h4>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{format(new Date(tx.createdAt), "MMM d · h:mm a")}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-black tracking-tighter ${isIncome ? "text-teal-400" : "text-rose-400"}`}>
                              {isIncome ? "+" : "-"}{tx.amount}
                            </p>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">STC</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5">
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white">
                    Export Full Ledger <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

