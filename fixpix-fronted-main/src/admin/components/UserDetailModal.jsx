/**
 * User Detail Modal — AI-powered user profile overlay
 *
 * Shows full user profile with:
 * - AI summary
 * - Churn score ring
 * - Feature usage bars
 * - Activity timeline
 * - Quick actions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminFetchJSON, adminEndpoints } from '../lib/adminApi';
import {
    X, User as UserIcon, Crown, Brain, TrendingUp, AlertTriangle,
    Clock, Image as ImageIcon, Shield, Ban, ArrowUpRight,
    CheckCircle, Loader2, Sparkles
} from 'lucide-react';

const CHURN_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

const ChurnRing = ({ score, level, size = 90 }) => {
    const color = CHURN_COLORS[level] || '#64748b';
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--divider, rgba(0,0,0,0.06))" strokeWidth="6" />
                <motion.circle
                    cx={size/2} cy={size/2} r={radius}
                    fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black" style={{ color }}>{score}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {level}
                </span>
            </div>
        </div>
    );
};

const UserDetailModal = ({ userId, isOpen, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !userId) return;
        setLoading(true);
        setData(null);
        adminFetchJSON(adminEndpoints.userDetail(userId))
            .then(d => { setData(d); setError(null); })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [userId, isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9990]"
                        style={{ backgroundColor: 'var(--popup-backdrop, rgba(0,0,0,0.4))', backdropFilter: 'blur(8px)' }}
                    />

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                        className="fixed right-0 top-0 h-full w-full max-w-lg z-[9991] overflow-y-auto scrollbar-hide"
                        style={{
                            backgroundColor: 'var(--panel-bg, #f5f5f7)',
                            borderLeft: '1px solid var(--panel-border)',
                            boxShadow: 'var(--popup-shadow)',
                        }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between backdrop-blur-xl"
                            style={{ backgroundColor: 'var(--panel-bg)', borderBottom: '1px solid var(--divider)' }}>
                            <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>User Detail</h2>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                                className="p-2 rounded-[10px] transition-colors"
                                style={{ color: 'var(--text-muted)' }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <div className="p-6 space-y-6">
                            {loading ? (
                                <div className="flex flex-col items-center py-16">
                                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
                                    <p className="text-[13px] font-semibold mt-3" style={{ color: 'var(--text-muted)' }}>Loading user profile...</p>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-500/10 rounded-[16px] text-red-500 text-[13px] font-bold text-center">{error}</div>
                            ) : data && (
                                <>
                                    {/* Profile Card */}
                                    <div className="rounded-[20px] p-6 text-center"
                                        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                                        <div className="w-16 h-16 rounded-[22px] mx-auto flex items-center justify-center text-2xl font-black text-white"
                                            style={{ background: 'var(--accent)', boxShadow: '0 8px 24px var(--accent-soft)' }}>
                                            {data.user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="text-lg font-bold mt-3" style={{ color: 'var(--text-primary)' }}>{data.user.username}</h3>
                                        <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>{data.user.email}</p>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold capitalize"
                                                style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                                                {data.user.plan}
                                            </span>
                                            {data.user.is_staff && (
                                                <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold"
                                                    style={{ backgroundColor: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
                                                    <Shield className="w-3 h-3 inline mr-1" />Admin
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Summary */}
                                    <div className="rounded-[20px] p-5"
                                        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.06))', border: '1px solid rgba(139,92,246,0.12)' }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-purple-500" />
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-500">AI Summary</span>
                                        </div>
                                        <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                            {data.ai_summary}
                                        </p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Total Images', value: data.stats.total_images, icon: ImageIcon, color: '#3b82f6' },
                                            { label: 'Last 30 Days', value: data.stats.images_30d, icon: TrendingUp, color: '#10b981' },
                                            { label: 'Days Since Login', value: data.stats.days_since_login === 999 ? 'Never' : data.stats.days_since_login, icon: Clock, color: '#f59e0b' },
                                            { label: 'Member For', value: `${data.stats.days_since_signup}d`, icon: UserIcon, color: '#6366f1' },
                                        ].map((stat, i) => (
                                            <div key={i} className="rounded-[16px] p-4"
                                                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                                                <stat.icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
                                                <p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Churn Risk */}
                                    <div className="rounded-[20px] p-6 flex items-center gap-6"
                                        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                                        <ChurnRing score={data.churn.score} level={data.churn.level} />
                                        <div>
                                            <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Churn Risk</p>
                                            <p className="text-lg font-black capitalize mt-0.5"
                                                style={{ color: CHURN_COLORS[data.churn.level] }}>
                                                {data.churn.level} Risk
                                            </p>
                                            <p className="text-[11px] font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Score: {data.churn.score}/100</p>
                                        </div>
                                    </div>

                                    {/* Feature Usage */}
                                    {data.feature_usage?.length > 0 && (
                                        <div className="rounded-[20px] p-6"
                                            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Feature Usage</p>
                                            <div className="space-y-3">
                                                {data.feature_usage.map((f, i) => {
                                                    const max = data.feature_usage[0].count;
                                                    return (
                                                        <div key={i}>
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-[12px] font-semibold capitalize" style={{ color: 'var(--text-secondary)' }}>{f.processing_type}</span>
                                                                <span className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--text-muted)' }}>{f.count}</span>
                                                            </div>
                                                            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--fill-tertiary)' }}>
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${(f.count / max) * 100}%` }}
                                                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                                                    className="h-full rounded-full"
                                                                    style={{ background: 'linear-gradient(90deg, var(--accent), #8b5cf6)' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Upgrade Recommendation */}
                                    {data.upgrade?.recommended && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                            className="rounded-[20px] p-5"
                                            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(239,68,68,0.04))', border: '1px solid rgba(245,158,11,0.15)' }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Crown className="w-4 h-4 text-amber-500" />
                                                <span className="text-[11px] font-bold uppercase text-amber-500">Upgrade Recommended</span>
                                            </div>
                                            <p className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{data.upgrade.reason}</p>
                                        </motion.div>
                                    )}

                                    {/* Recent Timeline */}
                                    {data.timeline?.length > 0 && (
                                        <div className="rounded-[20px] p-6"
                                            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                                                Recent Activity ({data.timeline.length})
                                            </p>
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                                                {data.timeline.slice(0, 15).map((entry, i) => (
                                                    <div key={entry.id} className="flex items-center gap-3 py-1.5">
                                                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: entry.status === 'completed' ? '#10b981' : entry.status === 'failed' ? '#ef4444' : '#f59e0b' }} />
                                                        <span className="text-[12px] font-semibold capitalize flex-1" style={{ color: 'var(--text-secondary)' }}>{entry.type}</span>
                                                        <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                                                            {new Date(entry.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserDetailModal;
