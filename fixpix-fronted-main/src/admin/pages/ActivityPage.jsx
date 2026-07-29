/**
 * Admin Activity Logs — iOS Style with var() tokens
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { adminFetchJSON, adminEndpoints } from '../lib/adminApi';
import { ScrollText, Shield, LogIn, Eye, Ban, UserCheck, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const ACTION_ICONS = {
    login: { icon: LogIn, color: '#10b981' },
    login_failed: { icon: Shield, color: '#ef4444' },
    view_dashboard: { icon: Eye, color: '#3b82f6' },
    view_users: { icon: Eye, color: '#3b82f6' },
    view_analytics: { icon: Eye, color: '#6366f1' },
    ban_user: { icon: Ban, color: '#ef4444' },
    unban_user: { icon: UserCheck, color: '#10b981' },
    promote_user: { icon: Shield, color: '#a855f7' },
    view_activity: { icon: ScrollText, color: '#64748b' },
};

const FILTER_OPTIONS = [
    { value: '', label: 'All Actions' }, { value: 'login', label: 'Logins' },
    { value: 'login_failed', label: 'Failed Logins' }, { value: 'ban_user', label: 'User Bans' },
    { value: 'unban_user', label: 'User Unbans' }, { value: 'view_dashboard', label: 'Dashboard Views' },
    { value: 'view_analytics', label: 'Analytics Views' },
];

const ActivityPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, page_size: 50, total_pages: 1 });

    const fetchLogs = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, page_size: 50 });
            if (filter) params.append('action', filter);
            const data = await adminFetchJSON(`${adminEndpoints.activity}?${params}`);
            setLogs(data.logs || []);
            setPagination(data.pagination || { total: 0, page: 1, page_size: 50, total_pages: 1 });
        } catch (error) { console.error('Failed to load activity:', error); }
        finally { setLoading(false); }
    }, [filter]);

    useEffect(() => { fetchLogs(1); }, [fetchLogs]);

    const getStyle = (action) => ACTION_ICONS[action] || { icon: Eye, color: '#64748b' };

    return (
        <div className="space-y-6">
            <motion.header initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Activity Logs</h1>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{pagination.total} total logs · Audit trail</p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 rounded-[12px] text-[13px] font-semibold outline-none"
                        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                        {FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            </motion.header>

            {/* Activity List */}
            <div className="rounded-[var(--ios-radius-lg,24px)] overflow-hidden"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                {loading ? (
                    <div className="p-8 text-center text-[13px] font-semibold" style={{ color: 'var(--text-muted)' }}>Loading activity logs...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-[13px] font-semibold" style={{ color: 'var(--text-muted)' }}>No activity logs found</div>
                ) : (
                    <div>
                        {logs.map((log, idx) => {
                            const s = getStyle(log.action);
                            const Icon = s.icon;
                            return (
                                <motion.div key={log.id}
                                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[var(--fill-tertiary)]"
                                    style={{ borderBottom: '1px solid var(--divider, rgba(0,0,0,0.04))' }}>
                                    <div className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                                            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{log.admin}</span>
                                            {' '}<span>{log.action_display}</span>
                                            {log.target_user && <span style={{ color: 'var(--text-muted)' }}> → {log.target_user}</span>}
                                        </p>
                                        {log.ip_address && <p className="text-[10px] font-mono font-bold mt-0.5" style={{ color: 'var(--text-muted)' }}>IP: {log.ip_address}</p>}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleDateString()}</p>
                                        <p className="text-[10px] font-bold" style={{ color: 'var(--section-label, #aaa)' }}>{new Date(log.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>Page {pagination.page} of {pagination.total_pages}</span>
                    <div className="flex gap-1">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchLogs(pagination.page - 1)} disabled={pagination.page <= 1}
                            className="p-2 rounded-[10px] disabled:opacity-30" style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                            <ChevronLeft className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchLogs(pagination.page + 1)} disabled={pagination.page >= pagination.total_pages}
                            className="p-2 rounded-[10px] disabled:opacity-30" style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityPage;
