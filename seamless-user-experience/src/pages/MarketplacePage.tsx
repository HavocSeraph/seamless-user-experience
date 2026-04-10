import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";

export default function MarketplacePage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedLevel !== "All") params.set("level", selectedLevel);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, selectedLevel, setSearchParams]);

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => marketplaceApi.getSkills(),
    staleTime: 30000,
  });

  const filtered = skills.filter((s: { title: string; description: string; category: string; level: string; [key: string]: unknown }) => {
    const matchSearch = !debouncedSearch || s.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || s.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchLevel = selectedLevel === "All" || s.level === selectedLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  const hasFilters = selectedCategory !== "All" || selectedLevel !== "All" || debouncedSearch;

  return (
    <div className="min-h-dvh bg-[#0D0D12] selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar isAuthenticated />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
         <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      <main className="container mx-auto px-4 pt-44 pb-32 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 pb-12 border-b border-white/5">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="ghost" className="text-[10px] uppercase tracking-[0.5em] text-primary font-black border-primary/20 bg-primary/5 px-4">Neural Directory</Badge>
                <div className="w-12 h-px bg-white/10" />
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 leading-none uppercase">Find Your<br /><span className="text-gradient-kinetic">NEXT GENIUS</span></h1>
              <p className="text-xl text-white/30 leading-relaxed font-bold max-w-xl">Access our global decentralized network of expertise. <span className="text-white/60">Swap intelligence</span> with the world's most elite practitioners.</p>
            </div>
            <div className="flex flex-col gap-6 items-end">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 px-6 h-14 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl">
                     <span className="text-[10px] font-black uppercase text-white tracking-[0.3em]"><span className="text-secondary">{filtered.length}</span> Active Synapses Found</span>
                  </div>
                  <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-primary hover:text-white transition-all" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}><Share2 className="w-5 h-5 group-hover:scale-110" /></Button>
                </div>
                <Button variant="outline" className="w-full md:w-auto rounded-2xl h-16 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px]" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className={"w-4 h-4 mr-3 transition-transform "} />
                    {showFilters ? 'CONCEAL FILTERS' : 'ADVANCED PROTOCOLS'}
                </Button>
            </div>
          </div>

          <div className="relative mb-16 group">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
              <Search className="w-7 h-7 text-white/10" />
            </div>
            <Input 
              placeholder="Initiate neural query: python, ui design..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full h-24 pl-20 pr-10 bg-white/[0.03] border-white/5 focus:border-primary/30 text-2xl font-black placeholder:text-white/5 rounded-[2rem] uppercase"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-16">
                <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <h3 className="text-[11px] uppercase text-primary font-black mb-4">Knowledge Spheres</h3>
                    <div className="flex flex-wrap gap-3">
                      {categories.map((cat: string) => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={"px-6 py-3 rounded-2xl text-[10px] font-black uppercase border "}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[11px] uppercase text-accent font-black mb-4">Experience Depth</h3>
                    <div className="flex flex-wrap gap-3">
                      {levels.map((lvl: string) => (
                        <button key={lvl} onClick={() => setSelectedLevel(lvl)} className={"px-6 py-3 rounded-2xl text-[10px] font-black uppercase border "}>{lvl === "All" ? "Full Spectrum" : lvl}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filtered.map((skill: { id: string; title: string; description: string; category: string; level: string; [key: string]: unknown }) => (
                <SkillCard key={skill.id} skill={skill} />
             ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

