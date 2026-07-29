/**
 * AI Insights Panel — Intelligent recommendations page
 *
 * Displays AI-generated insights with severity, actions, and real-time refresh.
 * Types: Growth 📈, Risk ⚠️, Opportunity 💡, Warning 🔥
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminFetchJSON, adminEndpoints } from '../lib/adminApi';
import {
    Sparkles, RefreshCw, AlertCircle, TrendingUp, Lightbulb,
    AlertTriangle, ArrowRight, Clock, Brain, Shield, Loader2
} from 'lucide-react';

const ADMIN_BASE = '/admin-fixpix-secure-portal-9x7';

const TYPE_CONFIG = {
    growth: { icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Growth' },
    risk: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', label: 'Risk' },
    opportunity: { icon: Lightbulb, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Opportunity' },
    warning: { icon: AlertCircle, color: '#f97316', bg: 'rgba(249,115,22,0.08)', label: 'Warning' },
};

const SEVERITY_RING = {
    high: 'ring-2 ring-red-500/30',
    medium: 'ring-1 ring-amber-500/20',
    low: '',
};

const InsightCard = ({ insight, index, onAction }) => {
    const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.growth;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            whileHover={{ y: -2, boxShadow: 'var(--card-hover-shadow)' }}
            className={`rounded-[var(--ios-radius-lg,24px)] p-6 cursor-default transition-all ${SEVERITY_RING[insight.severity] || ''}`}
            style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--card-shadow)',
            }}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: config.bg, color: config.color }}>
                            {config.label}
                        </span>
                        {insight.severity === 'high' && (
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                                High Priority
                            </span>
                        )}
                    </div>
                    <h3 className="text-[15px] font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                        {insight.icon} {insight.title}
                    </h3>
                    <p className="text-[13px] font-medium mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {insight.description}
                    </p>

                    {/* Action Button */}
                    {insight.action && (
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onAction(insight.action.path)}
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-[12px] font-bold transition-all"
                            style={{
                                backgroundColor: config.bg,
                                color: config.color,
                                border: `1px solid ${config.color}30`,
                            }}
                        >
                            {insight.action.label}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                    )}
                </div>

                {/* Time */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                        {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const AIInsightsPanel = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchInsights = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true); else setLoading(true);
            const result = await adminFetchJSON(adminEndpoints.insights);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInsights();
        const interval = setInterval(() => fetchInsights(true), 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = (path) => {
        navigate(`${ADMIN_BASE}${path}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', boxShadow: '0 12px 30px rgba(99,102,241,0.3)' }}>
                    <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>Analyzing platform data...</p>
                <p className="text-[12px] font-medium mt-1" style={{ color: 'var(--text-muted)' }}>AI is processing your metrics</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.header initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3"
                        style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        <Sparkles className="w-6 h-6" style={{ color: '#8b5cf6' }} />
                        AI Insights
                    </h1>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {data?.summary?.total || 0} insights generated · Auto-refreshes every 30s
                    </p>
                </div>
                <div className="flex gap-3">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => fetchInsights(true)} disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold disabled:opacity-50"
                        style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                    </motion.button>
                </div>
            </motion.header>

            {/* Summary Strip */}
            {data?.summary && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-3">
                    {[
                        { label: 'Risks', count: data.summary.risks, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
                        { label: 'Warnings', count: data.summary.warnings, color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
                        { label: 'Growth', count: data.summary.growth, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                        { label: 'Opportunities', count: data.summary.opportunities, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
                    ].filter(s => s.count > 0).map(s => (
                        <span key={s.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
                            style={{ backgroundColor: s.bg, color: s.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                            {s.count} {s.label}
                        </span>
                    ))}
                </motion.div>
            )}

            {/* Insight Cards */}
            {error ? (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[24px] flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-500 font-bold">{error}</span>
                </div>
            ) : data?.insights?.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="rounded-[24px] p-12 text-center"
                    style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
                        <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-[17px] font-bold" style={{ color: 'var(--text-primary)' }}>All Clear</h3>
                    <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
                        No anomalies or actionable insights detected right now.
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {data.insights.map((insight, i) => (
                        <InsightCard key={insight.id} insight={insight} index={i} onAction={handleAction} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AIInsightsPanel;
