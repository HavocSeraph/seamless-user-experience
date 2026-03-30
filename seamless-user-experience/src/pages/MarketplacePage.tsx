import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter, Share2, Activity, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { SkillCard } from "@/components/SkillCard";
import { categories, levels } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "@/lib/api-client";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => marketplaceApi.getSkills()
  });

  const filtered = skills.filter((s: any) => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchLevel = selectedLevel === "All" || s.level === selectedLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  const hasFilters = selectedCategory !== "All" || selectedLevel !== "All" || search;

  return (
    <div className="min-h-screen bg-[#0D0D12] selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar isAuthenticated />
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
         <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      <main className="container mx-auto px-4 pt-44 pb-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 pb-12 border-b border-white/5">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="ghost" className="text-[10px] uppercase tracking-[0.5em] text-primary font-black border-primary/20 bg-primary/5 px-4">Neural Directory</Badge>
                <div className="w-12 h-px bg-white/10" />
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 leading-none uppercase">
                Find Your<br />
                <span className="text-gradient-kinetic">NEXT GENIUS</span>
              </h1>
              <p className="text-xl text-white/30 leading-relaxed font-bold max-w-xl">
                 Access our global decentralized network of expertise. <span className="text-white/60">Swap intelligence</span> with the world's most elite practitioners.
              </p>
            </div>
            
            <div className="flex flex-col gap-6 items-end">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 px-6 h-14 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl">
                     <div className="network-pulse">
                        <span className="network-pulse-ring" />
                        <span className="network-pulse-dot" />
                      </div>
                     <span className="text-[10px] font-black uppercase text-white tracking-[0.3em]">
                       <span className="text-secondary">{filtered.length}</span> Active Synapses Found
                     </span>
                  </div>
                  <Button 
                    variant="ghost"
                    className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-primary hover:text-white transition-all group"
                  >
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
                
                <Button 
                    variant="outline" 
                    className="w-full md:w-auto rounded-2xl h-16 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] backdrop-blur-md transition-all active:scale-95 shadow-xl"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className={`w-4 h-4 mr-3 transition-transform duration-500 ${showFilters ? 'rotate-180 text-primary' : ''}`} />
                    {showFilters ? 'CONCEAL FILTERS' : 'ADVANCED PROTOCOLS'}
                </Button>
            </div>
          </div>

          {/* Neural Search Interface */}
          <div className="relative mb-16 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-20 transition-all duration-700 pointer-events-none" />
            <div className="relative">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                  <Search className="w-7 h-7 text-white/10 group-focus-within:text-primary transition-all duration-500 group-focus-within:scale-110" />
                </div>
                <Input 
                  placeholder="Initiate neural query: python, ui design, growth hacking..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full h-24 pl-20 pr-10 bg-white/[0.03] border-white/5 focus:border-primary/30 text-2xl font-black placeholder:text-white/5 rounded-[2rem] backdrop-blur-2xl transition-all shadow-input hover:bg-white/[0.04] uppercase tracking-tighter"
                />
                <div className="absolute right-10 top-1/2 -track-y-1/2 -translate-y-1/2 flex items-center gap-6">
                  <div className="hidden lg:flex items-center gap-2">
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">CMD + K</span>
                  </div>
                  {search && (
                    <button onClick={() => setSearch("")} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:scale-110 transition-transform shadow-kinetic-glow">
                      <X className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
            </div>
          </div>

          {/* Strategy Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: -20 }} 
                animate={{ height: "auto", opacity: 1, y: 0 }} 
                exit={{ height: 0, opacity: 0, y: -20 }}
                className="overflow-hidden mb-16"
              >
                <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl grid grid-cols-1 md:grid-cols-2 gap-16 relative shadow-inner">
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] rounded-[3rem]" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <Database className="w-5 h-5 text-primary" />
                       <h3 className="text-[11px] uppercase tracking-[0.5em] text-white font-black">Knowledge Spheres</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {categories.map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border relative overflow-hidden group/cat ${
                            selectedCategory === cat 
                            ? "bg-primary border-primary text-white shadow-kinetic-glow scale-105" 
                            : "bg-white/5 border-white/5 text-white/20 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <span className="relative z-10">{cat}</span>
                          {selectedCategory === cat && (
                            <motion.div layoutId="cat-glow" className="absolute inset-0 bg-white/20" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <Activity className="w-5 h-5 text-accent" />
                       <h3 className="text-[11px] uppercase tracking-[0.5em] text-white font-black">Experience Depth</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {levels.map(lvl => (
                        <button 
                          key={lvl} 
                          onClick={() => setSelectedLevel(lvl)}
                          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border relative overflow-hidden group/lvl ${
                            selectedLevel === lvl 
                            ? "bg-accent border-accent text-white shadow-kinetic-glow-accent scale-105" 
                            : "bg-white/5 border-white/5 text-white/20 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <span className="relative z-10">{lvl === "All" ? "Full Spectrum" : lvl}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Directory Status Feed */}
          {hasFilters && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-12 px-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">Synchronizing results matching current protocol...</span>
              </div>
              <button 
                onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedLevel("All"); }}
                className="group flex items-center gap-4 p-2 pl-4 pr-6 rounded-2xl bg-white/5 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
              >
                 <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 group-hover:text-rose-500 transition-colors">Reset Terminal</span>
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <X className="w-4 h-4" />
                 </div>
              </button>
            </motion.div>
          )}

          {/* Neural Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((skill, i) => (
              <motion.div 
                key={skill.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hover:scale-[1.02] transition-transform duration-500"
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </div>

          {/* Deadlock State (Empty) */}
          {filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-48 bg-white/[0.01] rounded-[4rem] border border-dashed border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-lg mx-auto">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/5 group-hover:rotate-12 transition-transform duration-700">
                  <Search className="w-12 h-12 text-white/5" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Node Protocol Mismatch</h3>
                <p className="text-lg text-white/20 font-bold leading-relaxed mb-10">
                   The current neural parameters failed to resolve any expert nodes. Reset your directory filters to re-establish connection.
                </p>
                <Button 
                    className="h-20 px-12 rounded-3xl bg-kinetic-gradient text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-kinetic hover:shadow-kinetic-glow transition-all active:scale-95"
                    onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedLevel("All"); }}
                >
                    PURGE ALL PROTOCOLS
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

