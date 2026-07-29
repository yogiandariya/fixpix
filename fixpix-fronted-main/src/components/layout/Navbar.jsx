import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronRight, ChevronDown, Sparkles, Layers, MessageCircle, User, LogOut, LayoutDashboard, ArrowRight, Newspaper, Wand2, Clock, BookOpen } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

/* ─── Spring Configs ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 450, damping: 32 };

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isElite, isPro, plan, isSubscribed, logoutUser } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = isDark ? 'dark' : 'light';

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileExpanded({});
        setActiveDropdown(null);
    }, [location.pathname]);

    // No scroll lock needed — backdrop prevents interaction

    // Extended nav structure with sub-links
    const navLinks = [
        { 
            label: 'AI Workspace', 
            type: 'dropdown', 
            accent: 'var(--accent)',
            items: [
                { to: '/app/restoration', label: 'Neural Editor', desc: 'Precision pixel restoration', icon: Wand2 },
                { to: '/app/batch', label: 'Batch Neural', desc: 'Process multiple libraries', icon: Layers },
                { to: '/app/history', label: 'Neural Archive', desc: 'Audit your activity', icon: Clock },
                { to: '/app/projects', label: 'Media Vault', desc: 'Access persistent cloud', icon: LayoutDashboard },
            ]
        },
        { to: '/ai-news', label: 'AI News', isLink: true, icon: Newspaper, accent: '#FF2D55' },
        { to: '/blog', label: 'Blog', isLink: true, icon: BookOpen, accent: '#007AFF' },
        { to: '/app/pricing', label: 'Pricing', isLink: true, icon: Sparkles, accent: '#34C759' },
        { to: '/about', label: 'About', isLink: true, icon: User, accent: '#FF9500' },
    ];

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileExpanded, setMobileExpanded] = useState({});

    const isLinkActive = (to) => {
        if (!to) return false;
        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };

    const toggleMobileExpand = (label) => {
        setMobileExpanded(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <>
            <nav
                className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%_-_16px)] sm:w-[calc(100%_-_24px)] md:w-max max-w-[1200px] md:max-w-none min-w-0 landing-navbar overflow-visible"
                style={{ transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)', willChange: 'transform, opacity' }}
            >
                <div
                    className="relative flex items-center justify-between h-[58px] md:h-[64px] overflow-visible"
                    style={{
                        padding: '0 8px 0 clamp(12px, 3vw, 24px)',
                        gap: 'clamp(24px, 5vw, 48px)',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isDark ? 'rgba(25, 25, 28, 0.75)' : 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: 'var(--glass-blur)',
                        WebkitBackdropFilter: 'var(--glass-blur)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--depth-2)',
                    }}
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center h-10 shrink-0" aria-label="FixPix Home">
                        <Logo />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1 group/nav">
                        {navLinks.map((link) => (
                            <div 
                                key={link.label} 
                                className="relative"
                                onMouseEnter={() => link.type === 'dropdown' && setActiveDropdown(link.label)}
                                onMouseLeave={() => link.type === 'dropdown' && setActiveDropdown(null)}
                            >
                                {link.type === 'dropdown' ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(prev => (prev === link.label ? null : link.label))}
                                            className={`flex items-center gap-1 px-4 py-2 text-[13px] font-black uppercase tracking-widest transition-all rounded-full hover:bg-[var(--fill-tertiary)] ${activeDropdown === link.label ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                                            style={{ letterSpacing: '0.05em' }}
                                            aria-haspopup="menu"
                                            aria-expanded={activeDropdown === link.label}
                                        >
                                            {link.label}
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {activeDropdown === link.label && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={SPRING_SNAPPY}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72"
                                                >
                                                    <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] shadow-[var(--depth-3)] backdrop-blur-3xl overflow-hidden p-2">
                                                        {link.items.map((item) => (
                                                            <Link
                                                                key={item.to}
                                                                to={item.to}
                                                                className="flex items-start gap-4 p-3 rounded-[var(--radius-xl)] hover:bg-[var(--fill-tertiary)] transition-colors group/item"
                                                            >
                                                                <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)] group-hover/item:text-[var(--accent)] group-hover/item:scale-110 transition-all border border-[var(--border-subtle)]">
                                                                    <item.icon size={20} />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-black text-[var(--text-primary)]">{item.label}</span>
                                                                    <span className="text-[11px] font-medium text-[var(--text-tertiary)] group-hover/item:text-[var(--text-secondary)] transition-colors">{item.desc}</span>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <Link
                                        to={link.to}
                                        className={`relative px-4 py-2 text-[13px] font-black uppercase tracking-widest transition-all rounded-full whitespace-nowrap ${isLinkActive(link.to) ? 'text-[var(--text-primary)] bg-[var(--fill-tertiary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--fill-tertiary)]'}`}
                                        style={{ letterSpacing: '0.05em' }}
                                    >
                                        {link.label}
                                        {isLinkActive(link.to) && (
                                            <span className="absolute left-1/2 -translate-x-1/2 bottom-[2px] w-6 h-[2px] rounded-full bg-[var(--accent)]" />
                                        )}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main transition-colors bg-[var(--fill-tertiary)]"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={theme}
                                    initial={{ opacity: 0, rotate: -90, scale: 0 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                </motion.div>
                            </AnimatePresence>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border-subtle)] shadow-sm">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}&backgroundColor=b6e3f4`} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button 
                                    onClick={() => navigate('/app/profile')}
                                    className="h-9 px-4 rounded-full bg-[var(--fill-tertiary)] text-[var(--text-primary)] text-xs font-black uppercase tracking-wide hover:bg-[var(--border-subtle)] transition-all flex items-center gap-2"
                                >
                                    PROFILE
                                    {isElite && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="ml-2 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-full bg-gradient-to-r from-blue-500/20 via-sky-400/30 to-indigo-500/20 backdrop-blur-md text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 shadow-[0_0_18px_rgba(0,122,255,0.35)]"
                                            title="You are on the Elite Plan"
                                        >
                                            Elite
                                        </motion.div>
                                    )}
                                    {isPro && !isElite && (
                                        <span className="ml-2 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide bg-indigo-500 text-white">
                                            PRO
                                        </span>
                                    )}
                                </button>
                                <button 
                                    onClick={() => navigate('/app')}
                                    className="h-10 px-6 rounded-full bg-[var(--accent)] text-white text-xs font-black uppercase tracking-wide shadow-lg shadow-[var(--accent-soft)] active:scale-95 transition-all"
                                >
                                    WORKSPACE
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-5 py-2 text-[13px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--fill-tertiary)] rounded-full transition-all">Log In</Link>
                                <Link to="/signup" className="px-6 h-10 flex items-center bg-[var(--text-primary)] text-[var(--bg-primary)] text-[13px] font-black uppercase tracking-widest rounded-full active:scale-95 transition-all shadow-md">Get Started</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Menu Trigger */}
                    <div className="flex items-center md:hidden pr-2">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="mobile-hamburger-btn w-10 h-10 flex items-center justify-center text-[var(--text-primary)] rounded-full"
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[89] bg-black/20 backdrop-blur-md md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="mobile-sidebar-drawer fixed top-[max(12px,calc(var(--safe-area-inset-top)+8px))] right-2 left-auto bottom-[max(12px,env(safe-area-inset-bottom))] z-[90] w-[min(92vw,360px)] max-w-[360px] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-3xl)] shadow-2xl p-4 sm:p-5 md:hidden overflow-y-auto overflow-x-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {navLinks.map((link) => (
                                    <div key={link.label}>
                                        {link.type === 'dropdown' ? (
                                            <div className="flex flex-col">
                                                <button 
                                                    onClick={() => toggleMobileExpand(link.label)}
                                                    className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-[var(--radius-xl)] bg-[var(--fill-secondary)] text-[var(--text-primary)] font-black uppercase tracking-widest text-sm md:text-base lg:text-lg"
                                                >
                                                    {link.label}
                                                    <ChevronRight size={18} className={`transition-transform ${mobileExpanded[link.label] ? 'rotate-90' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {mobileExpanded[link.label] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="flex flex-col gap-2 pl-4 mt-2 overflow-hidden"
                                                        >
                                                            {link.items.map(item => (
                                                                <Link
                                                                    key={item.to}
                                                                    to={item.to}
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                    className="flex flex-wrap items-center gap-3 p-3 rounded-[var(--radius-lg)] hover:bg-[var(--fill-tertiary)]"
                                                                >
                                                                    <div className="p-2 border border-[var(--border-subtle)] rounded-lg text-[var(--accent)] bg-[var(--bg-primary)]">
                                                                        <item.icon size={16} />
                                                                    </div>
                                                                    <span className="text-sm md:text-base lg:text-lg font-bold text-[var(--text-secondary)] leading-tight">{item.label}</span>
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link 
                                                to={link.to} 
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block p-3.5 rounded-[var(--radius-xl)] bg-[var(--fill-secondary)] text-[var(--text-primary)] font-black uppercase tracking-widest text-sm md:text-base lg:text-lg"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center flex-wrap gap-3 p-3.5 rounded-[var(--radius-xl)] bg-[var(--fill-tertiary)]">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent)]">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                    alt="User"
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-[var(--text-primary)]">{user.user_metadata?.username || 'FixPixer'}</span>
                                                    {isElite && (
                                                        <div className="px-2.5 py-0.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                            Elite
                                                        </div>
                                                    )}
                                                    {isPro && !isElite && (
                                                        <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter bg-indigo-500 text-white">
                                                            PRO
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-bold text-[var(--text-tertiary)] truncate">{user.email}</span>
                                            </div>
                                        </div>
                                        <button onClick={logoutUser} className="w-full py-3.5 text-sm md:text-base lg:text-lg font-black uppercase tracking-widest text-red-500 bg-red-500/10 rounded-[var(--radius-xl)] transition-colors">Logout Account</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3.5 text-center text-sm md:text-base lg:text-lg font-black uppercase tracking-widest text-[var(--text-primary)] bg-[var(--fill-tertiary)] rounded-[var(--radius-xl)]">Login</Link>
                                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full py-3.5 text-center text-sm md:text-base lg:text-lg font-black uppercase tracking-widest text-white bg-[var(--accent)] rounded-[var(--radius-xl)] shadow-lg shadow-[var(--accent-soft)]">Get Started</Link>
                                    </div>
                                ) }
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
