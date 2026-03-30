import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Github, Linkedin, Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, ArrowRight, BrainCircuit, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/lib/api-client";

export default function LoginPage() {
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
      const response = await authApi.login({ email, password });
      const token = response.accessToken || response.access_token;
      if (token) {
        localStorage.setItem('skill_barter_token', token);
        toast({ title: "AUTHENTICATION SUCCESSFUL", description: "Identity verified. Redirecting to your dashboard." });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "AUTH FAILED", description: error.message || "Invalid credentials.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] flex selection:bg-primary/30 selection:text-primary">
      {/* Cinematic Left Panel */}
      <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center p-20 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#4F46E510,transparent_50%),radial-gradient(circle_at_70%_30%,#818CF810,transparent_50%)]" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: "-2s" }} />
        </div>

        <div className="relative z-10 w-full max-max-2xl space-y-12">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-kinetic-gradient flex items-center justify-center shadow-kinetic group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-[0.2em] uppercase">Skill <span className="text-primary opacity-50">Barter</span></span>
            </Link>

            <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
              Secure Your <br />
              <span className="text-gradient-kinetic">Expert Assets</span>
            </h2>
            
            <p className="text-xl text-white/40 font-medium leading-relaxed max-w-lg italic">
              "In the economy of information, your expertise is the highest-value currency. Secure your seat at the global marketplace."
            </p>
          </div>

          {/* Live System Stats Visual */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bento-card p-6 bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-5 h-5 text-success-500" />
                <Badge variant="success" className="text-[8px]">ACTIVE SECURITY</Badge>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">IDENTITY LAYER</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "94%" }} 
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-full bg-success-500" 
                />
              </div>
              <p className="text-lg font-black text-white">99.9% VERIFIED</p>
            </div>

            <div className="bento-card p-6 bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <Zap className="w-5 h-5 text-primary" />
                <Badge variant="premium" className="text-[8px]">PROTOCOL 4.2</Badge>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">EXCHANGE VELOCITY</p>
              <div className="flex items-end gap-1 h-6">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="flex-1 bg-primary/40 rounded-t-sm"
                  />
                ))}
              </div>
              <p className="text-lg font-black text-white">4.8K TPS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Focused Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0D0D12] relative">
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-kinetic-gradient flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
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
            <Badge variant="ghost" className="text-[9px] font-black uppercase tracking-[0.3em]">Access Protocol</Badge>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Identify Yourself</h1>
            <p className="text-sm text-white/40 font-medium tracking-tight">Enter your encrypted credentials to synchronize.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] transition-all">
              <Github className="w-4 h-4 mr-2" /> GitHub
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] transition-all">
              <Linkedin className="w-4 h-4 mr-2 text-[#0A66C2]" /> LinkedIn
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]">
              <span className="bg-[#0D0D12] px-4 text-white/20 group-hover:text-white/40 transition-colors">Digital Signature</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Universal Identifier</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="AGENT-ID@PROTOCOL.NETWORK" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="h-14 pl-12 rounded-2xl bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 text-white font-bold placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-widest transition-all"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secret Keyphrase</Label>
                <button type="button" className="text-[10px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors">Lost Recovery?</button>
              </div>
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

            <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-kinetic-gradient text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-kinetic group relative overflow-hidden active:scale-95 transition-all">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "AUTHENTICATING..." : (
                  <>Initial Authorization <ArrowRight className="w-4 h-4" /></>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </form>

          <footer className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
              Unregistered Identity? <Link to="/register" className="text-primary hover:text-primary/80 transition-colors ml-2">Initialize New Node</Link>
            </p>
          </footer>
        </motion.div>
      </div>

      {/* Interactive Floating Micro-particles */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
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

