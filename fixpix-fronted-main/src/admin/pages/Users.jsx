/**
 * Admin Users Page — iOS Style with var() theme tokens
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { adminFetchJSON, adminFetch, adminEndpoints } from '../lib/adminApi';
import DataTable from '../components/DataTable';
import UserDetailModal from '../components/UserDetailModal';
import { Shield, Ban, CheckCircle, UserX, Crown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const PLAN_STYLES = {
    free: { bg: 'rgba(100,116,139,0.1)', text: '#64748b', label: 'Free' },
    pro: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', label: 'Pro' },
    elite: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: 'Elite' },
    pro_yearly: { bg: 'rgba(6,182,212,0.1)', text: '#06b6d4', label: 'Pro (Y)' },
    elite_yearly: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: 'Elite (Y)' },
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, page_size: 25, total_pages: 1 });
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userModalOpen, setUserModalOpen] = useState(false);

    const fetchUsers = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({ page, page_size: 25 });
            if (searchQuery) params.append('search', searchQuery);
            const data = await adminFetchJSON(`${adminEndpoints.users}?${params}`);
            setUsers(data.users || []);
            setPagination(data.pagination || { total: 0, page: 1, page_size: 25, total_pages: 1 });
        } catch (error) {
            console.error('Failed to load users:', error);
            setError('Unable to load users right now. Please refresh and try again.');
        }
        finally { setLoading(false); }
    }, [searchQuery]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [searchQuery]);

    useEffect(() => {
        const debounce = setTimeout(() => fetchUsers(1), 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, fetchUsers]);

    const handleAction = async (userId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
        setActionLoading(userId);
        try {
            const response = await adminFetch(adminEndpoints.userAction(userId), { method: 'POST', body: JSON.stringify({ action }) });
            if (response.ok) fetchUsers(pagination.page);
            else { const d = await response.json().catch(() => ({})); alert(d.error || 'Action failed'); }
        } catch { alert('Connection error'); }
        finally { setActionLoading(null); }
    };

    const columns = [
        {
            header: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[12px] flex items-center justify-center text-xs font-black text-white"
                        style={{ background: 'var(--accent, #2563eb)', boxShadow: '0 2px 8px var(--accent-soft, rgba(37,99,235,0.2))' }}
                    >
                        {(user.username?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <div>
                        <button onClick={() => { setSelectedUserId(user.id); setUserModalOpen(true); }}
                            className="font-semibold text-[13px] hover:underline cursor-pointer" style={{ color: 'var(--accent, #2563eb)' }}>{user.username}</button>
                        <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Plan',
            render: (user) => {
                const s = PLAN_STYLES[user.plan] || PLAN_STYLES.free;
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-bold"
                        style={{ backgroundColor: s.bg, color: s.text }}
                    >
                        {user.plan !== 'free' && <Crown className="w-3 h-3" />}
                        {s.label}
                    </span>
                );
            }
        },
        {
            header: 'Role',
            render: (user) => user.is_staff ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[11px] font-bold" style={{ backgroundColor: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
                    <Shield className="w-3 h-3" /> Admin
                </span>
            ) : (
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>User</span>
            )
        },
        {
            header: 'Status',
            render: (user) => user.is_active ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                    <UserX className="w-3 h-3" /> Banned
                </span>
            )
        },
        { header: 'Images', render: (user) => <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{user.image_count}</span> },
        { header: 'Last Active', render: (user) => <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</span> },
        { header: 'Joined', render: (user) => <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{new Date(user.date_joined).toLocaleDateString()}</span> },
        {
            header: 'Actions',
            render: (user) => (
                <div className="flex gap-1">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setSelectedUserId(user.id); setUserModalOpen(true); }}
                        className="p-1.5 rounded-[8px] transition-all hover:bg-blue-500/10" title="View Detail"
                        style={{ color: 'var(--accent, #2563eb)' }}>
                        <Eye className="w-4 h-4" />
                    </motion.button>
                    {!user.is_staff && (
                        user.is_active ? (
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleAction(user.id, 'ban')} disabled={actionLoading === user.id}
                                className="p-1.5 rounded-[8px] transition-all disabled:opacity-50 text-red-500 hover:bg-red-500/10" title="Ban">
                                <Ban className="w-4 h-4" />
                            </motion.button>
                        ) : (
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleAction(user.id, 'unban')} disabled={actionLoading === user.id}
                                className="p-1.5 rounded-[8px] transition-all disabled:opacity-50 text-emerald-500 hover:bg-emerald-500/10" title="Unban">
                                <CheckCircle className="w-4 h-4" />
                            </motion.button>
                        )
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <motion.header initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>User Management</h1>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{pagination.total} total users</p>
                </div>
            </motion.header>

            <DataTable data={users} columns={columns} onSearch={setSearchQuery} searchPlaceholder="Search by username or email..." loading={loading} />

            {error && (
                <div className="px-4 py-3 rounded-[12px] text-[12px] font-semibold"
                    style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                    {error}
                </div>
            )}

            {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>Page {pagination.page} of {pagination.total_pages}</span>
                    <div className="flex gap-1">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchUsers(pagination.page - 1)} disabled={pagination.page <= 1}
                            className="p-2 rounded-[10px] transition-all disabled:opacity-30"
                            style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                            <ChevronLeft className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchUsers(pagination.page + 1)} disabled={pagination.page >= pagination.total_pages}
                            className="p-2 rounded-[10px] transition-all disabled:opacity-30"
                            style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            <UserDetailModal
                userId={selectedUserId}
                isOpen={userModalOpen}
                onClose={() => { setUserModalOpen(false); setSelectedUserId(null); }}
            />
        </div>
    );
};

export default UsersPage;
