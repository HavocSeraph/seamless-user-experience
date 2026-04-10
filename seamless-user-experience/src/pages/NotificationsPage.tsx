import { motion, AnimatePresence } from "framer-motion";
import { Bell, BookOpen, Coins, MessageSquare, Clock, ShieldCheck, Activity, Zap, Sparkles, Inbox, Archive, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { mockNotifications } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const typeConfig: Record<string, { icon: LucideIcon; color: string; glow: string }> = {
  SESSION_BOOKED: { icon: BookOpen, color: "primary", glow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]" },
  SESSION_REMINDER: { icon: Clock, color: "accent", glow: "shadow-[0_0_15px_rgba(234,179,8,0.2)]" },
  BOUNTY_ANSWER: { icon: MessageSquare, color: "indigo", glow: "shadow-[0_0_15px_rgba(99,102,241,0.2)]" },
  COINS_EARNED: { icon: Coins, color: "teal", glow: "shadow-[0_0_15px_rgba(20,184,166,0.2)]" },
};

export default function NotificationsPage() {
  const { toast } = useToast();
  return (
    <div className="min-h-dvh bg-[#0D0D12] selection:bg-primary/30 selection:text-primary">
      <Navbar isAuthenticated />

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10"
        >
          {/* Header Section */}
          <div className="flex items-end justify-between pb-8 border-b border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Bell className="w-5 h-5 text-orange-500" />
                </div>
                <Badge variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Updates</Badge>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">
                Intelligence <br />
                <span className="text-gradient-kinetic">Feed</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="h-12 px-6 rounded-xl border border-white/5 bg-white/5 text-white/40 hover:text-white font-black uppercase tracking-widest text-[9px] transition-all" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>
                Mark All Read
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {mockNotifications.length > 0 ? (
              mockNotifications.map((notif, i) => {
                const config = typeConfig[notif.type] || { icon: Bell, color: "slate", glow: "" };
                const Icon = config.icon;
                
                return (
                  <motion.div 
                    key={notif.id} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className={`bento-card group p-6 flex items-start gap-6 transition-all hover:bg-white/[0.04] ${!notif.isRead ? "border-primary/20 bg-primary/[0.02]" : "border-white/5 bg-transparent opacity-60"}`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${!notif.isRead ? `bg-${config.color}-500/20 border-${config.color}-500/30 ${config.glow}` : "bg-white/5 border-white/5"}`}>
                        <Icon className={`w-6 h-6 ${!notif.isRead ? `text-${config.color}-400` : "text-white/20"}`} />
                      </div>
                      {!notif.isRead && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary border-4 border-[#0D0D12] animate-pulse shadow-[0_0_10px_var(--primary)]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="ghost" className="text-[8px] tracking-[0.2em] font-black opacity-40 uppercase">
                          {notif.type.replace("_", " ")}
                        </Badge>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-base tracking-tight leading-relaxed ${!notif.isRead ? "text-white font-black" : "text-white/40 font-bold"}`}>
                        {notif.message}
                      </p>
                      
                      {!notif.isRead && (
                        <div className="pt-2 flex items-center gap-4">
                          <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 group/btn">
                            Action Protocol <Zap className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bento-card py-24 text-center border-dashed border-white/10 opacity-30">
                <Inbox className="w-16 h-16 mx-auto mb-6" />
                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Intelligence Inbox Empty</p>
                <p className="text-[8px] font-bold text-white uppercase tracking-widest mt-2">Check back for mission updates</p>
              </div>
            )}
          </div>

          {/* Footer Control */}
          <div className="flex justify-center pt-8">
            <Button variant="ghost" className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-white transition-all flex items-center gap-3" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>
              <Archive className="w-4 h-4" /> Load Encrypted Archives
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

