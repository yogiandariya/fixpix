import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authenticatedFetch } from '../lib/authFetch';
import {
    Image as ImageIcon, Wand2, MessageSquare, Workflow,
    RotateCcw, Trash2, Clock, Inbox, X, ExternalLink,
    Calendar, Activity, Sparkles, Search, ChevronDown,
    ArrowRight, Loader2, ShieldCheck, Database, Zap, Eye
} from 'lucide-react';
import PremiumMobileHeader from '../components/layout/PremiumMobileHeader';
import { HistorySkeleton } from '../components/ui/Skeleton';

/* ─── Modern Aesthetics ─── */
const TYPE_COLORS = {
    image:    { primary: 'var(--accent)',  bg: 'var(--accent-transparent)', iconBg: 'bg-blue-500/10' },
    edit:     { primary: '#34C759', bg: 'rgba(52,199,89,0.08)',  iconBg: 'bg-green-500/10' },
    chat:     { primary: '#AF52DE', bg: 'rgba(175,82,222,0.08)', iconBg: 'bg-purple-500/10' },
    workflow: { primary: '#FF9500', bg: 'rgba(255,149,0,0.08)',  iconBg: 'bg-orange-500/10' },
};

/* ─── Components ─── */

const StatCard = ({ icon: Icon, count, label, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="flex-1 min-w-[140px] md:min-w-[160px] p-4 md:p-6 rounded-[var(--radius-xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] relative overflow-hidden group"
    >
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center bg-[var(--fill-secondary)] text-[var(--text-secondary)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Live</div>
            </div>
            <div className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-none tracking-tighter mb-1" style={{ letterSpacing: 'var(--tracking-tighter)' }}>
                {count}
            </div>
            <div className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest" style={{ letterSpacing: 'var(--tracking-widest)' }}>
                {label}
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Icon size={80} />
        </div>
    </motion.div>
);

const HistoryCard = ({ item, index, onClick, onDelete }) => {
    const config = TYPE_COLORS[item.type] || TYPE_COLORS.image;
    const thumb = item.processed_image || item.output_url || item.original_image;
    const original = item.original_image;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(item)}
            className="group relative flex flex-wrap md:flex-nowrap items-stretch gap-4 md:gap-6 p-4 md:p-5 rounded-[var(--radius-2xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-soft)] transition-all duration-300 cursor-pointer hover:shadow-[var(--depth-2)] overflow-hidden"
        >
            {/* Visual Preview Section */}
            <div className="relative w-full max-w-[180px] h-28 md:w-32 md:h-32 shrink-0 rounded-[var(--radius-xl)] overflow-hidden shadow-sm border border-[var(--border-subtle)] bg-[var(--fill-secondary)]">
                <AnimatePresence mode="wait">
                    {isHovered && original && thumb ? (
                        <motion.div 
                            key="comparison"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex"
                        >
                            <img src={original} alt="Before" loading="lazy" decoding="async" className="w-1/2 h-auto min-h-full object-cover grayscale opacity-60" />
                            <div className="w-[1px] h-full bg-white/20 z-10" />
                            <img src={thumb} alt="After" loading="lazy" decoding="async" className="w-1/2 h-auto min-h-full object-cover" />
                        </motion.div>
                    ) : (
                        <motion.div key="main" className="w-full h-full">
                            {thumb ? (
                                <img src={thumb} alt="" loading="lazy" decoding="async" className="w-full h-auto min-h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${config.primary}, ${config.primary}dd)` }}>
                                    {item.type === 'chat' ? <MessageSquare size={32} /> : <ImageIcon size={32} />}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Status Badge Over Image */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                    {item.type}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center flex-wrap gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.primary }} />
                        <span className="text-[11px] font-black text-[var(--accent)] uppercase tracking-widest" style={{ letterSpacing: 'var(--tracking-widest)' }}>
                            {item.tool_name || item.type}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-[var(--text-tertiary)] opacity-30" />
                        <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">
                            {item.date ? new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                        </span>
                    </div>
                </div>
                
                <h4 className="text-sm md:text-base lg:text-lg font-black text-[var(--text-primary)] truncate tracking-tighter leading-tight mb-2" style={{ letterSpacing: 'var(--tracking-tighter)' }}>
                    {item.title || item.original_name || (item.type === 'edit' ? item.tool_type?.replace('_', ' ') : 'Neural Intelligence Render')}
                </h4>
                
                <div className="flex items-center gap-3">
                    <p className="text-sm md:text-base lg:text-lg font-semibold text-[var(--text-secondary)] truncate flex-1" style={{ letterSpacing: 'var(--tracking-tight)' }}>
                        {item.message || (item.parameters && typeof item.parameters === 'object' ? Object.entries(item.parameters).map(([k,v]) => `${k}: ${v}`).join(', ') : 'Pixel-perfect enhancement complete.')}
                    </p>
                </div>
                
                <div className="mt-4 flex items-center flex-wrap gap-3 md:gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)] text-white text-[11px] font-bold shadow-lg shadow-[var(--accent-soft)]">
                        <Eye size={12} /> View Details
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id, item.type); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fill-secondary)] text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors text-[11px] font-bold"
                    >
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            </div>

            {/* Side Action Icon */}
            <div className="flex items-center pr-2 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all">
                <ArrowRight size={20} />
            </div>
        </motion.div>
    );
};

/* ─── Main Page ─── */
const HistoryPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const fetchEndpoint = async (path) => {
                try {
                    const res = await authenticatedFetch(`${API_URL}${path}`);
                    if (!res.ok) return [];
                    const data = await res.json();
                    return Array.isArray(data) ? data : (data.results || []);
                } catch (e) { return []; }
            };

            const [edits, images, chats] = await Promise.all([
                fetchEndpoint('/api/history/edits/'),
                fetchEndpoint('/api/images/'),
                fetchEndpoint('/api/history/chat/')
            ]);

            const combined = [
                ...edits.map(e => ({ ...e, type: 'edit', date: e.created_at })),
                ...images.map(i => ({ ...i, type: 'image', date: i.created_at })),
                ...chats.map(c => ({ ...c, type: 'chat', date: c.timestamp || c.created_at }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date));

            setHistory(combined);
        } catch (err) {
            console.error('History load failed:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (id, type) => {
        if (!window.confirm('Delete this from Neural History?')) return;
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const endpoint = (type === 'image') ? `/api/images/${id}/` : (type === 'edit' ? `/api/history/edits/${id}/` : `/api/history/chat/${id}/`);
            const res = await authenticatedFetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
            if (res.ok) setHistory(prev => prev.filter(item => item.id !== id));
        } catch (err) { console.error('Delete failed:', err); }
    };

    const filtered = useMemo(() => {
        return history.filter(item => {
            const matchesSearch = (item.title || item.original_name || item.message || '').toLowerCase().includes(search.toLowerCase());
            const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [history, search, activeFilter]);

    const filterOptions = useMemo(() => ['all', 'edit', 'image', 'chat'], []);

    const stats = useMemo(() => ({
        total: history.length,
        edits: history.filter(h => h.type === 'edit').length,
        images: history.filter(h => h.type === 'image').length,
        chats: history.filter(h => h.type === 'chat').length
    }), [history]);

    const grouped = useMemo(() => {
        const groups = {};
        filtered.forEach(item => {
            const d = new Date(item.date);
            const dateStr = d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
            const today = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = yesterday.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
            const label = dateStr === today ? 'Today' : (dateStr === yestStr ? 'Yesterday' : dateStr);
            if (!groups[label]) groups[label] = [];
            groups[label].push(item);
        });
        return groups;
    }, [filtered]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-36 md:pb-32 overflow-x-hidden">
            <PremiumMobileHeader title="Neural Timeline" />
            
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-6 md:pt-20">
                {/* Header Header */}
                <div className="mb-10 relative">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6 md:gap-12"
                    >
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                                </span>
                                <span className="text-[12px] font-black text-[var(--accent)] uppercase tracking-[0.3em] font-mono">Archive Active.v2</span>
                            </div>
                            <h1 className="text-[48px] sm:text-[64px] md:text-[84px] font-black text-[var(--text-primary)] tracking-tight leading-[0.85] mb-5 md:mb-8" style={{ letterSpacing: '-0.04em' }}>
                                NEURAL<br />TIMELINE
                            </h1>
                            <p className="text-sm md:text-base lg:text-lg font-medium text-[var(--text-secondary)] leading-relaxed max-w-[480px]">
                                Your private persistent cloud representing every pixel enhanced, every thought generated, and every neural milestone reached.
                            </p>
                        </div>
                        
                            <div className="flex flex-col gap-3.5 w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" size={22} />
                                <input 
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search archive..." 
                                    className="h-16 md:h-18 pl-14 md:pl-16 pr-6 md:pr-8 rounded-[var(--radius-2xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] outline-none focus:ring-4 focus:ring-[var(--accent-soft)] transition-all w-full md:min-w-[320px] text-sm md:text-base lg:text-lg font-bold shadow-[var(--depth-1)]"
                                />
                            </div>
                            <div className="flex items-center flex-wrap gap-2 md:gap-3">
                                {filterOptions.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`h-11 md:h-12 px-3 md:px-4 rounded-[var(--radius-xl)] text-[11px] md:text-[12px] font-black uppercase tracking-widest transition-all ${
                                            activeFilter === f 
                                            ? 'bg-[var(--accent)] text-white shadow-lg' 
                                            : 'bg-[var(--surface-elevated)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--accent-soft)]'
                                        }`}
                                    >
                                        {f === 'all' ? 'All' : f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-20">
                     <StatCard icon={Zap} count={stats.total} label="Total Actions" color="var(--accent)" delay={0.1} />
                     <StatCard icon={Sparkles} count={stats.edits} label="Smart Edits" color="#34C759" delay={0.2} />
                     <StatCard icon={ImageIcon} count={stats.images} label="Media Vault" color="#007AFF" delay={0.3} />
                     <StatCard icon={MessageSquare} count={stats.chats} label="AI Queries" color="#AF52DE" delay={0.4} />
                </div>

                {/* Main Timeline Section */}
                <div className="relative">
                    {/* Immersive Background Rail */}
                    <div className="absolute left-[38px] top-6 bottom-0 w-[4px] bg-[var(--fill-secondary)] rounded-full hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)] via-[var(--accent-soft)] to-transparent opacity-40 rounded-full" />
                    </div>

                    {loading ? (
                        <HistorySkeleton />
                    ) : Object.entries(grouped).length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-40 rounded-[var(--radius-3xl)] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-elevated)]/50"
                        >
                            <div className="w-24 h-24 rounded-full bg-[var(--fill-secondary)] flex items-center justify-center mx-auto text-[var(--text-tertiary)] mb-8">
                                <Inbox size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic mb-3">Timeline is Void</h3>
                            <p className="text-[var(--text-secondary)] font-bold mb-8">No records matching your filters were detected in the cloud.</p>
                            <button onClick={() => navigate('/app/restoration')} className="px-8 py-4 bg-[var(--accent)] text-white rounded-[var(--radius-xl)] font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[var(--accent-soft)] active:scale-95 transition-all">Start Your First Action</button>
                        </motion.div>
                    ) : (
                        <div className="space-y-12 md:space-y-24">
                            {Object.entries(grouped).map(([label, items], gIdx) => (
                                <div key={label} className="relative">
                                    <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-12">
                                        <div className="flex items-center justify-center w-[80px] shrink-0 hidden md:flex">
                                            <div className="w-6 h-6 rounded-full border-[5px] border-[var(--bg-primary)] bg-[var(--accent)] shadow-[0_0_15px_var(--accent-soft)] z-20" />
                                        </div>
                                        <div className="flex items-end flex-wrap gap-2 md:gap-4">
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tighter">{label}</h2>
                                            <span className="text-[11px] md:text-[13px] font-black text-[var(--accent)] opacity-50 mb-1 uppercase tracking-widest">{items.length} records</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4 md:gap-6 pl-0 md:pl-28">
                                        {items.map((item, idx) => (
                                            <HistoryCard 
                                                key={item.id + item.type} 
                                                item={item} 
                                                index={idx}
                                                onClick={(it) => navigate('/app/restoration', { state: { reuseItem: it } })}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
