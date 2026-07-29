/**
 * Admin Layout — Icon Rail + Command Palette + Notifications
 */

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import CommandPalette from '../components/CommandPalette';
import NotificationSystem from '../components/NotificationSystem';
import useAdminAuthStore from '../store/adminAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Search, Command } from 'lucide-react';

const AdminLayout = () => {
    const { getSessionTimeRemaining, adminLogout, isVerified, isAdminAuthenticated, extendSession } = useAdminAuthStore();
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [showExpireBanner, setShowExpireBanner] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [extendingSession, setExtendingSession] = useState(false);

    // Session timer
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = getSessionTimeRemaining();
            setTimeRemaining(remaining);
            
            if (remaining > 0 && remaining < 300) setShowExpireBanner(true);
            
            // Only auto-logout if we have verified the session AND it is genuinely expired
            // This prevents premature logout on page reload while background check is running
            if (isVerified && isAdminAuthenticated && remaining <= 0) {
                adminLogout();
                window.location.href = '/admin-fixpix-secure-portal-9x7/login';
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [getSessionTimeRemaining, adminLogout, isVerified, isAdminAuthenticated]);

    // ⌘+K keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleExtendSession = async () => {
        setExtendingSession(true);
        const ok = await extendSession();
        setExtendingSession(false);
        if (ok) {
            setShowExpireBanner(false);
        }
    };

    return (
        <div className="min-h-[100dvh] overflow-hidden overflow-x-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Fixed Floating Icon Rail (Middle-Aligned) */}
            <div className="fixed inset-y-0 left-0 z-50 flex items-center pointer-events-none transition-all">
                <div className="pointer-events-auto">
                    <AdminSidebar />
                </div>
            </div>

            {/* Main Content — offset by icon rail width (68px + 16px margin) */}
            <main style={{ marginLeft: 'calc(var(--rail-w, 68px) + var(--rail-m, 16px) + 8px)' }}
                className="min-h-[100dvh] overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300">
                {/* Session Expiry Banner */}
                <AnimatePresence>
                    {showExpireBanner && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-amber-500/10 border-b px-6 py-2 flex items-center justify-between"
                                style={{ borderColor: 'var(--divider)' }}>
                                <div className="flex items-center gap-2 text-amber-500 text-sm font-semibold">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Session expiring in <strong>{formatTime(timeRemaining)}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleExtendSession}
                                        disabled={extendingSession}
                                        className="text-amber-600 hover:text-amber-700 text-xs font-bold px-2 py-1 rounded-md bg-amber-500/10 disabled:opacity-60"
                                    >
                                        {extendingSession ? 'Extending...' : 'Extend Session'}
                                    </button>
                                    <button onClick={() => setShowExpireBanner(false)}
                                        className="text-amber-500/60 hover:text-amber-500 text-xs font-bold">
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Bar */}
                <div className="h-14 flex items-center justify-between px-6"
                    style={{ borderBottom: '1px solid var(--divider, rgba(0,0,0,0.06))' }}>

                    {/* Command Palette trigger */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setCommandPaletteOpen(true)}
                        className="flex items-center gap-3 px-4 py-2 rounded-[12px] transition-all w-72"
                        style={{
                            backgroundColor: 'var(--fill-tertiary, rgba(0,0,0,0.04))',
                            border: '1px solid var(--card-border)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-[13px] font-medium flex-1 text-left">Search or jump to...</span>
                        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[5px] text-[10px] font-bold"
                            style={{
                                backgroundColor: 'var(--fill-tertiary)',
                                color: 'var(--text-muted)',
                                border: '1px solid var(--divider)',
                            }}>
                            <Command className="w-3 h-3" />K
                        </kbd>
                    </motion.button>

                    {/* Right section */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-semibold"
                            style={{ color: 'var(--text-muted)' }}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTime(timeRemaining)}</span>
                        </div>
                        <div className="w-px h-4" style={{ backgroundColor: 'var(--divider)' }} />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Secure</span>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Global Components */}
            <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
            <NotificationSystem />
        </div>
    );
};

export default AdminLayout;
