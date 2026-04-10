import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Github, Linkedin, Mail, Lock, Eye, EyeOff, User, Sparkles, Zap, ArrowRight, ShieldCheck, Activity, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/lib/api-client";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register({ name, email, password });
      
      toast({ title: 'PROFILE INITIALIZED', description: 'Account created. Please verify your email.' });
      navigate('/verify-email');
    } catch (error) {
      toast({ title: "INIT FAILED", description: error instanceof Error ? error.message : "Failed to establish secure link.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `http://localhost:3000/api/auth/${provider}`;
  };

  const handleComingSoon = () => {
    toast({ title: "Coming Soon", description: "This feature is currently in development." });
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] flex selection:bg-primary/30 selection:text-primary">
      {/* Cinematic Left Panel */}
      <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center p-20 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#818CF810,transparent_50%),radial-gradient(circle_at_30%_30%,#4F46E510,transparent_50%)]" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: "-3s" }} />
        </div>

        <div className="relative z-10 w-full max-w-2xl space-y-12">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-kinetic-gradient flex items-center justify-center shadow-kinetic group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-[0.2em] uppercase">Skill <span className="text-primary opacity-50">Barter</span></span>
            </Link>

            <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
              Join the <br />
              <span className="text-gradient-kinetic">Skill Community</span>
            </h2>
            
            <p className="text-xl text-white/40 font-medium leading-relaxed max-w-lg">
              Synchronize your expertise with a global network of professionals. Exchange skills, earn reputation, and scale your potential.
            </p>
          </div>

          {/* Initial Credit Reveal Visual */}
          <div className="bento-card p-10 bg-white/[0.03] border-primary/20 relative group overflow-hidden max-w-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/30 transition-all duration-1000" />
            
            <div className="relative z-10 flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-kinetic-gradient flex items-center justify-center shadow-kinetic animate-pulse-coin">
                <Coins className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-2">
                <Badge variant="premium" className="text-[10px] tracking-[0.2em]">INITIAL PROTOCOL CREDIT</Badge>
                <p className="text-5xl font-black text-white tracking-tighter leading-none">50 <span className="text-xl text-primary font-black uppercase tracking-widest ml-1">STC</span></p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Awaiting Identity Verification</p>
              </div>
            </div>
            
            {/* Background floating specs */}
            <div className="absolute bottom-4 right-4 text-[8px] font-black text-white/5 uppercase tracking-[0.5em] select-none">
              SECURITY LAYER 4 APPROVED // QUANTUM ENCRYPTION ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Focused Registration Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0D0D12] relative">
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-kinetic-gradient flex items-center justify-center text-white p-1">
              <Zap className="w-full h-full" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest">SkillBarter</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm space-y-10"
        >
          <div className="space-y-3">
            <Badge variant="ghost" className="text-[9px] font-black uppercase tracking-[0.3em]">Profile Setup</Badge>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Initialize identity</h1>
            <p className="text-sm text-white/40 font-medium tracking-tight">Establish your account in the community.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" onClick={() => handleOAuth('github')} className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] transition-all">
              <Github className="w-4 h-4 mr-2" /> GitHub
            </Button>
            <Button variant="outline" type="button" onClick={() => handleOAuth('linkedin')} className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] transition-all">
              <Linkedin className="w-4 h-4 mr-2 text-[#0A66C2]" /> LinkedIn
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]">
              <span className="bg-[#0D0D12] px-4 text-white/20 group-hover:text-white/40 transition-colors">Account Credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Identity Display</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="name" 
                  placeholder="AGENT-NAME (E.G. ALEX_VANCE)" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="h-14 pl-12 rounded-2xl bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 text-white font-bold placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-widest transition-all"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Universal Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="AGENT@NETWORK.DOMAIN" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="h-14 pl-12 rounded-2xl bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 text-white font-bold placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-widest transition-all"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Secret Keyphrase</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type={showPw ? "text" : "password"} 
                  placeholder="••••••••••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="h-14 pl-12 pr-12 rounded-2xl bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 text-white font-bold placeholder:text-white/10 transition-all"
                  required 
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-kinetic-gradient text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-kinetic group relative overflow-hidden active:scale-95 transition-all mt-4">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "INITIALIZING NODE..." : (
                  <>Create Node & Claim 50 STC <ArrowRight className="w-4 h-4" /></>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </form>

          <footer className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
              Existing Node Identity? <Link to="/login" className="text-primary hover:text-primary/80 transition-colors ml-2">Synchronize Now</Link>
            </p>
          </footer>
        </motion.div>
      </div>

      {/* Interactive Floating Micro-particles */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0
            }}
            animate={{ 
              y: [null, "-20%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
          />
        ))}
      </div>
    </div>
  );
}




