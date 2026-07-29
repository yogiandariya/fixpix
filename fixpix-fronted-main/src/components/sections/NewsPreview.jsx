import React, { useEffect, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFactCheck } from '../../app/ai-news/hooks/useFactCheck';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsPreview = () => {
    const { news, fetchLiveNews, loading } = useFactCheck();

    useEffect(() => {
        fetchLiveNews(3);
    }, []);

    // Memoize displayNews to avoid slicing on every re-render
    const displayNews = useMemo(() => news.slice(0, 3), [news]);

    return (
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4" 
                            style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}>
                            <Newspaper size={12} />
                            Real-time Intelligence
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[var(--text-primary)] leading-tight mb-2">
                            AI News Intelligence
                        </h2>
                        <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium tracking-tight">
                            Automated fact-checking and bias analysis of trending global news.
                        </p>
                    </div>
                    <div>
                        <Link to="/ai-news" 
                            className="group flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold transition-all duration-300 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--surface-secondary)] hover:shadow-sm"
                            style={{ letterSpacing: '-0.01em' }}
                        >
                            View All News
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading || displayNews.length === 0 ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse rounded-[20px] h-[360px]" style={{ backgroundColor: 'var(--surface-secondary)' }} />
                        ))
                    ) : (
                        displayNews.map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full gpu-accelerated bg-[var(--surface)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] hover:shadow-[var(--depth-2)]"
                                style={{ 
                                    willChange: 'transform, box-shadow' 
                                }}
                                whileHover={{ y: -4, scale: 1.01 }}
                            >
                                <div className="p-7 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-[4px]" style={{ backgroundColor: 'var(--fill-secondary)', color: 'var(--text-secondary)' }}>
                                            {item.source || 'INTEL'}
                                        </span>
                                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border-strong)' }} />
                                        <div style={{
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            backgroundColor: item.factCheck === 'REAL' ? 'rgba(52, 199, 89, 0.12)' : item.factCheck === 'FAKE' ? 'rgba(255, 59, 48, 0.12)' : 'rgba(255, 149, 0, 0.12)',
                                            color: item.factCheck === 'REAL' ? '#32D74B' : item.factCheck === 'FAKE' ? '#FF453A' : '#FF9F0A',
                                            border: '1px solid currentColor',
                                            opacity: 0.9,
                                            letterSpacing: '0.02em'
                                        }}>
                                            {item.factCheck || 'ANALYZING'}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight leading-tight mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-medium tracking-tight line-clamp-3">
                                        {item.description || "Live intelligence scan complete. Analyze data for detailed reasoning and confidence scores."}
                                    </p>
                                    <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                        <Link
                                            to="/ai-news"
                                            className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 group/btn transition-colors"
                                            style={{ color: 'var(--accent)' }}
                                        >
                                            Analyze Claim
                                            <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(NewsPreview);
