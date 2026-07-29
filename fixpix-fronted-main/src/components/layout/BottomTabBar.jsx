import React, { useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderOpen, Wand2, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomTabBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Map paths to tab names
    const getActiveTab = useCallback(() => {
        const path = location.pathname.toLowerCase();
        if (path === '/app') return 'home';
        if (path.startsWith('/app/projects')) return 'projects';
        if (path.startsWith('/app/restoration')) return 'create';
        if (path.startsWith('/app/history')) return 'history';
        if (path.startsWith('/app/profile')) return 'profile';
        return 'home';
    }, [location.pathname]);

    const activeTab = useMemo(() => getActiveTab(), [getActiveTab]);

    const tabs = useMemo(() => [
        { id: 'home', icon: Home, label: 'Home', path: '/app' },
        { id: 'projects', icon: FolderOpen, label: 'Vault', path: '/app/projects' },
        { id: 'create', icon: Wand2, label: 'AI Studio', path: '/app/restoration', isPrimary: true },
        { id: 'history', icon: Clock, label: 'History', path: '/app/history' },
        { id: 'profile', icon: User, label: 'Profile', path: '/app/profile' },
    ], []);

    const handleTabClick = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-4 pb-[calc(12px+env(safe-area-inset-bottom,0))] overflow-x-hidden" aria-label="Bottom navigation">
            <div className="w-full max-w-[640px] mx-auto h-[64px] sm:h-[68px] mobile-glass mobile-glass-border px-2 sm:px-2.5 rounded-[32px] sm:rounded-[34px] shadow-2xl shadow-black/10 overflow-hidden">
                <div className="h-full grid grid-cols-5 items-center gap-1">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    if (tab.isPrimary) {
                        return (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.88, y: 3 }}
                                onClick={() => handleTabClick(tab.path)}
                                className="relative -top-4 sm:-top-5 flex flex-col items-center justify-center no-underline min-w-0"
                                type="button"
                                aria-label={tab.label}
                            >
                                <div className="w-full max-w-[54px] sm:max-w-[60px] aspect-square rounded-[20px] sm:rounded-[22px] bg-accent flex items-center justify-center shadow-[0_12px_28px_rgba(0,113,227,0.45)] border border-white/40 relative overflow-hidden group">
                                    <Icon size={26} color="white" strokeWidth={3} className="relative z-10 drop-shadow-sm" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-white/10 to-transparent pointer-events-none" />
                                    <div className="absolute top-0 inset-x-0 h-px bg-white/40" />
                                </div>
                                <span className="text-sm md:text-base lg:text-lg font-black text-accent mt-2 tracking-[0.08em] uppercase leading-none whitespace-nowrap scale-[0.58] sm:scale-[0.62] origin-top">
                                    {tab.label}
                                </span>
                            </motion.button>
                        );
                    }

                    return (
                        <motion.button
                            key={tab.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTabClick(tab.path)}
                            className="flex flex-col items-center justify-center w-full h-full gap-1.5 sm:gap-2 transition-all no-underline overflow-hidden min-w-0"
                            style={{ color: isActive ? 'var(--accent)' : 'var(--text-tertiary)' }}
                            type="button"
                            aria-label={tab.label}
                        >
                            <div className="relative">
                                <Icon
                                    size={21}
                                    strokeWidth={isActive ? 3.2 : 2.5}
                                    className={`${isActive ? 'text-accent drop-shadow-[0_0_15px_var(--accent-soft)]' : 'opacity-60'}`}
                                />
                            </div>
                            <span className={`text-sm md:text-base lg:text-lg font-[950] tracking-[0.08em] uppercase leading-none mb-1 transition-all whitespace-nowrap scale-[0.6] sm:scale-[0.66] origin-top ${isActive ? 'text-accent opacity-100' : 'opacity-40'}`}>
                                {tab.label}
                            </span>
                        </motion.button>
                    );
                })}
                </div>
            </div>
        </nav>
    );
};

export default BottomTabBar;
