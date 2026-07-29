import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ImageContext } from '../context/ImageContext';
import { useAuth } from '../context/AuthContext';
import useCanvasStore from '../store/canvasStore';
import { authenticatedFetch } from '../lib/authFetch';
import { apiEndpoints } from '../lib/api';
import PremiumMobileHeader from '../components/layout/PremiumMobileHeader';
import {
    Calendar, Upload, Search,
    Plus, Image as ImageIcon,
    Sparkles, Trash2, Play,
    LayoutGrid, List, Eye,
    ShieldCheck, Database
} from 'lucide-react';
import { ProjectsPageSkeleton } from '../components/ui/Skeleton';

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS & ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24
        }
    }
};

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

const StatBlock = ({ icon: Icon, label, value, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-center gap-4 md:gap-5 py-3 px-4 md:py-3.5 md:px-6 rounded-[var(--radius-xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] backdrop-blur-xl shadow-[var(--depth-1)]"
    >
        <div className="w-11 h-11 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={20} strokeWidth={2.5} />
        </div>
        <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-0.5" style={{ letterSpacing: 'var(--tracking-widest)' }}>
                {label}
            </div>
            <div className="text-xl md:text-2xl font-black text-[var(--text-primary)] leading-none" style={{ letterSpacing: 'var(--tracking-tighter)' }}>
                {value}
            </div>
        </div>
    </motion.div>
);

const ProjectCard = ({ project, onClick, onDelete, index }) => {
    const [hovered, setHovered] = useState(false);
    const imgSrc = project.processed_image || project.original_image;
    
    // Format date nicely
    const date = new Date(project.created_at);
    const formattedDate = date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });

    return (
        <motion.div
            variants={itemVariants}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            className="group relative flex flex-col h-full cursor-pointer"
        >
            <div className="relative aspect-[1/1] rounded-[var(--radius-xl)] overflow-hidden bg-[var(--fill-secondary)] border border-[var(--border-subtle)] shadow-[var(--glass-shadow)] transition-all duration-500 group-hover:shadow-[var(--depth-3)] group-hover:scale-[1.02] group-hover:-translate-y-1">
                {/* Image */}
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto min-h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={32} strokeWidth={1} />
                        <span className="text-[10px] uppercase font-black tracking-widest">No Preview</span>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${
                        project.status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white animate-pulse'
                    }`}>
                        {project.status || 'Active'}
                    </div>
                </div>

                {/* Quick Actions Float */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                        className="w-10 h-10 rounded-[var(--radius-md)] bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-colors border border-white/20"
                    >
                        <Trash2 size={18} />
                    </button>
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--text-primary)] flex items-center justify-center shadow-lg backdrop-blur-md border border-[var(--border-subtle)]">
                        <Eye size={18} />
                    </div>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-xl shadow-[var(--accent-soft)]">
                                <Play size={14} strokeWidth={3} fill="currentColor" />
                            </div>
                            <span className="text-white text-[13px] font-black uppercase tracking-widest" style={{ letterSpacing: 'var(--tracking-widest)' }}>Load Artifact</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title & Date Section Below Image */}
            <div className="mt-5 px-1">
                <h3 className="text-base md:text-lg lg:text-xl font-black text-[var(--text-primary)] line-clamp-1 leading-tight tracking-tighter mb-1.5 group-hover:text-[var(--accent)] transition-colors" style={{ letterSpacing: 'var(--tracking-tight)' }}>
                    {project.title || 'Neural Record'}
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] font-bold text-[11px] uppercase tracking-tight">
                        <Calendar size={13} strokeWidth={2.5} />
                        {formattedDate}
                    </div>
                    <span className="text-[11px] font-black text-[var(--accent)] uppercase tracking-widest opacity-80" style={{ letterSpacing: 'var(--tracking-widest)' }}>
                        {project.processing_type || 'Restoration'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════ */
const EmptyState = ({ onUpload }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
        <div className="relative mb-10">
            <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-36 h-36 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-2xl shadow-[var(--accent-soft)] border border-white/20"
            >
                <Database size={64} strokeWidth={1} className="text-white" />
            </motion.div>
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-3 -right-3 w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-2xl flex items-center justify-center"
            >
                <Plus size={28} className="text-[var(--accent)]" strokeWidth={3} />
            </motion.div>
        </div>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[var(--text-primary)] tracking-tighter mb-4 leading-tight" style={{ letterSpacing: 'var(--tracking-tighter)' }}>
            The Neural Vault is Empty
        </h2>
        <p className="text-[var(--text-secondary)] max-w-sm mx-auto font-semibold mb-10 md:mb-12 leading-relaxed text-sm md:text-base lg:text-lg">
            Every restoration begins with an ingest. Upload your first photo to store it in our high-integrity neural vault.
        </p>

        <label className="cursor-pointer group">
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => { if (e.target.files[0]) onUpload(e.target.files[0]); }} 
            />
            <motion.div
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 md:px-10 py-4 md:py-5 rounded-[var(--radius-full)] bg-[var(--accent)] text-white text-sm md:text-base lg:text-lg font-black tracking-tight flex items-center gap-3 shadow-2xl shadow-[var(--accent-soft)] group-hover:bg-[var(--accent-hover)] transition-all border-none"
            >
                <Upload size={24} strokeWidth={3} />
                Ingest Neural Data
            </motion.div>
        </label>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
const ProjectsPage = () => {
    const { fetchProjects, loadProject } = useContext(ImageContext);
    const { user } = useAuth();
    const setOriginalImage = useCanvasStore(state => state.setOriginalImage);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Note: fetchProjects now handles paginated responses from Django by returning results || []
            const data = await fetchProjects();
            setProjects(Array.isArray(data) ? data : (data?.results || []));
        } catch (err) {
            console.error('Vault load failed:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchProjects]);

    useEffect(() => {
        if (user) loadData();
    }, [user, loadData]);

    const handleUpload = useCallback((file) => {
        setOriginalImage(file, 'legacy-upload');
        navigate('/app/restoration');
    }, [navigate, setOriginalImage]);

    const handleProjectClick = useCallback((project) => {
        loadProject(project);
        navigate('/app/restoration');
    }, [loadProject, navigate]);

    const handleDelete = useCallback(async (projectId) => {
        if (!window.confirm('Wipe this record from the neural vault forever?')) return;
        
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await authenticatedFetch(`${API_URL}/api/images/${projectId}/`, {
                method: 'DELETE'
            });

            if (response.ok || response.status === 204) {
                setProjects(prev => prev.filter(p => p.id !== projectId));
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    }, []);

    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return projects;
        return projects.filter(p => 
            (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.processing_type || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    const stats = useMemo(() => ({
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        processed: projects.reduce((acc, p) => acc + (p.processed_image ? 1 : 0), 0)
    }), [projects]);

    if (loading) return <ProjectsPageSkeleton />;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0c] selection:bg-accent/20 pb-28 overflow-x-hidden"
        >
            <PremiumMobileHeader 
                title="Vault" 
                rightElement={
                    projects.length > 0 && (
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); }}
                            />
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/30 border border-white/20"
                            >
                                <Plus size={22} strokeWidth={3} />
                            </motion.div>
                        </label>
                    )
                }
            />

            <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pt-6 md:px-8 md:pt-16">
                
                {/* ── Desktop Header ── */}
                <div className="hidden md:flex flex-col gap-10 mb-12">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-[64px] font-black text-[var(--text-primary)] tracking-tighter leading-none italic" style={{ letterSpacing: 'var(--tracking-tighter)' }}>Vault</h1>
                                <div className="px-3 py-1.5 rounded-full bg-[var(--accent)] text-[11px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent-soft)]">Secure</div>
                            </div>
                            <p className="text-[18px] font-semibold text-[var(--text-secondary)] max-w-lg leading-relaxed">
                                High-integrity storage for your Neural Artifacts and processed intelligence. 
                                <span className="inline-flex items-center gap-1.5 ml-3 text-green-500 font-black uppercase text-[12px] tracking-widest">
                                    <ShieldCheck size={18} /> Encrypted
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <StatBlock icon={Database} label="Records" value={stats.total} color="var(--accent)" delay={0.1} />
                            <StatBlock icon={Sparkles} label="Enhanced" value={stats.processed} color="#AF52DE" delay={0.2} />
                        </div>
                   </div>

                    {/* Toolbar */}
                    {projects.length > 0 && (
                        <div className="flex items-center gap-4 py-2">
                            {/* Search */}
                            <div className="flex-1 relative flex items-center">
                                <Search size={18} className="absolute left-4 text-gray-400" strokeWidth={2.5} />
                                <input 
                                    type="text"
                                    placeholder="QUERY THE VAULT..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-accent/10 transition-all text-sm font-black uppercase tracking-widest text-gray-800 dark:text-white placeholder:text-gray-400"
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex p-1 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] h-14 shadow-sm">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`w-12 h-full rounded-[var(--radius-lg)] flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`w-12 h-full rounded-[var(--radius-lg)] flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>

                            {/* Ingest Button */}
                            <label className="cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); }} 
                                />
                                <motion.div
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="h-14 px-8 rounded-[var(--radius-xl)] bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center gap-3 text-[15px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all"
                                >
                                    <Plus size={20} strokeWidth={4} />
                                    Ingest Data
                                </motion.div>
                            </label>
                        </div>
                    )}
                </div>

                {/* ── Mobile Search Bar ── */}
                <div className="md:hidden mb-5">
                    <div className="relative flex items-center">
                        <Search size={16} className="absolute left-4 text-gray-500" strokeWidth={3} />
                        <input 
                            type="text"
                            placeholder="SEARCH VAULT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 bg-white dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-[18px] outline-none text-sm md:text-base lg:text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* ── Content Feed ── */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8"
                        >
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex flex-col animate-pulse">
                                    <div className="aspect-square rounded-[var(--radius-xl)] bg-[var(--fill-secondary)]" />
                                    <div className="mt-5 h-5 w-3/4 rounded bg-[var(--fill-secondary)]" />
                                    <div className="mt-3 h-3 w-1/2 rounded bg-[var(--fill-secondary)] opacity-50" />
                                </div>
                            ))}
                        </motion.div>
                    ) : projects.length === 0 ? (
                        <EmptyState onUpload={handleUpload} />
                    ) : (
                        <motion.div 
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={viewMode === 'grid' 
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 md:gap-x-8 gap-y-8 md:gap-y-12"
                                : "space-y-4"
                            }
                        >
                            {filteredProjects.map((project, index) => (
                                <ProjectCard 
                                    key={project.id || index}
                                    project={project}
                                    index={index}
                                    onClick={() => handleProjectClick(project)}
                                    onDelete={handleDelete}
                                />
                            ))}
                            
                            {/* Empty Result Search */}
                            {filteredProjects.length === 0 && searchQuery && (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-gray-300 dark:text-gray-700" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 italic">Query Null</h3>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">No neural artifact matches your search.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ProjectsPage;
