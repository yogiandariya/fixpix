/**
 * Admin Analytics Page — iOS Style with var() tokens
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminFetchJSON, adminEndpoints } from '../lib/adminApi';
import { BarChart3, TrendingUp, Users, Crown, Clock, RefreshCw, AlertCircle } from 'lucide-react';

const IOSCard = ({ children, className = '', delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className={`rounded-[var(--ios-radius-lg,24px)] p-6 ${className}`}
        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        {children}
    </motion.div>
);

const LineChart = ({ data, width = 600, height = 250, color = '#3b82f6' }) => {
    if (!data || data.length < 2) return <p className="text-sm font-medium text-center py-8" style={{ color: 'var(--text-muted)' }}>Not enough data</p>;
    const max = Math.max(...data.map(d => d.count), 1);
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const cw = width - pad.left - pad.right, ch = height - pad.top - pad.bottom;
    const points = data.map((d, i) => ({ x: pad.left + (i / (data.length - 1)) * cw, y: pad.top + ch - (d.count / max) * ch, ...d }));
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const area = line + ` L ${points[points.length - 1].x} ${pad.top + ch} L ${points[0].x} ${pad.top + ch} Z`;

    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                <g key={i}>
                    <line x1={pad.left} y1={pad.top + ch * (1-pct)} x2={pad.left + cw} y2={pad.top + ch * (1-pct)} stroke="var(--divider)" strokeWidth="1" />
                    <text x={pad.left - 10} y={pad.top + ch * (1-pct) + 4} textAnchor="end" fill="var(--text-muted)" fontSize="10" fontWeight="600">{Math.round(max * pct)}</text>
                </g>
            ))}
            <defs><linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
            <path d={area} fill={`url(#grad-${color.replace('#','')})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (<g key={i} className="group"><circle cx={p.x} cy={p.y} r="12" fill="transparent" className="cursor-pointer" /><circle cx={p.x} cy={p.y} r="3.5" fill={color} className="opacity-0 group-hover:opacity-100 transition-opacity" /><g className="opacity-0 group-hover:opacity-100 transition-opacity"><rect x={p.x-30} y={p.y-30} width="60" height="22" rx="8" fill="var(--popup-bg, #1e293b)" /><text x={p.x} y={p.y-16} textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontWeight="700">{p.count}</text></g></g>))}
            {points.filter((_, i) => i % Math.max(1, Math.floor(data.length / 8)) === 0 || i === points.length - 1).map((p, i) => (
                <text key={i} x={p.x} y={height - 8} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600">{p.date?.slice(5)}</text>
            ))}
        </svg>
    );
};

const HBarChart = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-sm font-medium text-center py-4" style={{ color: 'var(--text-muted)' }}>No data</p>;
    const max = Math.max(...data.map(d => d.image_count || d.count || 0), 1);
    return (
        <div className="space-y-3">
            {data.map((item, i) => {
                const value = item.image_count || item.count || 0;
                const pct = Math.max(2, (value / max) * 100);
                const label = item.user__username || item.processing_type || item.plan || `Item ${i}`;
                return (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold capitalize truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                            <span className="text-[11px] font-bold tabular-nums" style={{ color: 'var(--text-muted)' }}>{value}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fill-tertiary, rgba(0,0,0,0.04))' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                                className="h-full rounded-full" style={{ background: `linear-gradient(90deg, var(--accent, #3b82f6), #6366f1)` }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [days, setDays] = useState(30);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAnalytics = async (isRefresh = false) => {
        try { if (isRefresh) setRefreshing(true); else setLoading(true); const result = await adminFetchJSON(`${adminEndpoints.analytics}?days=${days}`); setData(result); setError(null); }
        catch (err) { setError(err.message); }
        finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { fetchAnalytics(); }, [days]);

    if (loading) return (
        <div className="space-y-6">{[1, 2, 3].map(i => <div key={i} className="h-[300px] rounded-[24px] animate-pulse" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }} />)}</div>
    );

    if (error) return (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[24px] flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-bold">{error}</span></div>
    );

    return (
        <div className="space-y-8">
            <motion.header initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        <BarChart3 className="w-6 h-6" style={{ color: 'var(--accent)' }} /> Analytics
                    </h1>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>Platform insights and trends</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={days} onChange={(e) => setDays(Number(e.target.value))}
                        className="px-3 py-2 rounded-[12px] text-[13px] font-semibold outline-none"
                        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                        <option value={7}>Last 7 days</option><option value={14}>Last 14 days</option>
                        <option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
                    </select>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchAnalytics(true)} disabled={refreshing}
                        className="p-2.5 rounded-[12px] disabled:opacity-50"
                        style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </motion.button>
                </div>
            </motion.header>

            <IOSCard delay={0.05}>
                <h3 className="text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> User Growth
                </h3>
                <LineChart data={data?.daily_signups || []} color="#10b981" />
            </IOSCard>

            <IOSCard delay={0.1}>
                <h3 className="text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Image Processing Volume
                </h3>
                <LineChart data={data?.daily_images || []} color="var(--accent, #3b82f6)" />
            </IOSCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <IOSCard delay={0.15}>
                    <h3 className="text-[12px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Feature Popularity</h3>
                    <HBarChart data={data?.feature_usage || []} />
                </IOSCard>
                <IOSCard delay={0.2}>
                    <h3 className="text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <Users className="w-4 h-4 text-purple-500" /> Top Users
                    </h3>
                    <HBarChart data={data?.top_users || []} />
                </IOSCard>
            </div>

            <IOSCard delay={0.25}>
                <h3 className="text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <Crown className="w-4 h-4 text-amber-500" /> Plan Distribution
                </h3>
                <HBarChart data={data?.plan_distribution || []} />
            </IOSCard>

            {data?.hourly_activity?.length > 0 && (
                <IOSCard delay={0.3}>
                    <h3 className="text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-4 h-4 text-cyan-500" /> Hourly Activity (7 Days)
                    </h3>
                    <div className="flex items-end gap-1 justify-center h-[120px]">
                        {Array.from({ length: 24 }, (_, hour) => {
                            const entry = data.hourly_activity.find(h => h.hour === hour);
                            const count = entry?.count || 0;
                            const max = Math.max(...data.hourly_activity.map(h => h.count), 1);
                            const barH = Math.max(4, (count / max) * 100);
                            const intensity = count / max;
                            return (
                                <div key={hour} className="flex flex-col items-center gap-1 group">
                                    <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100" style={{ color: 'var(--text-muted)' }}>{count}</span>
                                    <div className="w-4 rounded-t-[4px] transition-all hover:opacity-80"
                                        style={{ height: barH, backgroundColor: `rgba(59, 130, 246, ${0.2 + intensity * 0.8})` }}
                                        title={`${hour}:00 — ${count} actions`} />
                                    <span className="text-[8px] font-bold" style={{ color: 'var(--section-label)' }}>{hour}</span>
                                </div>
                            );
                        })}
                    </div>
                </IOSCard>
            )}
        </div>
    );
};

export default AnalyticsPage;
