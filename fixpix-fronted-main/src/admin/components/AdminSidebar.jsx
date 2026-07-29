/**
 * Admin Icon Rail — Matches the main app's IconRail exactly
 * Uses the same premium-ui.css classes: .icon-rail, .rail-*, etc.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Activity, LogOut, ShieldAlert,
    BarChart3, ScrollText, Shield, Sparkles, Sun, Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useAdminAuthStore from '../store/adminAuthStore';

const ADMIN_BASE = '/admin-fixpix-secure-portal-9x7';

const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 450, damping: 32 };

/* ─── Tooltip ─── */
const Tooltip = ({ text, show }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                className="rail-tooltip"
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -6, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
                {text}
            </motion.div>
        )}
    </AnimatePresence>
);

/* ─── NavButton ─── */
const NavButton = ({ id, isActive, icon: Icon, onClick, title }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div
            className="rail-icon-wrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        >
            <motion.button
                onClick={onClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                className={`rail-icon-btn ${isActive ? 'is-active' : ''}`}
                type="button"
                animate={{
                    scale: isPressed ? 0.94 : isHovered ? 1.08 : isActive ? 1.08 : 1,
                }}
                transition={isPressed ? { type: 'spring', stiffness: 600, damping: 20 } : SPRING_PREMIUM}
                style={{ position: 'relative', zIndex: 2 }}
            >
                <motion.div
                    className="rail-icon-hover"
                    animate={{
                        opacity: isHovered && !isActive ? 1 : 0,
                        scale: isHovered && !isActive ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                />
                <motion.div
                    className="rail-icon-glyph"
                    animate={{
                        color: isActive
                            ? 'var(--rail-active-color)'
                            : isHovered
                                ? 'var(--text-primary)'
                                : 'var(--rail-icon-muted)',
                        scale: isActive ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Icon
                        size={21}
                        strokeWidth={isActive ? 2.5 : 2}
                        style={{
                            filter: isActive
                                ? 'drop-shadow(0 0 12px var(--rail-active-glow))'
                                : 'none',
                        }}
                    />
                </motion.div>
            </motion.button>
            <Tooltip text={title} show={isHovered} />
        </div>
    );
};

/* ─── Active Indicator Pill ─── */
const ActiveIndicator = ({ activeIndex }) => {
    const ICON_SIZE = 46;
    const GAP = 16;
    const yPos = activeIndex * (ICON_SIZE + GAP);

    return (
        <motion.div
            className="rail-indicator"
            animate={{ y: yPos }}
            transition={SPRING_PREMIUM}
            style={{ x: '-50%' }}
        />
    );
};

/* ─── Admin Icon Rail ─── */
const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const { adminLogout, adminUser } = useAdminAuthStore();

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: `${ADMIN_BASE}/dashboard` },
        { id: 'users', icon: Users, label: 'Users', path: `${ADMIN_BASE}/users` },
        { id: 'jobs', icon: Activity, label: 'Jobs', path: `${ADMIN_BASE}/jobs` },
        { id: 'analytics', icon: BarChart3, label: 'Analytics', path: `${ADMIN_BASE}/analytics` },
        { id: 'insights', icon: Sparkles, label: 'AI Insights', path: `${ADMIN_BASE}/insights` },
        { id: 'activity', icon: ScrollText, label: 'Activity', path: `${ADMIN_BASE}/activity` },
        { id: 'system', icon: ShieldAlert, label: 'System', path: `${ADMIN_BASE}/system` },
    ];

    const getActiveId = () => {
        const path = location.pathname;
        if (path.includes('/dashboard') || path === ADMIN_BASE || path === `${ADMIN_BASE}/`) return 'dashboard';
        for (const item of navItems) {
            if (item.id !== 'dashboard' && path.includes(`/${item.id}`)) return item.id;
        }
        return 'dashboard';
    };

    const activeId = getActiveId();
    const activeIndex = navItems.findIndex(item => item.id === activeId);

    const handleLogout = () => {
        adminLogout();
        navigate(`${ADMIN_BASE}/login`, { replace: true });
    };

    return (
        <motion.div
            className="icon-rail"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
            {/* Glass shine */}
            <div className="rail-glass-shine" />

            {/* Logo */}
            <motion.div
                className="rail-logo shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`${ADMIN_BASE}/dashboard`)}
                transition={SPRING_SNAPPY}
            >
                <Shield size={18} fill="currentColor" strokeWidth={2.5} />
                <div className="rail-logo-gloss" />
            </motion.div>

            {/* Divider */}
            <div className="rail-sep" />

            {/* Navigation with sliding indicator */}
            <div className="rail-nav">
                <AnimatePresence>
                    {activeIndex >= 0 && (
                        <ActiveIndicator activeIndex={activeIndex} />
                    )}
                </AnimatePresence>

                <motion.div
                    className="rail-nav-icons"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
                        }
                    }}
                >
                    {navItems.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 }
                            }}
                            transition={SPRING_PREMIUM}
                        >
                            <NavButton
                                id={item.id}
                                isActive={activeId === item.id}
                                icon={item.icon}
                                onClick={() => navigate(item.path)}
                                title={item.label}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom Actions */}
            <motion.div
                className="rail-bottom"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...SPRING_PREMIUM }}
            >
                <div className="rail-sep" />

                {/* Theme Toggle */}
                <div className="rail-icon-wrap">
                    <motion.button
                        onClick={toggleTheme}
                        className="rail-theme-btn"
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                        whileTap={{ scale: 0.9 }}
                        transition={SPRING_SNAPPY}
                        type="button"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isDark ? 'dark' : 'light'}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center"
                            >
                                {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Logout / Avatar */}
                <motion.button
                    onClick={handleLogout}
                    className="rail-avatar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING_SNAPPY}
                    type="button"
                    title="Exit Admin"
                    style={{ background: 'var(--fill-secondary)', border: '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <LogOut size={16} style={{ color: 'var(--text-secondary)' }} />
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default AdminSidebar;
