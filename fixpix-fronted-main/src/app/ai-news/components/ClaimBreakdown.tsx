import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Globe, Target, Hash, Info } from 'lucide-react';

interface ClaimBreakdownProps {
  breakdown: {
    entities: string[];
    intent: string;
    category: string;
    claim_type: string;
    keywords: string[];
  };
}

const ClaimBreakdown: React.FC<ClaimBreakdownProps> = ({ breakdown }) => {
  if (!breakdown) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group mb-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm">
          <Brain size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Intelligence Breakdown</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Automated Query Decomposition</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Entities */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={12} className="text-blue-500" /> Key Entities Detected
            </h4>
            <div className="flex flex-wrap gap-2">
              {breakdown.entities.length > 0 ? breakdown.entities.map((ent, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                  {ent}
                </span>
              )) : (
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">No specific entities</span>
              )}
            </div>
          </div>

          {/* Intent */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Target size={12} className="text-rose-500" /> Extracted Intent
            </h4>
            <p className="text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
              "{breakdown.intent}"
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category</span>
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{breakdown.category}</span>
            </div>
            <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Claim Type</span>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{breakdown.claim_type}</span>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Hash size={12} className="text-emerald-500" /> Research Slugs
            </h4>
            <div className="flex flex-wrap gap-2">
              {breakdown.keywords.map((kw, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-slate-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
        <Info size={12} className="text-slate-300" />
        <p className="text-[10px] text-slate-300 font-bold italic tracking-wide">
          Intelligence pre-processing complete. Reasoning engine is now analyzing OSINT evidence...
        </p>
      </div>
    </motion.div>
  );
};

export default ClaimBreakdown;
