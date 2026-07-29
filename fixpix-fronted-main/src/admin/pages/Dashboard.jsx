/**
 * AI-Powered Analytics Command Center
 * Premium SaaS Dashboard with real-time telemetry and intelligent insights.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminFetchJSON, adminEndpoints } from '../lib/adminApi';
import UserDetailModal from '../components/UserDetailModal';
import SmartMetricCard from '../components/SmartMetricCard';
import AIInsightsPanel from '../components/AIInsightsPanel';
import AdvancedPlatformCharts from '../components/AdvancedPlatformCharts';

import {
    Users, Image as ImageIcon, Activity, Zap,
    RefreshCw, Sparkles, PieChart, Clock, ShieldCheck,
    ArrowRight, ChevronRight, TrendingUp
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // User Detail Modal State
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userModalOpen, setUserModalOpen] = useState(false);

    const openUserDetail = (userId) => {
        if (!userId) return;
        setSelectedUserId(userId);
        setUserModalOpen(true);
    };

    const fetchData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            const stats = await adminFetchJSON(adminEndpoints.dashboard);
            setData(stats);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // 10-second high-frequency polling for real-time feel
        const interval = setInterval(() => fetchData(true), 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading && !data) {
        return (
            <div className="space-y-8 animate-pulse p-4">
                <div className="h-12 w-64 bg-white/5 rounded-2xl mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-[24px]" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-[400px] bg-white/5 rounded-[32px]" />
                    <div className="h-[400px] bg-white/5 rounded-[32px]" />
                </div>
            </div>
        );
    }

    const { overview, insights, charts, system, activity_feed: activityFeed = [] } = data || {};
    const summaryInsight = (insights || [])[0];

    return (
        <div className="space-y-10 pb-20">
            {/* ─── HEADER ─── */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-black uppercase tracking-widest">
                            Live System Tracking
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">
                            <Clock size={12} /> Last update: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-4">
                        Platform Overview
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mt-2" />
                    </h1>
                </motion.div>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="group relative flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-black transition-all bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover-bg)]"
                    >
                        <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                        {refreshing ? 'Syncing...' : 'Force Refresh'}
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/admin-fixpix-secure-portal-9x7/system')}
                        className="flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-black transition-all bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        System Health
                    </motion.button>
                </div>
            </header>

            {/* ─── SMART METRIC CARDS ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <SmartMetricCard 
                    title="Total Users" 
                    value={overview?.total_users?.value} 
                    pct={overview?.total_users?.pct}
                    change={overview?.total_users?.change}
                    icon={Users}
                    color="blue"
                    sparkline={overview?.total_users?.sparkline}
                />
                <SmartMetricCard 
                    title="Images Processed" 
                    value={overview?.images_processed?.value} 
                    subtitle={`${overview?.images_processed?.success_rate}% Success Rate`}
                    change={overview?.images_processed?.change_24h}
                    pct={Math.round((overview?.images_processed?.change_24h / (overview?.images_processed?.value || 1)) * 1000) / 10}
                    icon={ImageIcon}
                    color="emerald"
                    sparkline={charts?.processing_trend?.map(d => ({ value: d.success }))}
                />
                <SmartMetricCard 
                    title="Active (7D)" 
                    value={overview?.active_users?.value} 
                    subtitle={`${overview?.active_users?.today} peak users today`}
                    change={overview?.active_users?.today}
                    pct={Math.round((overview?.active_users?.today / (overview?.active_users?.value || 1)) * 100)}
                    icon={Activity}
                    color="amber"
                />
                <SmartMetricCard 
                    title="API Performance" 
                    value={overview?.api_usage?.last_24h} 
                    subtitle={`Avg Latency: ${overview?.api_usage?.avg_latency}s`}
                    change={0}
                    pct={0}
                    icon={Zap}
                    color="purple"
                />
            </div>

            {/* ─── MAIN ANALYTICS GRID ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <AdvancedPlatformCharts trends={charts?.processing_trend} features={charts?.feature_usage} />
                </div>
                
                <div className="h-full">
                    <AIInsightsPanel insights={insights || []} isLoading={refreshing && !data} />
                </div>
            </div>

            {/* ─── BOTTOM INTELLIGENCE SECTION ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Plan Distribution with Growth */}
                <div className="p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] glass-card backdrop-blur-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/20">
                            <PieChart size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight">Revenue Mix</h3>
                            <p className="text-[12px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mt-0.5">Plan distribution & growth</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {charts?.plans?.map((plan, idx) => (
                            <div key={idx} className="group relative p-4 rounded-2xl bg-[var(--fill-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--accent-soft)] transition-all">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[14px] font-black text-[var(--text-primary)]">{plan.name}</span>
                                    <div className="flex items-center gap-2">
                                        {plan.growth > 0 && (
                                            <span className="text-[11px] font-bold text-emerald-400">↑ +{plan.growth}%</span>
                                        )}
                                        <span className="text-[14px] font-black text-[var(--text-secondary)]">{plan.pct}%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-[var(--fill-tertiary)] rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${plan.pct}%` }}
                                        transition={{ delay: 0.5 + (idx * 0.1), duration: 1 }}
                                        className={`h-full rounded-full ${plan.name.toLowerCase().includes('pro') ? 'bg-blue-500' : plan.name.toLowerCase().includes('elite') ? 'bg-rose-500' : 'bg-[var(--text-muted)]'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Intelligent Activity Feed */}
                <div className="lg:col-span-2 p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] glass-card backdrop-blur-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                                <Activity size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight">Smart Activity Feed</h3>
                                <p className="text-[12px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mt-0.5">Critical system events</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/admin-fixpix-secure-portal-9x7/activity')} className="text-[11px] font-black text-[var(--text-tertiary)] hover:text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-1 transition-colors">
                            View Archive <ChevronRight size={14} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                            <h4 className="flex items-center gap-2 text-[13px] font-black text-purple-600 dark:text-purple-300 uppercase tracking-widest mb-3">
                                <Sparkles size={14} fill="currentColor" /> AI Intelligence Summary
                            </h4>
                            <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed">
                                {summaryInsight?.message || 'No urgent insights at the moment. Platform activity is within expected range.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {activityFeed.slice(0, 4).map((event) => {
                                const isHigh = event.severity === 'high';
                                return (
                                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--fill-tertiary)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border-subtle)] group">
                                        <div className={`p-2 rounded-lg ${isHigh ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                            {isHigh ? <ArrowRight size={16} /> : <ShieldCheck size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-bold text-[var(--text-primary)] truncate">{event.message}</p>
                                            <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">{event.admin} · {new Date(event.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                        <ArrowRight size={14} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-all opacity-0 group-hover:opacity-100" />
                                    </div>
                                );
                            })}
                            {activityFeed.length === 0 && (
                                <div className="p-4 rounded-xl border border-[var(--border-subtle)] text-[13px] font-semibold"
                                    style={{ color: 'var(--text-muted)' }}>
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            <UserDetailModal
                userId={selectedUserId}
                isOpen={userModalOpen}
                onClose={() => { setUserModalOpen(false); setSelectedUserId(null); }}
            />
        </div>
    );
};

export default Dashboard;

