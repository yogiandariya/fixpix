/**
 * Command Palette — ⌘+K / Ctrl+K
 *
 * Global search + quick actions across the admin panel.
 * Fuzzy search pages, actions, and recently visited.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, LayoutDashboard, Users, Activity, BarChart3,
    ScrollText, ShieldAlert, Sparkles, ArrowRight, Command,
    X, Clock, Zap
} from 'lucide-react';

const ADMIN_BASE = '/admin-fixpix-secure-portal-9x7';

const ALL_COMMANDS = [
    { id: 'dashboard', label: 'Dashboard', description: 'Platform overview & metrics', icon: LayoutDashboard, path: `${ADMIN_BASE}/dashboard`, category: 'Pages' },
    { id: 'users', label: 'User Management', description: 'View and manage users', icon: Users, path: `${ADMIN_BASE}/users`, category: 'Pages' },
    { id: 'jobs', label: 'Job Monitor', description: 'Processing queue & status', icon: Activity, path: `${ADMIN_BASE}/jobs`, category: 'Pages' },
    { id: 'analytics', label: 'Analytics', description: 'Charts, trends & data', icon: BarChart3, path: `${ADMIN_BASE}/analytics`, category: 'Pages' },
    { id: 'insights', label: 'AI Insights', description: 'AI-powered recommendations', icon: Sparkles, path: `${ADMIN_BASE}/insights`, category: 'Pages' },
    { id: 'activity', label: 'Activity Logs', description: 'Admin audit trail', icon: ScrollText, path: `${ADMIN_BASE}/activity`, category: 'Pages' },
    { id: 'system', label: 'System Health', description: 'Error rates, uptime, queue', icon: ShieldAlert, path: `${ADMIN_BASE}/system`, category: 'Pages' },
    { id: 'action-refresh', label: 'Refresh Data', description: 'Reload current page data', icon: Zap, action: 'refresh', category: 'Actions' },
];

const CommandPalette = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentCommands, setRecentCommands] = useState([]);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const navigate = useNavigate();

    // Load recent commands from sessionStorage
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('admin_recent_commands');
            if (stored) setRecentCommands(JSON.parse(stored));
        } catch {}
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Filter commands
    const filteredCommands = query.trim()
        ? ALL_COMMANDS.filter(cmd =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description.toLowerCase().includes(query.toLowerCase())
        )
        : ALL_COMMANDS;

    // Group by category
    const grouped = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {});

    const flatCommands = filteredCommands;

    const executeCommand = useCallback((cmd) => {
        // Save to recent
        const updated = [cmd.id, ...recentCommands.filter(id => id !== cmd.id)].slice(0, 5);
        setRecentCommands(updated);
        sessionStorage.setItem('admin_recent_commands', JSON.stringify(updated));

        if (cmd.path) {
            navigate(cmd.path);
        } else if (cmd.action === 'refresh') {
            window.location.reload();
        }
        onClose();
    }, [navigate, onClose, recentCommands]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (e) => {
            if (e.key === 'Escape') { onClose(); return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, flatCommands.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
            if (e.key === 'Enter' && flatCommands[selectedIndex]) { executeCommand(flatCommands[selectedIndex]); }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, selectedIndex, flatCommands, executeCommand, onClose]);

    // Scroll selected into view
    useEffect(() => {
        const el = listRef.current?.children?.[selectedIndex];
        el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9998]"
                        style={{ backgroundColor: 'var(--popup-backdrop, rgba(0,0,0,0.4))', backdropFilter: 'blur(4px)' }}
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[9999] rounded-[20px] overflow-hidden"
                        style={{
                            backgroundColor: 'var(--popup-bg, #fff)',
                            boxShadow: 'var(--popup-shadow, 0 32px 80px rgba(0,0,0,0.3))',
                            border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                        }}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--divider)' }}>
                            <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                                placeholder="Search pages, actions..."
                                className="flex-1 text-[15px] font-medium bg-transparent outline-none"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-[6px] text-[10px] font-bold"
                                style={{ backgroundColor: 'var(--fill-tertiary, rgba(0,0,0,0.04))', color: 'var(--text-muted)' }}>
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2 scrollbar-hide">
                            {flatCommands.length === 0 ? (
                                <div className="py-8 text-center text-[13px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    No matching commands
                                </div>
                            ) : (
                                Object.entries(grouped).map(([category, commands]) => (
                                    <div key={category}>
                                        <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest"
                                            style={{ color: 'var(--section-label, var(--text-muted))' }}>
                                            {category}
                                        </div>
                                        {commands.map((cmd) => {
                                            const globalIdx = flatCommands.indexOf(cmd);
                                            const isSelected = globalIdx === selectedIndex;
                                            const Icon = cmd.icon;
                                            const isRecent = recentCommands.includes(cmd.id);

                                            return (
                                                <button
                                                    key={cmd.id}
                                                    onClick={() => executeCommand(cmd)}
                                                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                                                    style={{
                                                        backgroundColor: isSelected ? 'var(--rail-active-bg, rgba(37,99,235,0.08))' : 'transparent',
                                                    }}
                                                >
                                                    <div className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            backgroundColor: isSelected ? 'var(--accent, #2563eb)' : 'var(--fill-tertiary, rgba(0,0,0,0.04))',
                                                            color: isSelected ? '#fff' : 'var(--text-secondary)',
                                                        }}
                                                    >
                                                        <Icon className="w-[18px] h-[18px]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{cmd.label}</span>
                                                            {isRecent && <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />}
                                                        </div>
                                                        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{cmd.description}</span>
                                                    </div>
                                                    {isSelected && <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 flex items-center justify-between text-[10px] font-bold"
                            style={{ borderTop: '1px solid var(--divider)', color: 'var(--text-muted)' }}>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded-[4px]" style={{ backgroundColor: 'var(--fill-tertiary)' }}>↑↓</kbd> Navigate</span>
                                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded-[4px]" style={{ backgroundColor: 'var(--fill-tertiary)' }}>↵</kbd> Open</span>
                            </div>
                            <span className="flex items-center gap-1">
                                <Command className="w-3 h-3" /> + K
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
