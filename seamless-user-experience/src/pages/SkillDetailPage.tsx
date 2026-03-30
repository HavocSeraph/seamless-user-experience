import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Coins, Flame, ArrowLeft, Clock, Users, Calendar, Shield, MessageSquare, CheckCircle2, ChevronRight, Zap, Play, Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { mockSkills } from "@/lib/mock-data";

export default function SkillDetailPage() {
  const { skillId } = useParams();
  const skill = mockSkills.find(s => s.id === skillId) || mockSkills[0];

  return (
    <div className="min-h-screen bg-[#0D0D12] selection:bg-primary/30 selection:text-primary">
      <Navbar isAuthenticated />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Breadcrumb / Back Navigation */}
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-all mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Marketplace
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Detailed Info (Main Content) */}
            <div className="lg:col-span-8 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Badge variant={skill.level === "EXPERT" ? "destructive" : skill.level === "INTERMEDIATE" ? "premium" : "success"}>
                    {skill.level} LEVEL
                  </Badge>
                  <Badge variant="ghost">MASTERED BY {skill.reviewCount} STUDENTS</Badge>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase">
                  {skill.title.split(" ").slice(0, -1).join(" ")} <br />
                  <span className="text-gradient-kinetic">{skill.title.split(" ").slice(-1)}</span>
                </h1>

                <p className="text-xl text-white/40 leading-relaxed font-medium max-w-2xl">
                  {skill.description} Imagine achieving mastery under the guidance of industry veterans who have solved complex problems at scale.
                </p>

                <div className="flex flex-wrap gap-8 py-8 border-y border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">DURATION</p>
                      <p className="text-sm font-black text-white">{skill.level === "BEGINNER" ? "30" : "60"} Minutes High-Intensity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">NETWORK</p>
                      <p className="text-sm font-black text-white">{skill.reviewCount}+ Mentors Available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                      <Play className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">FORMAT</p>
                      <p className="text-sm font-black text-white">Interactive Session</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bento-card">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                  <Zap className="w-6 h-6 text-primary" /> Learning Milestones
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Architectural Deep Dives & Theory",
                    "Real-world Implementation Scenarios",
                    "Performance Tuning & Optimization",
                    "Live Problem-Solving Labs",
                    "Exclusive Resource Packages",
                    "Direct Mentor Feedback Loop"
                  ].map((milestone, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-white/60 group-hover:text-white transition-colors">{milestone}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                    <MessageSquare className="w-6 h-6 text-accent" /> Intelligence Reports
                  </h2>
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white">
                    ReadAll Reviews ({skill.reviewCount}) <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-6">
                  {[
                    { name: "JAMIE VALENTINO", rating: 5, comment: "The architectural depth provided in this session was beyond anything I've found on YouTube. Pure engineering excellence.", date: "2 WEEKS AGO", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
                    { name: "ELARA VANCE", rating: 4, comment: "Extremely patient and thorough. The mentor helped me debug a production issue live. Worth every single SkillCoin.", date: "1 MONTH AGO", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
                  ].map((review, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bento-card p-8 flex flex-col md:flex-row gap-8 hover:bg-white/[0.04]"
                    >
                      <div className="shrink-0">
                        <img src={review.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white/5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">{review.name}</h4>
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{review.date}</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                          ))}
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed font-medium italic">"{review.comment}"</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Billing Sidebar */}
            <div className="lg:col-span-4 sticky top-32">
              <div className="bento-card p-10 space-y-10 border-primary/20 bg-primary/[0.02] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/30 transition-all duration-1000" />
                
                <div className="relative z-10 text-center space-y-4">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Investment Required</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg animate-float">
                      <Coins className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-7xl font-black text-white tracking-tighter leading-none">{skill.priceCoins}</span>
                    <span className="text-xl font-black text-primary uppercase tracking-widest self-end mb-1">STC</span>
                  </div>
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest">per mastered session</p>
                </div>

                <div className="relative z-10 space-y-4 pt-10 border-t border-white/5">
                  <Button className="w-full h-20 rounded-2xl bg-kinetic-gradient text-white font-black uppercase tracking-[0.2em] text-xs shadow-kinetic group/btn relative overflow-hidden active:scale-95 transition-all">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Secure Booking <Zap className="w-4 h-4 fill-white animate-pulse" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  </Button>
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px]">
                    Direct Interrogation (Message)
                  </Button>
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group/mentor">
                    <div className="relative">
                      <img src={skill.mentor.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/5" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-accent flex items-center justify-center shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white tracking-tighter uppercase group-hover/mentor:text-accent transition-colors">
                        {skill.mentor.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{skill.mentor.reputationScore} REPUTATION</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">STREAK</p>
                      <div className="flex items-center justify-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-500" />
                        <span className="text-xs font-black text-white">{skill.mentor.teachingStreak}D</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-accent">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">BADGES</p>
                      <div className="flex items-center justify-center gap-1.5">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-black text-white">4 EXPERT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

