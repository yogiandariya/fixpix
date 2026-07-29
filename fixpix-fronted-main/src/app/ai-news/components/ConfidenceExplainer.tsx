import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Search, AlertCircle, BarChart3, CheckCircle2 } from 'lucide-react';

interface ConfidenceExplainerProps {
  confidence: number;
  explanation?: string;
  breakdown?: {
    source_quality: string;
    evidence_count: number;
    contradictions: number;
    data_consistency: string;
  };
}

const ConfidenceExplainer: React.FC<ConfidenceExplainerProps> = ({ confidence, explanation, breakdown }) => {
  const getStatusColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-100 bar-emerald-500';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-100 bar-amber-500';
    return 'text-rose-600 bg-rose-50 border-rose-100 bar-rose-500';
  };

  const status = getStatusColor(confidence);
  const colorClass = status.split(' ')[0];
  const bgClass = status.split(' ')[1];
  const borderClass = status.split(' ')[2];
  const barClass = status.split(' ')[3].replace('bar-', 'bg-');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group mb-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${bgClass} ${colorClass} shadow-sm`}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Verification Confidence</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Reliability Scoring System</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full ${bgClass} ${borderClass} border flex items-center gap-2`}>
           <span className={`text-lg font-black ${colorClass}`}>{confidence}%</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reliable</span>
        </div>
      </div>

      {/* Animated Confidence Bar */}
      <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden mb-10 border border-slate-100 flex p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full shadow-sm ${barClass}`}
        />
      </div>

      {/* 4-Factor Breakdown Grid */}
      {breakdown && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
              <Search size={10} /> Sources
            </span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{breakdown.source_quality} Quality</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
              <BarChart3 size={10} /> Evidence
            </span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{breakdown.evidence_count} Signals</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
              <AlertCircle size={10} /> Conflicts
            </span>
            <span className={`text-xs font-black ${breakdown.contradictions > 0 ? 'text-rose-500' : 'text-slate-800'} uppercase tracking-widest`}>
              {breakdown.contradictions} Detected
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
              <CheckCircle2 size={10} /> Data Sync
            </span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{breakdown.data_consistency}</span>
          </div>
        </div>
      )}

      {/* Human Explanation */}
      {explanation && (
        <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 relative">
          <div className="absolute top-4 left-6">
            <Info size={14} className="text-slate-400" />
          </div>
          <div className="pl-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Transparency Report</h4>
            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
              "{explanation}"
            </p>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[10px] text-slate-300 font-bold italic tracking-wide">
          Mathematical trust score finalized. High-fidelity verification complete.
        </p>
      </div>
    </motion.div>
  );
};

export default ConfidenceExplainer;
