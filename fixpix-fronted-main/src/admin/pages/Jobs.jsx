/**
 * Admin Jobs Monitor — iOS Style with var() tokens
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminFetchJSON, adminEndpoints } from '../lib/adminApi';
import DataTable from '../components/DataTable';
import { Clock, CheckCircle, XCircle, Loader, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState({ total: 0, page: 1, page_size: 25, total_pages: 1 });

    const fetchJobs = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, page_size: 25 });
            if (filter !== 'all') params.append('status', filter);
            const data = await adminFetchJSON(`${adminEndpoints.jobs}?${params}`);
            setJobs(data.jobs || []);
            setPagination(data.pagination || { total: 0, page: 1, page_size: 25, total_pages: 1 });
        } catch (error) { console.error('Failed to load jobs:', error); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchJobs(1);
        const interval = setInterval(() => fetchJobs(pagination.page), 15000);
        return () => clearInterval(interval);
    }, [filter]);

    const StatusBadge = ({ status }) => {
        const styles = {
            completed: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
            processing: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
            pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
            failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
        };
        const Icons = { completed: CheckCircle, processing: Loader, pending: Clock, failed: XCircle };
        const Icon = Icons[status] || Clock;
        const s = styles[status] || styles.pending;
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[11px] font-bold"
                style={{ backgroundColor: s.bg, color: s.color }}>
                <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const columns = [
        { header: 'Job ID', render: (job) => <span className="font-mono text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>{job.id.slice(0, 8)}...</span> },
        { header: 'Type', render: (job) => <span className="font-semibold text-[13px] capitalize" style={{ color: 'var(--text-primary)' }}>{job.type}</span> },
        { header: 'Status', render: (job) => <StatusBadge status={job.status} /> },
        { header: 'User', render: (job) => <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{job.user}</span> },
        { header: 'Created', render: (job) => <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{new Date(job.created_at).toLocaleString()}</span> },
        { header: 'Source', render: (job) => <span className="text-[11px] font-semibold capitalize" style={{ color: 'var(--text-muted)' }}>{job.source}</span> }
    ];

    return (
        <div className="space-y-6">
            <motion.header initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Job Monitor</h1>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{pagination.total} total jobs · Refreshes every 15s</p>
                </div>
                <div className="flex gap-2">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 rounded-[12px] text-[13px] font-semibold outline-none"
                        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                        <option value="all">All Jobs</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="completed">Completed</option>
                    </select>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchJobs(pagination.page)}
                        className="p-2.5 rounded-[12px] transition-all"
                        style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                        <RefreshCw className="w-4 h-4" />
                    </motion.button>
                </div>
            </motion.header>

            <DataTable data={jobs} columns={columns} loading={loading} />

            {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>Page {pagination.page} of {pagination.total_pages}</span>
                    <div className="flex gap-1">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchJobs(pagination.page - 1)} disabled={pagination.page <= 1}
                            className="p-2 rounded-[10px] disabled:opacity-30" style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                            <ChevronLeft className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchJobs(pagination.page + 1)} disabled={pagination.page >= pagination.total_pages}
                            className="p-2 rounded-[10px] disabled:opacity-30" style={{ backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsPage;
