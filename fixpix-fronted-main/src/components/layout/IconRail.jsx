import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Library, LayoutDashboard, Home, Sun, Moon, Sparkles, History, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import useCanvasStore from '../../store/canvasStore';

/* ─── Spring Config ─── */
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

/* ─── NavButton: Single icon with hover/active/press states ─── */
const NavButton = ({ id, activeTab, icon: Icon, onClick, title, mobileDrawer = false }) => {
    const isActive = activeTab === id;
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div
            className="rail-icon-wrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        >
            <motion.button
                onClick={() => onClick(id)}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                className={`rail-icon-btn ${isActive ? 'is-active' : ''}`}
                type="button"
                aria-label={title}
                animate={{
                    scale: isPressed ? 0.94 : isHovered ? 1.08 : isActive ? 1.08 : 1,
                }}
                transition={isPressed ? { type: 'spring', stiffness: 600, damping: 20 } : SPRING_PREMIUM}
                style={{ position: 'relative', zIndex: 2 }}
            >
                {/* Hover highlight background */}
                <motion.div
                    className="rail-icon-hover"
                    animate={{
                        opacity: isHovered && !isActive ? 1 : 0,
                        scale: isHovered && !isActive ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                />

                {/* Icon */}
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

            {/* Tooltip */}
            <Tooltip text={title} show={!mobileDrawer && isHovered} />
        </div>
    );
};

/* ─── Active Indicator Pill (slides smoothly) ─── */
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

/* ─── Main IconRail Component ─── */
const IconRail = ({ activeTab, onTabSelect, mobileDrawer = false }) => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { user, isElite } = useAuth();
    const railRef = useRef(null);

    const isAccountActive = activeTab === 'account';

    const navItems = [
        { id: 'landing', icon: Home, label: 'Home', path: '/' },
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
        { id: 'edit', icon: Wand2, label: 'Editor', path: '/app/restoration' },
        { id: 'projects', icon: Library, label: 'Vault', path: '/app/projects' },
        { id: 'history', icon: History, label: 'History', path: '/app/history' },
        // Only show pricing if NOT elite
        ...(!isElite ? [{ id: 'pricing', icon: Crown, label: 'Pricing', path: '/app/pricing' }] : []),
    ];

    const activeIndex = navItems.findIndex(item => item.id === activeTab);
    const setIsCopilotCollapsed = useCanvasStore(state => state.setIsCopilotCollapsed);

    const handleNavigation = (item) => {
        if (item.action === 'toggleCopilot') {
            setIsCopilotCollapsed(false);
            return;
        }
        if (onTabSelect) {
            onTabSelect(item.id);
        } else {
            navigate(item.path);
        }
    };

    return (
        <motion.div
            ref={railRef}
            className={`icon-rail ${mobileDrawer ? 'icon-rail-mobile-drawer' : ''}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
            {/* ─── Glassmorphism inner highlight ─── */}
            <div className="rail-glass-shine" />

            {/* ─── Logo ─── */}
            <motion.div
                className="rail-logo shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
                transition={SPRING_SNAPPY}
            >
                <Sparkles size={18} fill="currentColor" strokeWidth={2.5} />
                <div className="rail-logo-gloss" />
            </motion.div>

            {/* ─── Divider ─── */}
            <div className="rail-sep" />

            {/* ─── Navigation Icons with sliding indicator ─── */}
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
                                activeTab={activeTab}
                                icon={item.icon}
                                onClick={() => handleNavigation(item)}
                                title={item.label}
                                mobileDrawer={mobileDrawer}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* ─── Bottom Actions ─── */}
            <motion.div
                className="rail-bottom"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...SPRING_PREMIUM }}
            >
                <div className="rail-sep" />

                <div className="rail-icon-wrap">
                    <motion.button
                        onClick={toggleTheme}
                        className="rail-theme-btn"
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                        whileTap={{ scale: 0.9 }}
                        transition={SPRING_SNAPPY}
                        type="button"
                        aria-label="Toggle theme"
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

                {/* Avatar */}
                <motion.button
                    onClick={() => navigate('/app/profile')}
                    className={`rail-avatar ${isAccountActive ? 'shadow-[0_0_15px_var(--accent-soft)]' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING_SNAPPY}
                    style={{ border: isAccountActive ? '2px solid var(--accent)' : '2px solid transparent' }}
                    type="button"
                    aria-label="Open profile"
                >
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Parth'}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                        alt="Avatar"
                        loading="lazy"
                        decoding="async"
                        className="rail-avatar-img w-full h-auto object-cover"
                    />
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default IconRail;
