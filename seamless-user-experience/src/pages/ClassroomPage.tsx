import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, Mic, MonitorUp, PhoneOff, MessageSquare, PenTool, Code, AlertTriangle, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

export default function ClassroomPage() {
  const { toast } = useToast();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [activeTool, setActiveTool] = useState<'video' | 'code' | 'whiteboard'>('video');
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="h-dvh flex flex-col bg-[#0D0D12] overflow-hidden">
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Live Node: {sessionId || 'SYNC-ALPHA-1'}</span>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 uppercase tracking-[0.2em] text-[9px] font-black">Encrypted P2P</Badge>
        </div>

        <div className="flex items-center justify-center gap-2 bg-white/5 p-1 rounded-2xl">
          <Button variant={activeTool === 'video' ? "default" : "ghost"} size="icon" className="rounded-xl w-10 h-10 transition-all" onClick={() => setActiveTool('video')}>
            <Video className="w-4 h-4" />
          </Button>
          <Button variant={activeTool === 'code' ? "default" : "ghost"} size="icon" className="rounded-xl w-10 h-10 transition-all" onClick={() => setActiveTool('code')}>
            <Code className="w-4 h-4" />
          </Button>
          <Button variant={activeTool === 'whiteboard' ? "default" : "ghost"} size="icon" className="rounded-xl w-10 h-10 transition-all" onClick={() => setActiveTool('whiteboard')}>
            <PenTool className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="destructive" size="sm" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg" onClick={() => navigate('/sessions')}>
           <PhoneOff className="w-3 h-3 mr-2" /> Terminate Link
        </Button>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
         {/* Left Side: Main View */}
         <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1 rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden relative group backdrop-blur-md">
               {activeTool === 'video' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <p className="text-white/20 font-black uppercase tracking-[0.5em] text-sm">Incoming WebRTC Stream...</p>
                 </div>
               )}
               {activeTool === 'code' && (
                 <div className="absolute inset-0 flex flex-col">
                    <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
                       <span className="text-[10px] font-black tracking-[0.2em] text-white/50">MONACO EDITOR PROTOCOL</span>
                       <div className="flex gap-2">
                         <Button size="sm" variant="ghost" className="h-6 text-[9px] uppercase tracking-[0.1em]" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}><Play className="w-3 h-3 mr-1" /> Run Auth</Button>
                       </div>
                    </div>
                    <div className="flex-1 bg-[#1E1E1E] p-4 font-mono text-sm text-green-400">
                      <div><span className="text-primary">import</span> {'{ useState }'} <span className="text-primary">from</span> 'react';</div>
                      <div className="text-white/30 mb-2">// System sync initialized</div>
                      <div className="mt-4">console.<span className="text-blue-400">log</span>('Ready for code pairing');</div>
                      <div className="mt-4 animate-pulse">_</div>
                    </div>
                 </div>
               )}
               {activeTool === 'whiteboard' && (
                 <div className="absolute inset-0 flex flex-col">
                   <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4">
                     <span className="text-[10px] font-black tracking-[0.2em] text-white/50">EXCALIDRAW CANVAS [MOCKED]</span>
                   </div>
                   <div className="flex-1 flex items-center justify-center bg-white/5">
                     <div className="text-center opacity-30 cursor-crosshair">
                        <PenTool className="w-16 h-16 mx-auto mb-4" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Draw Protocol Active</span>
                     </div>
                   </div>
                 </div>
               )}

               {/* Video PIP */}
               <div className="absolute bottom-4 right-4 w-64 aspect-video bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-3">
                    <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">Local User (You)</span>
                  </div>
                  {!isVideoOn && (
                     <div className="absolute inset-0 flex items-center justify-center">
                       <Video className="w-8 h-8 text-white/10" />
                     </div>
                  )}
               </div>
            </div>

            {/* Controls */}
            <div className="h-24 mt-4 flex items-center justify-center gap-4 shrink-0">
               <Button onClick={() => setIsMicOn(!isMicOn)} variant={isMicOn ? "outline" : "destructive"} size="icon" className="w-14 h-14 rounded-2xl border-white/10">
                  <Mic className={"w-6 h-6 "} />
               </Button>
               <Button onClick={() => setIsVideoOn(!isVideoOn)} variant={isVideoOn ? "outline" : "destructive"} size="icon" className="w-14 h-14 rounded-2xl border-white/10">
                  <Video className={"w-6 h-6 "} />
               </Button>
               <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-white/10" onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>
                  <MonitorUp className="w-6 h-6" />
               </Button>
               <Button variant={chatOpen ? "default" : "outline"} onClick={() => setChatOpen(!chatOpen)} size="icon" className="w-14 h-14 rounded-2xl border-white/10">
                  <MessageSquare className="w-6 h-6" />
               </Button>
            </div>
         </div>

         {/* Right Side: Chat Panel */}
         {chatOpen && (
           <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} className="shrink-0 border-l border-white/5 bg-white/[0.01] flex flex-col">
             <div className="p-4 border-b border-white/5 bg-white/5">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Session Logs</h3>
             </div>
             <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-xs">
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-lg bg-primary/20 shrink-0 flex items-center justify-center">S</div>
                   <div>
                     <p className="text-primary text-[10px] uppercase font-bold mb-1">System</p>
                     <p className="text-white/80">Peer-to-peer connection established. End-to-end encryption verified.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/20 shrink-0 flex items-center justify-center text-emerald-400">T</div>
                   <div>
                     <p className="text-emerald-500 text-[10px] uppercase font-bold mb-1">Tutor</p>
                     <p className="text-white/80">Welcome! Let's switch to the code tab and review your implementation.</p>
                   </div>
                </div>
             </div>
             <div className="p-4 border-t border-white/5">
                <div className="relative">
                  <input type="text" placeholder="Transmit to peer..." className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 text-white transition-all" />
                </div>
             </div>
           </motion.div>
         )}
      </main>
    </div>
  );
}
