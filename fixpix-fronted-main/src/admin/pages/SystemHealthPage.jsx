/**
 * System Health Page — Real-time monitoring dashboard
 *
 * Shows: uptime ring, error rates, queue depth, hourly charts, alerts
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminFetchJSON, adminEndpoints } from '../lib/adminApi';
import {
    ShieldCheck, ShieldAlert, ShieldX, Activity, AlertTriangle,
    RefreshCw, Zap, Clock, CheckCircle, XCircle, Users,
    TrendingUp, Loader2
} from 'lucide-react';

const STATUS_CONFIG = {
    healthy: { icon: ShieldCheck, color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'All Systems Operational' },
    degraded: { icon: ShieldAlert, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Degraded Performance' },
    critical: { icon: ShieldX, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', label: 'Critical Issues Detected' },
};

const IOSCard = ({ children, className = '', delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className={`rounded-[var(--ios-radius-lg,24px)] p-6 ${className}`}
        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        {children}
    </motion.div>
);

const UptimeRing = ({ pct, size = 140 }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (pct / 100) * circumference;
    const color = pct >= 99 ? '#10b981' : pct >= 95 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--divider)" strokeWidth="8" />
                <motion.circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
                    transform={`rotate(-90 ${size/2} ${size/2})`} />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black" style={{ color }}>{pct}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Uptime</span>
            </div>
        </div>
    );
};

const MiniBarChart = ({ data, maxVal, height = 80, color = '#3b82f6' }) => {
    if (!data || data.length === 0) return null;
    const max = maxVal || Math.max(...data.map(d => d.count), 1);
    return (
        <div className="flex items-end gap-[3px] justify-center" style={{ height }}>
            {Array.from({ length: 24 }, (_, hour) => {
                const entry = data.find(d => d.hour === hour);
                const count = entry?.count || 0;
                const barH = Math.max(2, (count / max) * (height - 16));
                const intensity = count / max;
                return (
                    <div key={hour} className="flex flex-col items-center gap-0.5 group">
                        <span className="text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>{count}</span>
                        <div className="w-[10px] rounded-t-[3px] transition-all hover:opacity-80"
                            style={{ height: barH, backgroundColor: `rgba(${color === '#ef4444' ? '239,68,68' : '59,130,246'}, ${0.15 + intensity * 0.85})` }}
                            title={`${hour}:00 — ${count}`} />
                    </div>
                );
            })}
        </div>
    );
};

const SystemHealthPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchHealth = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true); else setLoading(true);
            const result = await adminFetchJSON(adminEndpoints.systemHealth);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message || 'Unable to fetch system health');
        }
        finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(() => fetchHealth(true), 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
            <p className="text-[13px] font-semibold mt-3" style={{ color: 'var(--text-muted)' }}>Checking system health...</p>
        </div>
    );

    const statusConfig = STATUS_CONFIG[data?.status] || STATUS_CONFIG.healthy;
    const StatusIcon = statusConfig.icon;

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.header initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3"
                        style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        <ShieldCheck className="w-6 h-6" style={{ color: statusConfig.color }} />
                        System Health
                    </h1>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Auto-refreshes every 10s · Last check: {new Date(data?.timestamp).toLocaleTimeString()}
                    </p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => fetchHealth(true)} disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold disabled:opacity-50"
                    style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                </motion.button>
            </motion.header>

            {/* Status Banner */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-[24px] p-6 flex items-center gap-6"
                style={{ backgroundColor: statusConfig.bg, border: `1px solid ${statusConfig.color}20` }}>
                <StatusIcon className="w-12 h-12" style={{ color: statusConfig.color }} />
                <div>
                    <h2 className="text-xl font-black" style={{ color: statusConfig.color }}>{statusConfig.label}</h2>
                    <p className="text-[13px] font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Error rate: {data?.error_rates?.last_1h}% (1h) · {data?.error_rates?.last_24h}% (24h)
                    </p>
                </div>
            </motion.div>

            {/* Alerts */}
            <AnimatePresence>
                {data?.alerts?.map((alert, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 px-5 py-3 rounded-[16px]"
                        style={{
                            backgroundColor: alert.level === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                            border: `1px solid ${alert.level === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
                        }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: alert.level === 'critical' ? '#ef4444' : '#f59e0b' }} />
                        <span className="text-[13px] font-semibold" style={{ color: alert.level === 'critical' ? '#ef4444' : '#f59e0b' }}>{alert.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>

            {error && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-[16px]"
                    style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-500" />
                    <span className="text-[13px] font-semibold text-red-500">{error}</span>
                </div>
            )}

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Uptime Ring */}
                <IOSCard delay={0.05} className="flex flex-col items-center">
                    <UptimeRing pct={data?.uptime_pct || 0} />
                    <p className="text-[11px] font-bold uppercase tracking-widest mt-3" style={{ color: 'var(--text-muted)' }}>24h Success Rate</p>
                </IOSCard>

                {/* Queue Status */}
                <IOSCard delay={0.1}>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Queue Status</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Pending</span></div>
                            <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{data?.queue?.pending || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /><span className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Processing</span></div>
                            <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{data?.queue?.processing || 0}</span>
                        </div>
                    </div>
                </IOSCard>

                {/* Throughput */}
                <IOSCard delay={0.15}>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Throughput</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /><span className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Last 1h</span></div>
                            <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{data?.throughput?.last_1h || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /><span className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Last 24h</span></div>
                            <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{data?.throughput?.last_24h || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /><span className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Active Admins</span></div>
                            <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{data?.active_admins || 0}</span>
                        </div>
                    </div>
                </IOSCard>
            </div>

            {/* Hourly Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <IOSCard delay={0.2}>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Hourly Processing (24h)</p>
                    <MiniBarChart data={data?.hourly_total || []} color="#3b82f6" />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[9px] font-bold" style={{ color: 'var(--section-label)' }}>00:00</span>
                        <span className="text-[9px] font-bold" style={{ color: 'var(--section-label)' }}>12:00</span>
                        <span className="text-[9px] font-bold" style={{ color: 'var(--section-label)' }}>23:00</span>
                    </div>
                </IOSCard>
                <IOSCard delay={0.25}>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Hourly Errors (24h)</p>
                    <MiniBarChart data={data?.hourly_errors || []} color="#ef4444" maxVal={Math.max(...(data?.hourly_total || []).map(d => d.count), 1)} />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[9px] font-bold" style={{ color: 'var(--section-label)' }}>00:00</span>
                        <span className="text-[9px] font-bold" style={{ color: 'var(--section-label)' }}>12:00</span>
                        <span className="text-[9px] font-bold" style={{ color: 'var(--section-label)' }}>23:00</span>
                    </div>
                </IOSCard>
            </div>
        </div>
    );
};

export default SystemHealthPage;
