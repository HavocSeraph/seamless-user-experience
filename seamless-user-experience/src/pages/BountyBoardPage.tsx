import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Coins, Clock, MessageSquare, Plus, Search, Sparkles, Zap, ChevronRight, Activity, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { mockBounties } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export default function BountyBoardPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = mockBounties.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || b.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#0D0D12] selection:bg-primary/30 selection:text-primary">
      <Navbar isAuthenticated />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-accent" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">High Stakes Learning</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 leading-none uppercase">
                BOUNTY <span className="text-gradient-kinetic">BOARD</span>
              </h1>
              <p className="text-lg text-white/40 leading-relaxed font-bold max-w-2xl">
                Solve engineering challenges with video explanations and accumulate SkillCoins from the community's brightest minds.
              </p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="shrink-0 flex items-center justify-center w-32 h-32 rounded-3xl bg-accent/10 border border-accent/20 relative"
            >
              <Trophy className="w-16 h-16 text-accent animate-pulse" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Plus className="w-4 h-4 text-black font-black" />
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Filters */}
            <div className="lg:col-span-3 space-y-8 sticky top-32">
              <div className="bento-card overflow-hidden">
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input 
                    placeholder="Search Bounties..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="pl-12 h-14 bg-white/5 border-white/5 text-xs font-black uppercase tracking-widest placeholder:text-white/20 focus-visible:ring-primary/40 rounded-xl" 
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Categories</h3>
                  <div className="flex flex-col gap-2">
                    {["All", "Web Development", "Data Science", "DevOps", "Cybersecurity"].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setCategory(cat)}
                        className={`text-left px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                          category === cat 
                          ? "bg-primary text-black border-primary font-black shadow-lg shadow-primary/20 scale-[1.02]" 
                          : "bg-white/5 text-white/40 border-white/5 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bento-card bg-accent/5 border-accent/10 group">
                <Sparkles className="w-8 h-8 text-accent mb-4 group-hover:rotate-12 transition-transform" />
                <h4 className="font-black text-white uppercase tracking-tight mb-2">Want to learn faster?</h4>
                <p className="text-xs text-white/40 font-medium leading-relaxed mb-6">Create a bounty for your specific problem and let master educators help you directly.</p>
                <Button className="w-full h-14 rounded-xl bg-accent text-black font-black uppercase tracking-widest text-[10px]">Create Your Bounty</Button>
              </div>
            </div>

            {/* Bounty List */}
            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-8 px-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  {filtered.length} Bounties Available
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sort By:</span>
                  <select className="bg-transparent text-[10px] font-black text-white uppercase tracking-widest outline-none border-none cursor-pointer hover:text-primary transition-colors">
                    <option>Highest Reward</option>
                    <option>Newest</option>
                    <option>Closing Soon</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((bounty, i) => (
                    <motion.div 
                      key={bounty.id} 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bento-card group hover:border-primary/20 transition-all cursor-pointer p-8 overflow-hidden relative"
                    >
                      {/* Reward Chip */}
                      <div className="absolute top-0 right-0 pt-8 pr-8">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500">
                                <Coins className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-2xl font-black text-white tracking-tighter transition-colors group-hover:text-primary">{bounty.rewardCoins}</span>
                            </div>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-2 mr-2">Reward STC</span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-8 pr-32">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant={bounty.status === "OPEN" ? "success" : "ghost"}>{bounty.status}</Badge>
                            <Badge variant="premium">{bounty.category}</Badge>
                          </div>
                          
                          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-2 group-hover:text-primary transition-colors duration-500 leading-tight">
                            {bounty.title}
                          </h3>
                          
                          <p className="text-sm text-white/40 font-medium leading-relaxed line-clamp-2 mb-8 max-w-xl">
                            {bounty.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-8 border-t border-white/5 pt-6">
                            <div className="flex items-center gap-3 group/author">
                              <img src={bounty.posterAvatar} alt="" className="w-8 h-8 rounded-full border border-white/10 group-hover/author:border-primary transition-colors" />
                              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{bounty.posterName}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-white/20">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{bounty.answersCount} SOLVES</span>
                            </div>

                            {bounty.status === "OPEN" && (
                              <div className="flex items-center gap-2 text-rose-500/60">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">ENDS {formatDistanceToNow(new Date(bounty.expiresAt), { addSuffix: true })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect Layer */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 border border-primary/40 p-2 rounded-lg bg-primary/20">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-40 bento-card border-dashed">
                  <Activity className="w-16 h-16 text-white/5 mx-auto mb-6" />
                  <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-2">No Bounties Matched</h3>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

