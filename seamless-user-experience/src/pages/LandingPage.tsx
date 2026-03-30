import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coins, ArrowRight, Shield, Zap, Users, Trophy, Github, Linkedin, Sparkles, Globe, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const features = [
  { icon: Coins, title: "Token Economy", description: "Earn SkillCoins by teaching, spend them to learn. No money needed — knowledge is the currency.", accent: "from-indigo-500/20 to-purple-500/20" },
  { icon: Shield, title: "Escrow Protection", description: "Tokens locked until both sides confirm. Disputes handled fairly by expert review.", accent: "from-teal-500/20 to-emerald-500/20" },
  { icon: Zap, title: "Live Classrooms", description: "Sleek video environments with collaborative tools for deep, interactive learning.", accent: "from-blue-500/20 to-cyan-500/20" },
  { icon: Trophy, title: "Bounty Board", description: "Post challenges with coin rewards. Earn by solving complex problems for the community.", accent: "from-amber-500/20 to-orange-500/20" },
  { icon: Users, title: "The P2P Atelier", description: "Learn from real practitioners in an exclusive, high-end studio environment.", accent: "from-rose-500/20 to-pink-500/20" },
  { icon: Globe, title: "Global Network", description: "Connect with mentors across the globe. No boundaries to your growth.", accent: "from-violet-500/20 to-fuchsia-500/20" },
];

const stats = [
  { value: "50K+", label: "Skill Exchanges", color: "text-primary" },
  { value: "1.2M", label: "Tokens Circulating", color: "text-accent" },
  { value: "4.9/5", label: "Average Rating", color: "text-white" },
  { value: "150+", label: "Countries", color: "text-primary" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D12] selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-30" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-4xl mx-auto text-center" initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-white/80">Barter Your Skills, Grow Your Community</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              KNOWLEDGE IS THE<br />
              <span className="text-gradient-kinetic">NEW CURRENCY</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Skill Barter is the premier P2P marketplace where you teach to earn and learn to grow. No fees, no barriers—just pure exchange.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register">
                <Button size="lg" className="h-14 px-10 text-lg font-bold bg-kinetic-gradient hover:opacity-90 shadow-kinetic transition-all duration-300 rounded-full">
                  Start Bartering
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white/10 hover:bg-white/5 backdrop-blur-md rounded-full">
                  Browse Skills <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-2 text-white font-bold tracking-tighter">
                <Github className="w-6 h-6" /> GitHub
              </div>
              <div className="flex items-center gap-2 text-white font-bold tracking-tighter">
                <Linkedin className="w-6 h-6" /> LinkedIn
              </div>
              <div className="flex items-center gap-2 text-white font-bold tracking-tighter uppercase text-xl italic">
                Verified Community
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section className="py-20 relative border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bento-card text-center flex flex-col items-center justify-center min-h-[160px]"
              >
                <div className={`text-5xl font-black ${stat.color} tracking-tighter mb-2`}>{stat.value}</div>
                <div className="text-white/40 font-medium uppercase tracking-[0.2em] text-[10px]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter mb-6">
                THE NEON<br />
                <span className="text-accent italic">ATELIER</span>
              </h2>
              <p className="text-xl text-white/50 leading-relaxed">
                Experience a marketplace optimized for the modern creator. Every interaction is designed to be seamless, visual, and rewarding.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <Rocket className="w-6 h-6" />
              Building the future of learning
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bento-card group flex flex-col min-h-[300px]"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-white/40 leading-relaxed mt-auto text-sm">{f.description}</p>
                <div className="h-1 w-0 bg-primary mt-6 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kinetic CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 opacity-30 skew-y-3" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-kinetic-gradient p-12 md:p-24 rounded-[3rem] text-center shadow-kinetic"
          >
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
              READY TO<br />BARTER?
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-xl mx-auto font-medium">
              Join the elite circle of mentors and learners today. Get 50 SkillCoins free upon registration.
            </p>
            <Link to="/register">
              <Button size="lg" className="h-16 px-12 text-xl font-black bg-white text-primary hover:bg-white/90 rounded-full transition-transform hover:scale-105 active:scale-95">
                Join Now <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Obsidian Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#08080A]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-3 mb-8 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 glass-card p-1.5 group-hover:border-primary/50 transition-all duration-500">
                  <img src="/logo.png" alt="Skill Barter" className="w-full h-full object-contain" />
                </div>
                SKILL<span className="text-gradient-kinetic">BARTER</span>
              </Link>
              <p className="text-white/40 max-w-sm leading-relaxed mb-8">
                Revolutionizing how the world shares knowledge. No fees, no banks, just the collective intelligence of the community.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary transition-colors cursor-pointer"><Github className="w-5 h-5 text-white/60" /></div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary transition-colors cursor-pointer"><Linkedin className="w-5 h-5 text-white/60" /></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><Link to="/bounties" className="hover:text-primary transition-colors">Bounty Board</Link></li>
                <li><Link to="/wallet" className="hover:text-primary transition-colors">Coin Wallet</Link></li>
                <li><Link to="/sessions" className="hover:text-primary transition-colors">Live Sessions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-4">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">© 2025 SKILLBARTER CO. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-6">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

