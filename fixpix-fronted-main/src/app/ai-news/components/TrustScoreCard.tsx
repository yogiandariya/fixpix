import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Info, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TrustScoreCardProps {
  score: number;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
}

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({ score, level, reasons }) => {
  const getColors = () => {
    switch (level) {
      case 'HIGH':
        return {
          text: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          bar: 'bg-emerald-500',
          icon: <ShieldCheck className="text-emerald-600" size={24} />
        };
      case 'MEDIUM':
        return {
          text: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          bar: 'bg-amber-500',
          icon: <AlertTriangle className="text-amber-600" size={24} />
        };
      case 'LOW':
        return {
          text: 'text-rose-600',
          bg: 'bg-rose-50',
          border: 'border-rose-100',
          bar: 'bg-rose-500',
          icon: <ShieldAlert className="text-rose-600" size={24} />
        };
      default:
        return {
          text: 'text-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-100',
          bar: 'bg-slate-500',
          icon: <Info className="text-slate-600" size={24} />
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm flex flex-col gap-6 sm:gap-8 h-full`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 ${colors.bg} rounded-2xl shadow-sm`}>
            {colors.icon}
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reliability Engine</h3>
            <div className="flex items-center gap-2">
              <span className={`text-base sm:text-lg font-black ${colors.text} tracking-tight italic`}>
                {level} SIGNAL
              </span>
            </div>
          </div>
        </div>
        
        <div className="group relative">
          <Info size={16} className="text-slate-300 cursor-help hover:text-slate-500 transition-colors" />
          <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-slate-900 text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50 leading-relaxed font-bold">
            The Trust Score is an autonomous calculation of real-world reliability based on source credibility, evidence density, and semantic contradictions.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <span className="text-4xl font-black text-slate-900">{score}<span className="text-sm text-slate-400 font-bold ml-1">/100</span></span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text} bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm`}>
            {score > 80 ? 'Exceptional' : score > 50 ? 'Verifiable' : 'Caution Advised'}
          </span>
        </div>
        
        <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className={`h-full ${colors.bar} rounded-full relative`}
          >
             <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Trust Contextualization</h4>
        <div className="space-y-4">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              className="flex items-start gap-4"
            >
              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.bar} ring-4 ${colors.bg} shrink-0`} />
              <p className="text-xs font-bold text-slate-600 leading-relaxed text-left">{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Background Element */}
      <div className={`absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none rotate-12 ${colors.text}`}>
         {colors.icon && React.cloneElement(colors.icon as React.ReactElement, { size: 180 })}
      </div>
    </motion.div>
  );
};
