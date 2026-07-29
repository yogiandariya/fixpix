import React from 'react';
import { motion } from 'framer-motion';
import { Share2, ExternalLink, Shield, AlertCircle, HelpCircle } from 'lucide-react';

interface SourceNode {
  name: string;
  url: string;
  domain: string;
  credibility: number;
  stance: 'support' | 'contradict' | 'neutral';
  title: string;
}

interface VisualTrustMapProps {
  sources: SourceNode[];
  claim?: string;
}

const VisualTrustMap: React.FC<VisualTrustMapProps> = ({ sources, claim }) => {
  if (!sources || sources.length === 0) return null;

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'support': return 'bg-emerald-500 border-emerald-400 text-emerald-50';
      case 'contradict': return 'bg-rose-500 border-rose-400 text-rose-50';
      default: return 'bg-amber-500 border-amber-400 text-amber-50';
    }
  };

  const getStanceLabel = (stance: string) => {
    switch (stance) {
      case 'support': return { icon: <Shield size={10} />, text: 'Supports' };
      case 'contradict': return { icon: <AlertCircle size={10} />, text: 'Contradicts' };
      default: return { icon: <HelpCircle size={10} />, text: 'Neutral' };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden mb-8"
    >
      {/* Background Grid/Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Share2 size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">OSINT Visual Intelligence Map</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Global Evidence Consensus Mesh</p>
        </div>
      </div>

      <div className="relative min-h-[400px] flex items-center justify-center py-10">
        {/* Center Node (Claim) */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative z-20 bg-white shadow-[0_0_50px_rgba(255,255,255,0.1)] p-6 rounded-[2rem] border-4 border-slate-800 w-48 text-center group"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Core Claim
          </div>
          <p className="text-xs font-black text-slate-800 leading-tight line-clamp-3">
            {claim || "Active News Intelligence Analysis"}
          </p>
        </motion.div>

        {/* Source Nodes */}
        <div className="absolute inset-0 z-10">
          {sources.map((src, i) => {
            const angle = (i * (360 / sources.length)) * (Math.PI / 180);
            const radius = 160;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <React.Fragment key={i}>
                {/* Connecting Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    x1="50%" y1="50%"
                    x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`}
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* Source Node */}
                <motion.a
                  href={src.url}
                  target="_blank"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, x, y }}
                  transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                  className={`absolute top-1/2 left-1/2 -ml-16 -mt-10 w-32 p-3 rounded-2xl border-2 shadow-lg transition-transform hover:scale-110 z-30 ${getStanceColor(src.stance)}`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[8px] font-black uppercase tracking-tighter truncate opacity-80">
                        {src.domain}
                      </span>
                      <ExternalLink size={8} className="shrink-0" />
                    </div>
                    <div className="flex items-center gap-1">
                      {getStanceLabel(src.stance).icon}
                      <span className="text-[8px] font-black uppercase tracking-widest">
                         {getStanceLabel(src.stance).text}
                      </span>
                    </div>
                    <div className="mt-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${src.credibility * 100}%` }} />
                    </div>
                  </div>
                </motion.a>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Supports Narrative</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Opposing Evidence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Neutral Context</span>
        </div>
      </div>
    </motion.div>
  );
};

export default VisualTrustMap;
