import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Coins, Flame, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    priceCoins: number;
    mentor?: { name: string; avatar: string; reputationScore: number; teachingStreak: number };
    user?: { id: string; email: string; reputationScore: string | number; name?: string; avatar?: string; teachingStreak?: number };
    reviewCount?: number;
  };
}

const levelConfigs: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "Level 1 • Beginner", color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
  INTERMEDIATE: { label: "Level 2 • Intermediate", color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
  EXPERT: { label: "Level 3 • Expert", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
};

export function SkillCard({ skill }: SkillCardProps) {
  const config = levelConfigs[skill.level] || levelConfigs.BEGINNER;

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link to={`/marketplace/${skill.id}`} className="block h-full group">
        <div className="bento-card h-full flex flex-col group-hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>

          <div className="flex items-start justify-between mb-6">
            <Badge variant="outline" className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${config.color}`}>
              {config.label}
            </Badge>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/20 transition-colors">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-black text-sm text-white tracking-tighter">{skill.priceCoins} STC</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {skill.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed line-clamp-3">
              {skill.description}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={skill.mentor?.avatar || skill.user?.avatar || ("https://api.dicebear.com/7.x/bottts/svg?seed=" + (skill.user?.id || skill.id))} alt={skill.mentor?.name || skill.user?.name || skill.user?.email || "Mentor"} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-primary/20 transition-all" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0D0D12] border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-2.5 h-2.5 text-teal-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1 max-w-[120px]">{skill.mentor?.name || skill.user?.name || skill.user?.email?.split('@')[0] || "Agent_Null"}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-[11px] font-black text-white/40">{skill.mentor?.reputationScore ?? skill.user?.reputationScore ?? "4.5"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span className="text-[11px] font-black text-white/40">{skill.mentor?.teachingStreak ?? skill.user?.teachingStreak ?? "3"}D</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

