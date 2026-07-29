import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authenticatedFetch } from '../lib/authFetch';
import { apiEndpoints } from '../lib/api';
import PremiumMobileHeader from '../components/layout/PremiumMobileHeader';
import { Text } from '../components/ui/Text';
import {
    Wand2, FolderOpen, Layers, Clock,
    Image as ImageIcon, Sparkles, TrendingUp, ArrowRight,
    Search, User, Bell, Layout,
    Cloud, Eraser, PenTool, Type, Frame, ScanFace, FileImage, Plus, Crown, Menu, X
} from 'lucide-react';
import { DashboardSkeleton } from '../components/ui/Skeleton';

/* ─────────────────── Animated Counter ─────────────────── */
const AnimatedCounter = ({ value, duration = 1.5 }) => {
    const numericValue = parseInt(value) || 0;
    const nodeRef = useRef(null);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        import('framer-motion').then(({ animate }) => {
            const controls = animate(0, numericValue, {
                duration: duration,
                ease: [0.23, 1, 0.32, 1], // Smooth iOS-like ease out
                onUpdate(val) {
                    node.textContent = Math.floor(val);
                }
            });
            return controls.stop;
        });
    }, [numericValue, duration]);

    const suffix = typeof value === 'string' ? value.replace(/[0-9]/g, '') : '';
    return <span><span ref={nodeRef}>0</span>{suffix}</span>;
};

/* ─────────────────── iOS Glass Card ─────────────────── */
const GlassCard = ({ children, className = "", style = {}, hover = true }) => (
    <motion.div
        whileHover={hover ? { y: -6, scale: 1.01, boxShadow: 'var(--depth-2)' } : {}}
        whileTap={hover ? { scale: 0.98 } : {}}
        className={`relative overflow-hidden transition-all duration-300 gpu-accelerated ${className}`}
        style={{
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--surface-elevated)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--glass-shadow)',
            padding: '28px',
            willChange: 'transform, box-shadow',
            ...style
        }}
    >
        {children}
    </motion.div>
);

const DashboardPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, session, plan, isElite, isPro, isSubscribed, loading: authLoading } = useAuth();
    const [statsLoading, setStatsLoading] = useState(true);
    const [stats, setStats] = useState({
        images: 0,
        edits: 0,
        projects: 0
    });
    const [recentImages, setRecentImages] = useState([]);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            setStatsLoading(true);
            try {
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                
                // Fetch stats safely without blocking the whole page
                const [imagesRes, editsRes, workflowsRes] = await Promise.allSettled([
                    authenticatedFetch(`${API_URL}/api/images/`),
                    authenticatedFetch(`${API_URL}/api/history/edits/`),
                    authenticatedFetch(`${API_URL}/api/history/workflows/`)
                ]);

                const parseResponse = async (res) => {
                    if (res.status === 'fulfilled' && res.value.ok) {
                        const data = await res.value.json();
                        return Array.isArray(data) ? data : data.results || [];
                    }
                    return [];
                };

                const imagesData = await parseResponse(imagesRes);
                const editsData = await parseResponse(editsRes);
                const workflowsData = await parseResponse(workflowsRes);

                setStats({
                    images: imagesData.length || 0,
                    edits: editsData.length || 0,
                    projects: workflowsData.length || 0
                });

                setRecentImages(imagesData.slice(0, 4));
            } catch (err) {
                console.error("Dashboard data fetch failed:", err);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        return 'Evening';
    };

    const statCards = [
        { label: 'Images Restored', value: stats.images, icon: ImageIcon, color: 'var(--accent)' },
        { label: 'AI Enhancements', value: stats.edits, icon: Sparkles, color: '#5856D6' },
        { label: 'Active Projects', value: stats.projects, icon: FolderOpen, color: '#FF9500' }
    ];

    const actions = [
        { title: 'Restore Photo', desc: 'Neural Engine Restoration', link: '/app/restoration', icon: Wand2, color: '#FF2D55' },
        { title: 'Batch Process', desc: 'Optimize Mass Library', link: '/app/batch', icon: Layers, color: 'var(--accent)' },
        { title: 'History', desc: 'Audit Your Activity', link: '/app/history', icon: Clock, color: '#AF52DE' },
        { title: 'AI News', desc: 'Latest Intelligence', link: '/ai-news', icon: TrendingUp, color: '#34C759' }
    ];

    if (statsLoading || authLoading) return <DashboardSkeleton />;

    return (
        <>
            {/* DESKTOP LAYOUT (Hidden on mobile) */}
            <motion.div
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:block w-full h-full min-h-screen"
                style={{ padding: 'clamp(20px, 4vw, 40px)', backgroundColor: 'var(--bg-primary)' }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* ─────────── Header Section ─────────── */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                <Text as="span" variant="caption" tone="accent" className="font-extrabold uppercase tracking-[0.2em]">
                                    Good {getGreeting()}
                                </Text>
                                <Text as="h1" variant="largeTitle" tone="primary" className="mt-1 font-black">
                                    {user?.user_metadata?.username || user?.email?.split('@')[0] || 'FixPixer'}
                                    <span className="ml-2">👋</span>
                                </Text>
                            </motion.div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to="/app/restoration">
                                <motion.button
                                    whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className="transition-all duration-300"
                                    style={{
                                        height: '52px', padding: '0 28px', borderRadius: 'var(--radius-full)', fontWeight: 700,
                                        background: 'var(--accent)', color: 'white', border: 'none',
                                        boxShadow: 'var(--depth-2)', display: 'flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    <Sparkles size={18} /> New Creation
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* ─────────── Quick Stats ─────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {statCards.map((stat, i) => (
                            <GlassCard key={i} hover={false} style={{ padding: '32px' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                                        <stat.icon size={22} style={{ color: stat.color }} strokeWidth={2.5} />
                                    </div>
                                    <TrendingUp size={16} className="text-text-tertiary" />
                                </div>
                                <Text as="div" variant="title1" tone="primary" className="font-black">
                                    <AnimatedCounter value={stat.value} />
                                </Text>
                                <Text as="div" variant="caption" tone="secondary" className="font-bold uppercase tracking-[0.2em]">
                                    {stat.label}
                                </Text>
                            </GlassCard>
                        ))}
                        
                        <GlassCard hover={true} className="cursor-pointer" onClick={() => navigate('/app/pricing')} style={{ padding: '32px', border: isSubscribed ? '1px solid var(--accent-transparent)' : '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center bg-accent/10">
                                    <Crown size={22} className="text-accent" strokeWidth={2.5} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                                    isElite ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                                    isPro ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 
                                    'bg-[var(--fill-secondary)] text-[var(--text-secondary)]'
                                }`}>
                                    {plan}
                                </span>
                            </div>
                            <Text as="div" variant="title2" tone="primary" className="font-black mb-1">
                                AI Subscription
                            </Text>
                            <div className="flex items-center gap-2 text-ios-subhead font-bold text-accent uppercase tracking-[0.15em]">
                                {isElite ? 'Elite Access Active' : isPro ? 'Pro Access Active' : 'Upgrade Plan'} <ArrowRight size={12} />
                            </div>
                        </GlassCard>
                    </div>

                    {/* ─────────── Intelligence Hub (Actions) ─────────── */}
                    <div className="mb-14">
                        <Text as="h2" variant="title2" tone="primary" className="mb-6 font-extrabold">
                            Intelligence Hub
                        </Text>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {actions.map((action, i) => (
                                <Link key={i} to={action.link}>
                                    <GlassCard className="h-full">
                                        <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-6" style={{
                                            background: `linear-gradient(135deg, ${action.color}20 0%, ${action.color}40 100%)`,
                                        }}>
                                            <action.icon size={26} style={{ color: action.color }} />
                                        </div>
                                        <Text as="h3" variant="headline" tone="primary" className="font-extrabold mb-1">
                                            {action.title}
                                        </Text>
                                        <Text as="p" variant="footnote" tone="secondary" className="font-medium leading-snug">
                                            {action.desc}
                                        </Text>
                                    </GlassCard>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ─────────── Recent Artifacts ─────────── */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <Text as="h2" variant="title2" tone="primary" className="font-extrabold">
                                Recent Artifacts
                            </Text>
                            <Link to="/app/history" className="flex items-center gap-2 text-xs font-black uppercase tracking-wide no-underline transition-transform hover:translate-x-1" style={{ color: 'var(--accent)' }}>
                                Full History <ArrowRight size={14} />
                            </Link>
                        </div>

                        <AnimatePresence mode="wait">
                            {statsLoading ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="animate-pulse rounded-[var(--radius-xl)] aspect-[4/5]" style={{ background: 'var(--fill-secondary)' }} />
                                    ))}
                                </div>
                            ) : recentImages.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {recentImages.map((img, i) => (
                                        <GlassCard key={img.id} style={{ padding: '12px' }}>
                                            <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden mb-3 bg-fill-tertiary">
                                                <img src={img.processed_image || img.original_image || img.url} alt="Recent" loading="lazy" decoding="async" className="w-full h-auto min-h-full object-cover transition-all duration-700 group-hover:scale-110" />
                                                <div className="absolute top-3 right-3 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-[var(--radius-sm)] text-xs text-white font-bold border border-white/20 shadow-lg">
                                                    ID: {img.id.slice(0, 4)}
                                                </div>
                                            </div>
                                            <div className="px-1 py-1">
                                                <Text as="p" variant="subhead" tone="primary" className="font-extrabold truncate">
                                                    {img.original_name || 'Neural Gen'}
                                                </Text>
                                                <Text as="p" variant="caption" tone="tertiary" className="font-semibold">
                                                    {new Date(img.created_at).toLocaleDateString()}
                                                </Text>
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>
                            ) : (
                                <GlassCard hover={false} className="flex flex-col items-center justify-center text-center" style={{ padding: '80px 20px' }}>
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[var(--fill-secondary)] border border-[var(--border-subtle)]">
                                        <Layout size={32} className="text-text-tertiary" />
                                    </div>
                                    <Text as="h3" variant="title3" tone="primary" className="font-black mb-2">
                                        Clean Slate
                                    </Text>
                                    <Text as="p" variant="subhead" tone="secondary" className="mb-8 max-w-[380px] font-semibold">
                                        Your neural workspace is ready. Upload a photo or generate a new artifact to begin your history.
                                    </Text>
                                    <Link to="/app/restoration">
                                        <motion.button
                                            whileHover={{ y: -2, scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            className="transition-all duration-300"
                                            style={{ height: '48px', padding: '0 32px', borderRadius: 'var(--radius-full)', background: 'var(--text-main)', color: 'var(--bg-primary)', fontWeight: 800, border: 'none', shadow: 'var(--depth-2)' }}
                                        >
                                            Initiate Workspace
                                        </motion.button>
                                    </Link>
                                </GlassCard>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* MOBILE LAYOUT (Hidden on desktop) */}
            <div className="md:hidden w-full min-h-screen pb-32 bg-[#f5f5f7] dark:bg-[#0a0a0c] overflow-x-hidden">
                {/* 1. UNIFIED PREMIUM HEADER */}
                <PremiumMobileHeader
                    showBack={false}
                    title={`Good ${getGreeting()}`}
                    rightElement={
                        <div className="flex items-center gap-2 flex-nowrap">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center text-gray-800 dark:text-gray-200"
                                onClick={() => setMobileSidebarOpen(true)}
                                aria-label="Open dashboard menu"
                                aria-expanded={isMobileSidebarOpen}
                            >
                                <Menu size={20} strokeWidth={2.5} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center text-gray-800 dark:text-gray-200"
                                onClick={() => navigate('/app/history')}
                                aria-label="Go to history"
                            >
                                <Clock size={20} strokeWidth={2.5} />
                            </motion.button>
                        </div>
                    }
                />

                <AnimatePresence>
                    {isMobileSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-sm"
                                onClick={() => setMobileSidebarOpen(false)}
                            />
                            <motion.aside
                                initial={{ x: -24, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -24, opacity: 0 }}
                                className="mobile-sidebar-drawer fixed left-0 top-0 z-[91] h-dvh w-[min(86vw,320px)] max-w-[320px] bg-[var(--surface-elevated)] border-r border-[var(--border-subtle)] p-3.5 pt-[max(12px,env(safe-area-inset-top))] pb-[max(12px,env(safe-area-inset-bottom))] overflow-y-auto"
                            >
                                <div className="flex items-center justify-between mb-3.5">
                                    <h3 className="text-sm md:text-base lg:text-lg font-black text-[var(--text-primary)] tracking-tight">Dashboard Menu</h3>
                                    <button
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className="w-9 h-9 rounded-xl bg-[var(--fill-secondary)] flex items-center justify-center text-[var(--text-primary)]"
                                        aria-label="Close dashboard menu"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
                                    {[
                                        { label: 'Dashboard', to: '/app' },
                                        { label: 'Editor', to: '/app/restoration' },
                                        { label: 'History', to: '/app/history' },
                                        { label: 'Projects', to: '/app/projects' },
                                        { label: 'Pricing', to: '/app/pricing' },
                                    ].map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => { setMobileSidebarOpen(false); navigate(item.to); }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl bg-[var(--fill-secondary)] text-[var(--text-primary)] text-sm md:text-base lg:text-lg font-bold tracking-tight"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* 2. PREMIUM HERO SECTION */}
                <div className="px-4 sm:px-5 mt-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full rounded-[30px] overflow-hidden p-5 sm:p-6 shadow-xl shadow-accent/20"
                        style={{
                            background: 'linear-gradient(135deg, var(--accent) 0%, #0051A8 100%)',
                        }}
                    >
                        <div className="relative z-10">
                            <Text as="h2" variant="title1" tone="inverse" className="font-black mb-2">
                                Hello, {user?.user_metadata?.username?.split(' ')[0] || user?.email?.split('@')[0] || 'FixPixer'} 👋
                            </Text>
                            <Text as="p" variant="body" tone="inverse" className="font-semibold text-white/80 mb-5 sm:mb-6 max-w-[280px]">
                                Your neural workspace is ready for perfection.
                            </Text>

                            <Link to="/app/restoration">
                                <motion.div whileTap={{ scale: 0.94 }} className="bg-white text-accent px-6 h-11 sm:h-12 rounded-[18px] inline-flex items-center justify-center font-black text-sm md:text-base lg:text-lg gap-2.5 shadow-xl shadow-black/10">
                                    <Sparkles size={18} strokeWidth={2.8} />
                                    <span>Start Project</span>
                                </motion.div>
                            </Link>
                        </div>

                        <motion.div
                            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 -bottom-8 p-4 opacity-20 pointer-events-none"
                        >
                            <Wand2 size={180} color="white" strokeWidth={1} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* 3. QUICK ACTIONS - REFINED CAROUSEL */}
                <div className="mt-7">
                    <div className="px-4 sm:px-5 mb-3.5 flex flex-wrap items-center justify-between gap-2">
                        <Text as="h2" variant="title3" tone="primary" className="font-black">
                            Quick Actions
                        </Text>
                    </div>
                    <div className="px-4 sm:px-5 pb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { name: 'Face Restore', icon: ScanFace, color: '#0A84FF', desc: 'Enhance Portraits' },
                            { name: 'Super Res', icon: Layers, color: '#5856D6', desc: '4K Upscaling' },
                            { name: 'Remove BG', icon: Eraser, color: '#FF2D55', desc: 'Auto Cutout' },
                            { name: 'AI Filters', icon: Sparkles, color: '#AF52DE', desc: 'Cinematic Looks' }
                        ].map((action, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.05) }}
                            >
                                <Link to="/app/restoration" className="w-full">
                                    <motion.div className="touch-scale mobile-card p-4 flex flex-col items-center justify-center text-center min-h-[118px] w-full">
                                        <div className="w-[50px] h-[50px] rounded-2xl flex items-center justify-center mb-3.5 transition-transform group-active:scale-90"
                                            style={{ background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)` }}>
                                            <action.icon size={26} color={action.color} strokeWidth={2.2} />
                                        </div>
                                        <Text as="span" variant="subhead" tone="primary" className="font-black mb-0.5 leading-tight">
                                            {action.name}
                                        </Text>
                                        <Text as="span" variant="caption" tone="tertiary" className="font-bold uppercase tracking-[0.15em]">
                                            {action.desc}
                                        </Text>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. NEURAL FEATURES - PREMIUM GRID */}
                <div className="px-4 sm:px-5 mt-10">
                    <div className="px-1 mb-4">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <Text as="h2" variant="title3" tone="primary" className="font-black">
                                Neural Hub
                            </Text>
                            <div className="px-2.5 py-0.5 rounded-lg bg-accent/90 text-white text-ios-caption font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 backdrop-blur-md">
                                {plan}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { name: 'Magic Eraser', icon: Eraser, color: '#FF9500' },
                            { name: 'Change BG', icon: FileImage, color: '#34C759' },
                            { name: 'Style Art', icon: PenTool, color: '#AF52DE' },
                            { name: 'Text to Gen', icon: Type, color: '#0A84FF' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.08) }}
                            >
                                <Link to="/app/restoration">
                                    <motion.div className="touch-scale mobile-card p-4 flex flex-wrap items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}05)` }}>
                                            <feature.icon size={22} color={feature.color} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col">
                                            <Text as="span" variant="subhead" tone="primary" className="font-black leading-tight">
                                                {feature.name}
                                            </Text>
                                            <Text as="span" variant="caption" tone="accent" className="font-black uppercase tracking-[0.15em] opacity-85">
                                                Neural Engine
                                            </Text>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 5. RECENT WORK - HIGH END PREVIEW */}
                <div className="mt-10 mb-10">
                    <div className="px-4 sm:px-5 mb-4 flex flex-wrap items-center justify-between gap-2">
                        <Text as="h2" variant="title3" tone="primary" className="font-black">
                            Recent Work
                        </Text>
                        <Link to="/app/history" className="text-xs font-black text-accent uppercase tracking-[0.15em] bg-accent/5 backdrop-blur-xl px-4 py-2 rounded-xl active:scale-92 transition-all no-underline border border-accent/10 shadow-sm">
                            See All
                        </Link>
                    </div>
                    {statsLoading ? (
                        <div className="px-4 sm:px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
                            {[1, 2, 3].map(i => <div key={i} className="w-full h-[220px] neural-skeleton shadow-sm rounded-[28px]"></div>)}
                        </div>
                    ) : recentImages.length > 0 ? (
                        <div className="px-4 sm:px-5 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {recentImages.map((img) => (
                                <Link key={img.id} to="/app/restoration" className="w-full no-underline">
                                    <motion.div className="touch-scale rounded-[28px] overflow-hidden bg-white dark:bg-white/5 min-h-[220px] h-full relative shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10">
                                        <img src={img.processed_image || img.original_image || img.url} alt="Recent" loading="lazy" decoding="async" className="w-full h-auto min-h-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent pt-10">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"></div>
                                                <Text as="span" variant="caption" tone="inverse" className="font-black uppercase tracking-[0.15em]">
                                                    Neural Masterpiece
                                                </Text>
                                            </div>
                                            <Text as="p" variant="subhead" tone="inverse" className="font-black truncate leading-tight mb-1">
                                                {img.original_name?.split('.')[0] || 'AI Generated Artifact'}
                                            </Text>
                                            <Text as="p" variant="caption" tone="inverse" className="font-bold uppercase tracking-[0.12em] text-white/75">
                                                {new Date(img.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </Text>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 sm:px-5">
                            <div className="w-full py-10 text-center mobile-card rounded-[32px] border-dashed border-2 border-gray-200 dark:border-white/5">
                                <Text as="p" variant="body" tone="tertiary" className="font-semibold">
                                    Your neural history begins here.
                                </Text>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );

};

export default DashboardPage;
