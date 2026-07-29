/**
 * Admin Login Page — iOS Style matching FixPix AuthLayout
 * Uses the same design tokens (var(--*)) and framer-motion as the rest of the site
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAdminAuthStore from '../store/adminAuthStore';
import { Shield, Eye, EyeOff, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ADMIN_BASE = '/admin-fixpix-secure-portal-9x7';

// ─── Dot Map Background (same as AuthLayout) ─────────────────
const AdminDotMap = ({ isDark }) => {
    const dots = [];
    const cols = 20;
    const rows = 16;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = (c / (cols - 1)) * 100;
            const y = (r / (rows - 1)) * 100;
            const dist = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
            const opacity = Math.max(0.05, 0.35 - dist * 0.004);
            dots.push(
                <circle
                    key={`${r}-${c}`}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="1.5"
                    fill={isDark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity * 0.6})`}
                />
            );
        }
    }
    return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {dots}
        </svg>
    );
};

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [shakeError, setShakeError] = useState(false);
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const {
        adminLogin,
        isAdminAuthenticated,
        isLoading,
        error,
        clearError,
    } = useAdminAuthStore();

    useEffect(() => {
        if (isAdminAuthenticated) {
            navigate(`${ADMIN_BASE}/dashboard`, { replace: true });
        }
    }, [isAdminAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (!username.trim() || !password) return;

        const success = await adminLogin(username.trim(), password);
        if (success) {
            navigate(`${ADMIN_BASE}/dashboard`, { replace: true });
        } else {
            setShakeError(true);
            setTimeout(() => setShakeError(false), 600);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            {/* Background Atmospheric Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-[0.05] blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500 opacity-[0.05] blur-[100px] rounded-full" />
            </div>

            {/* Main Container — Split Layout like AuthLayout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-5xl h-[min(750px,calc(100vh-64px))] flex rounded-[28px] overflow-hidden border shadow-[0_20px_60px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] relative z-10 transition-all duration-[250ms] ease-in-out ${shakeError ? 'animate-shake' : ''}`}
                style={{
                    backgroundColor: 'var(--surface-elevated, var(--card-bg))',
                    borderColor: 'var(--border-subtle, var(--card-border))',
                }}
            >
                {/* ── Visual Column (Desktop Only) ── */}
                <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[var(--bg-secondary,#f5f5f7)] to-[var(--bg-primary)] overflow-hidden border-r"
                    style={{ borderColor: 'var(--border-subtle, var(--card-border))' }}
                >
                    <AdminDotMap isDark={isDark} />

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 rounded-[28px] flex items-center justify-center shadow-2xl mb-8"
                            style={{
                                background: 'var(--accent, #2563eb)',
                                boxShadow: '0 20px 40px var(--accent-soft, rgba(37,99,235,0.3))',
                            }}
                        >
                            <Shield size={36} className="text-white" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-center"
                        >
                            <h2 className="text-4xl font-black italic tracking-tighter mb-4"
                                style={{ color: 'var(--text-primary)', letterSpacing: 'var(--tracking-tighter, -0.04em)' }}
                            >
                                FixPix <span style={{ color: 'var(--accent, #2563eb)' }}>Admin</span>
                            </h2>
                            <p className="text-[17px] font-bold max-w-xs mx-auto leading-relaxed"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Secure admin portal for platform management, analytics, and system monitoring.
                            </p>
                        </motion.div>
                    </div>

                    {/* Extra Glows */}
                    <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[var(--accent)] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500 opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
                </div>

                {/* ── Form Column ── */}
                <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto scrollbar-hide"
                    style={{ backgroundColor: 'var(--surface-elevated, var(--card-bg))' }}
                >
                    <div className="w-full max-w-sm mx-auto my-auto py-8">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="w-14 h-14 rounded-[20px] flex items-center justify-center"
                                style={{ background: 'var(--accent)', boxShadow: '0 12px 30px var(--accent-soft, rgba(37,99,235,0.3))' }}
                            >
                                <Shield size={28} className="text-white" />
                            </div>
                        </div>

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-10"
                        >
                            <h1 className="text-3xl font-semibold mb-2"
                                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
                            >
                                Admin Portal
                            </h1>
                            <p className="text-[15px] font-medium uppercase tracking-widest"
                                style={{ color: 'var(--text-secondary)', letterSpacing: 'var(--tracking-widest, 0.1em)' }}
                            >
                                Restricted Access
                            </p>
                        </motion.div>

                        {/* Error Alert */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-[var(--ios-radius,16px)] text-red-500 text-[13px] font-bold text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold uppercase tracking-widest ml-1"
                                    style={{ color: 'var(--text-tertiary, var(--text-muted))' }}
                                >
                                    Username
                                </label>
                                <div className="relative group/input flex items-center">
                                    <div className="absolute left-4 z-10 opacity-60 transition-all"
                                        style={{ color: 'var(--text-tertiary, var(--text-muted))' }}
                                    >
                                        <UserIcon size={18} />
                                    </div>
                                    <input
                                        id="admin-username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter admin username"
                                        autoComplete="username"
                                        autoFocus
                                        disabled={isLoading}
                                        className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[15px] outline-none transition-all disabled:opacity-50"
                                        style={{
                                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                                            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                                            color: 'var(--text-primary)',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'rgba(0,122,255,0.5)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(0,122,255,0.15), inset 0 1px 2px rgba(0,0,0,0.04)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                                            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold uppercase tracking-widest ml-1"
                                    style={{ color: 'var(--text-tertiary, var(--text-muted))' }}
                                >
                                    Password
                                </label>
                                <div className="relative group/input flex items-center">
                                    <div className="absolute left-4 z-10 opacity-60 transition-all"
                                        style={{ color: 'var(--text-tertiary, var(--text-muted))' }}
                                    >
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        id="admin-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        className="w-full h-[52px] pl-11 pr-12 rounded-[14px] text-[15px] outline-none transition-all disabled:opacity-50"
                                        style={{
                                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                                            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                                            color: 'var(--text-primary)',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'rgba(0,122,255,0.5)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(0,122,255,0.15), inset 0 1px 2px rgba(0,0,0,0.04)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                                            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 z-10 opacity-40 hover:opacity-100 transition-all"
                                        style={{ color: 'var(--text-tertiary, var(--text-muted))' }}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button — iOS pill style */}
                            <motion.button
                                type="submit"
                                disabled={isLoading || !username.trim() || !password}
                                whileHover={{ y: -1, boxShadow: '0 10px 24px var(--accent-soft, rgba(37,99,235,0.3))' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-[54px] mt-6 text-white font-medium text-[15px] tracking-wide rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: 'var(--accent, #2563eb)',
                                    boxShadow: '0 6px 20px rgba(0, 122, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <Shield size={18} />
                                        Sign In to Admin Panel
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--divider, rgba(0,0,0,0.06))' }}>
                            <p className="text-xs text-center leading-relaxed font-medium"
                                style={{ color: 'var(--text-muted, #999)' }}
                            >
                                This is a restricted area. All access attempts are logged
                                and monitored. Unauthorized access is prohibited.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Shake animation */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.6s ease-in-out; }
            `}</style>
        </div>
    );
};

export default AdminLoginPage;
