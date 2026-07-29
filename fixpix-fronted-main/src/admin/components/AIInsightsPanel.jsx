/**
 * AIInsightsPanel — Intelligent Analytics Feed
 * Dynamically displays trend analysis, anomalies, and performance metrics
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, TrendingUp, AlertCircle, Zap, Info, ArrowRight,
    Search, BarChart3, Clock, Cpu
} from 'lucide-react';

const InsightIcon = ({ type }) => {
    switch (type) {
        case 'growth': return <TrendingUp className="text-emerald-400" size={18} />;
        case 'warning': return <AlertCircle className="text-rose-400" size={18} />;
        case 'performance': return <Cpu className="text-amber-400" size={18} />;
        case 'trend': return <Zap className="text-blue-400" size={18} />;
        default: return <Info className="text-white/40" size={18} />;
    }
};

const PriorityBadge = ({ priority }) => {
    const styles = {
        high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return (
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${styles[priority] || styles.low}`}>
            {priority}
        </span>
    );
};

const AIInsightsPanel = ({ insights = [], isLoading = false }) => {
    return (
        <div className="flex flex-col h-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[28px] overflow-hidden glass-card backdrop-blur-2xl">
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                        <Sparkles size={20} fill="currentColor" strokeWidth={0} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[var(--text-primary)] leading-tight">AI Insights</h3>
                        <p className="text-[11px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase">Intelligent Trend Analysis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-tighter">Live Analysis</span>
                </div>
            </div>

            {/* Insight Feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />
                        ))
                    ) : (
                        insights.map((insight, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="group p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[var(--fill-tertiary)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-soft)] transition-all">
                                            <InsightIcon type={insight.type} />
                                        </div>
                                        <h4 className="text-[15px] font-black text-[var(--text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">{insight.title}</h4>
                                    </div>
                                    <PriorityBadge priority={insight.priority} />
                                </div>
                                <p className="text-[13px] font-medium text-[var(--text-secondary)] leading-relaxed mb-4">
                                    {insight.message}
                                </p>
                                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] group-hover:border-[var(--glass-border)] transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-[var(--text-tertiary)]" />
                                        <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase">Analyzing Now</span>
                                    </div>
                                    <motion.button 
                                        whileHover={{ x: 3 }}
                                        className="text-[11px] font-black text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] uppercase flex items-center gap-1 mt-1"
                                    >
                                        Inspect Details <ArrowRight size={12} strokeWidth={3} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Summary */}
            <div className="p-6 bg-[var(--fill-tertiary)] border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-3 text-[13px] text-[var(--text-tertiary)] font-bold">
                    <Search size={14} />
                    <span>System is following standard baselines.</span>
                </div>
            </div>
        </div>
    );
};

export default AIInsightsPanel;
