import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Bell, Menu, X, Search, User, LogOut, LayoutDashboard, BookOpen, Trophy, Wallet, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockUser, mockNotifications } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { to: "/marketplace", label: "Marketplace", icon: Search },
  { to: "/bounties", label: "Bounty Board", icon: Trophy },
];

const authLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sessions", label: "Sessions", icon: BookOpen },
  { to: "/wallet", label: "Wallet", icon: Wallet },
];

export function Navbar({ isAuthenticated: initialAuth = false }: { isAuthenticated?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const location = useLocation();
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check for real user data if authenticated
    const token = localStorage.getItem('skill_barter_token');
    if (token) {
      // In a real app, we'd fetch the actual user, but for now we'll 
      // assume mockUser if no real user is fetched yet to maintain visual fidelity.
      setUser(mockUser); 
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = !!localStorage.getItem('skill_barter_token') || initialAuth;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4 bg-[#0D0D12]/80 backdrop-blur-xl border-b border-white/5" : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-display font-black text-2xl tracking-tighter group">
          <div className="w-11 h-11 rounded-xl bg-kinetic-gradient flex items-center justify-center shadow-kinetic group-hover:scale-110 transition-transform p-2">
            <Zap className="w-full h-full text-white fill-white/20" />
          </div>
          <span className="text-white hidden sm:inline uppercase tracking-tighter">SKILL<span className="text-gradient-kinetic">BARTER</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-full backdrop-blur-md">
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                isActive(link.to) 
                  ? "bg-white/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && authLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                isActive(link.to) 
                  ? "bg-white/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {/* Admin Portal Redirect - Condition: Role.ADMIN */}
              {(user?.role === 'ADMIN' || localStorage.getItem('skill_barter_role') === 'ADMIN') && (
                <Link to="/admin">
                  <Button variant="ghost" className="h-10 px-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 transition-all font-black uppercase tracking-tighter text-[9px] flex items-center gap-2" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>
                    <ShieldCheck className="w-4 h-4" /> Admin Portal
                  </Button>
                </Link>
              )}

              {/* Network Status Tracker */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <div className="network-pulse">
                   <span className="network-pulse-ring bg-secondary" />
                   <span className="network-pulse-dot bg-secondary" />
                </div>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Ready</span>
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-coin/10 border border-coin/20 backdrop-blur-md shadow-inner"
              >
                <Sparkles className="w-4 h-4 text-coin animate-pulse" />
                <span className="text-sm font-black text-coin uppercase tracking-tighter">{user?.tokenBalance ?? mockUser.tokenBalance} STC</span>
              </motion.div>
              
              <Link to="/notifications" className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-primary transition-colors group overflow-hidden">
                <Bell className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-[#0D0D12]" />
                )}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <button 
                onClick={() => {
                  localStorage.removeItem('skill_barter_token');
                  localStorage.removeItem('skill_barter_role');
                  window.location.href = '/';
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-rose-500 text-white/40 hover:text-rose-500 transition-all group"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <Link to="/profile/me" className="w-10 h-10 rounded-full border-2 border-white/10 hover:border-primary transition-all duration-500 overflow-hidden shadow-2xl">
                <img src={user?.avatar ?? mockUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-kinetic-gradient text-white font-black uppercase tracking-widest text-[10px] px-8 shadow-kinetic rounded-full hover:shadow-kinetic-glow transition-all" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="fixed inset-0 top-[72px] bg-[#0D0D12] z-40 lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black px-4">Navigation</p>
                {navLinks.map(link => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white/5 border border-white/5 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors">
                        <link.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xl font-black text-white">{link.label}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black px-4">Workspace</p>
                  {authLinks.map(link => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white/5 border border-white/5 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors">
                          <link.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-black text-white">{link.label}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 pt-8">
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full h-16 text-xl font-black bg-kinetic-gradient rounded-2xl shadow-kinetic" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>Get Started</Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full h-16 text-xl font-black text-white/50 hover:text-white" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>Log in</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

