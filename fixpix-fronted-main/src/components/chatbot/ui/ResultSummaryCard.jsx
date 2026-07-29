import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, FileText, Zap, ArrowRight, Download } from 'lucide-react';

const ResultSummaryCard = ({ result }) => {
  if (!result) return null;

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[24px] p-4 my-2 border transition-all"
        style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-soft)'
        }}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: '#34C759' }}>
                <CheckCircle2 size={20} strokeWidth={2.5} />
            </div>
            <div>
                <h4 className="text-[14px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>Optimization Complete</h4>
                <p className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>Applied {result.featureName}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-xl border" style={{ backgroundColor: 'var(--fill-tertiary)', borderColor: 'var(--border-subtle)' }}>
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(52, 199, 89, 0.12)', color: '#32D74B' }}>
                    <Clock size={12} />
                </div>
                <div>
                    <span className="block text-[8px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Time</span>
                    <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{result.time || '1.2s'}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl border" style={{ backgroundColor: 'var(--fill-tertiary)', borderColor: 'var(--border-subtle)' }}>
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(52, 199, 89, 0.12)', color: '#32D74B' }}>
                    <Zap size={12} />
                </div>
                <div>
                    <span className="block text-[8px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Quality</span>
                    <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>Improved AI</span>
                </div>
            </div>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border" style={{ backgroundColor: 'var(--fill-secondary)', borderColor: 'var(--border-subtle)' }}>
                    <img src={result.prevImage} alt="Before" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border translate-x-1" style={{ backgroundColor: 'var(--fill-secondary)', borderColor: 'var(--border-subtle)' }}>
                    <img src={result.newImage} alt="After" className="w-full h-full object-cover" />
                </div>
            </div>
            <button className="flex items-center gap-1.5 text-[11px] font-bold transition-colors uppercase tracking-tight" style={{ color: 'var(--accent)' }}>
                View in History
                <ArrowRight size={14} />
            </button>
        </div>
    </motion.div>
  );
};

export default ResultSummaryCard;
