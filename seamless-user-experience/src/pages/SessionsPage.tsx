import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, CheckCircle, AlertTriangle, Video, MapPin, Calendar, MoreHorizontal, Zap, Shield, ChevronRight, Activity, HardDrive, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { mockSessions } from "@/lib/mock-data";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { color: string; icon: LucideIcon; glow: string }> = {
  PENDING: { color: "accent", icon: Clock, glow: "shadow-[0_0_15px_rgba(234,179,8,0.2)]" },
  ACTIVE: { color: "premium", icon: Video, glow: "shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
  COMPLETED: { color: "success", icon: CheckCircle, glow: "shadow-[0_0_15px_rgba(34,197,94,0.1)]" },
  DISPUTED: { color: "destructive", icon: AlertTriangle, glow: "shadow-[0_0_15px_rgba(239,68,68,0.1)]" },
};

export default function SessionsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const upcoming = mockSessions.filter(s => ["PENDING", "ACTIVE"].includes(s.status));
  const past = mockSessions.filter(s => ["COMPLETED", "DISPUTED"].includes(s.status));

  return (
    <div className="min-h-dvh bg-[#0D0D12] selection:bg-primary/30 selection:text-primary">
      <Navbar isAuthenticated />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em]">Session Intelligence</Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
                Intelligence <br />
                <span className="text-gradient-kinetic">Exchanges</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-8 text-right">
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">TOTAL TRANSFERS</p>
                <p className="text-3xl font-black text-white leading-none">12.4K <span className="text-xs text-white/40 font-bold uppercase ml-1">STC</span></p>
              </div>
              <div className="w-[1px] h-12 bg-white/5" />
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">NETWORK HEALTH</p>
                <p className="text-3xl font-black text-accent leading-none">OPTIMAL</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4">
              <TabsList className="bg-white/5 p-1.5 rounded-2xl border border-white/5">
                <TabsTrigger value="upcoming" className="px-8 py-3 rounded-xl data-[state=active]:bg-kinetic-gradient data-[state=active]:text-white font-black uppercase tracking-widest text-[9px] transition-all">
                  Upcoming Operations <span className="ml-2 py-0.5 px-1.5 rounded-md bg-white/10 text-[8px]">{upcoming.length}</span>
                </TabsTrigger>
                <TabsTrigger value="past" className="px-8 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-black font-black uppercase tracking-widest text-[9px] transition-all">
                  Archive <span className="ml-2 py-0.5 px-1.5 rounded-md bg-white/10 text-[8px]">{past.length}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="upcoming" className="mt-0 focus-visible:outline-none">
                <div className="grid gap-6">
                  {upcoming.map((session, idx) => {
                    const config = statusConfig[session.status];
                    const Icon = config.icon;
                    const canJoin = new Date(session.startTime).getTime() - Date.now() < 60 * 60 * 1000;
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bento-card group hover:border-white/10 overflow-hidden"
                      >
                        <div className="p-8 flex flex-col lg:flex-row items-center gap-12">
                          {/* Left: Mentor Details */}
                          <div className="flex items-center gap-6 min-w-[320px]">
                            <div className="relative shrink-0">
                              <img src={session.mentorAvatar} alt="" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/5" />
                              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-black border border-white/5 flex items-center justify-center ${config.glow}`}>
                                <Icon className={`w-4 h-4 text-${config.color}-500`} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-xl font-black text-white tracking-tighter uppercase group-hover:text-primary transition-colors">{session.skillTitle}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="ghost" className="opacity-60">MENTOR</Badge>
                                <span className="text-xs font-black text-white placeholder:uppercase tracking-widest">{session.mentorName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Center: Mission Specs */}
                          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">OPERATIONAL STATUS</p>
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500 ${session.status === "ACTIVE" ? "animate-pulse shadow-[0_0_8px_var(--primary)]" : ""}`} />
                                <span className="text-xs font-black text-white uppercase tracking-widest">{session.status}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">SCHEDULED START</p>
                              <span className="text-xs font-black text-white uppercase tracking-widest">{format(new Date(session.startTime), "h:mm a")}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">CALENDAR DATE</p>
                              <span className="text-xs font-black text-white uppercase tracking-widest">{format(new Date(session.startTime), "MMM d, yyyy")}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">SECURITY CLEARANCE</p>
                              <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-accent" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">LEVEL 4</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Interaction */}
                          <div className="shrink-0 flex items-center gap-4">
                            {canJoin ? (
                              <Button className="h-16 px-10 rounded-2xl bg-kinetic-gradient text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-kinetic hover:scale-105 active:scale-95 transition-all group/btn" onClick={() => navigate(`/classroom/${session.id}`)}>
                                Enter Exchange Room <Video className="w-4 h-4 ml-3 group-hover/btn:rotate-12 transition-all" />
                              </Button>
                            ) : (
                              <Button disabled variant="outline" className="h-16 px-10 rounded-2xl border-white/5 bg-white/5 text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">
                                Room Locking... <Clock className="w-4 h-4 ml-3" />
                              </Button>
                            )}
                            <Button variant="ghost" className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 text-white flex items-center justify-center p-0" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                        {/* Status bar base */}
                        <div className={`h-1 w-full bg-${config.color}-500/20`} />
                      </motion.div>
                    );
                  })}

                  {upcoming.length === 0 && (
                    <div className="bento-card py-24 text-center border-dashed border-white/10">
                      <HardDrive className="w-16 h-16 mx-auto mb-6 text-white/10" />
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No Active Exchanges Found</p>
                      <Button variant="link" className="text-primary uppercase tracking-widest text-xs font-black mt-4" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>Browse Intelligence Marketplace</Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past" className="mt-0 focus-visible:outline-none">
                <div className="grid gap-4">
                  {past.map((session, idx) => {
                    const config = statusConfig[session.status];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bento-card p-6 flex items-center justify-between group hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-center gap-8">
                          <img src={session.mentorAvatar} alt="" className="w-12 h-12 rounded-xl grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100" />
                          <div>
                            <h3 className="text-sm font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">{session.skillTitle}</h3>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Interrogation with {session.mentorName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-12">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{format(new Date(session.startTime), "MMM d, yyyy")}</p>
                            <div className={`text-[10px] font-black text-${config.color}-500/80 uppercase tracking-widest mt-1`}>{session.status}</div>
                          </div>
                          <Button variant="ghost" className="w-12 h-12 rounded-xl hover:bg-white/10 text-white/20 hover:text-white" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}





