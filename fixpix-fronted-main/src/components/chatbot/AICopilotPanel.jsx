import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, AlertTriangle, Image as ImageIcon,
    CheckCircle, Wand2, ShieldCheck, X,
    Send, Zap, BarChart3, Tag, ArrowRight,
    RefreshCw, Info, Minimize2, Maximize2,
    Activity, ChevronDown, MessageSquare
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import useCanvasStore from '../../store/canvasStore';
import { RECIPES, getToolById } from '../../data/CommandRegistry';
import { FILTER_PRESETS } from '../../lib/filterEngine';
import './AICopilot.css';

const ScoreBar = ({ label, score, color }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-center px-0.5">
            <span className="text-[11px] font-semibold copilot-label uppercase tracking-wider">{label}</span>
            <span className="text-[11px] font-bold copilot-main transition-all duration-300">{score}%</span>
        </div>
        <div className="h-[4px] w-full vision-score-track rounded-full overflow-hidden relative">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                className={`h-full rounded-full relative z-10 bg-gradient-to-r ${color}`}
            />
        </div>
    </div>
);

const AICopilotPanel = ({ onClose }) => {
    const {
        aiInsights,
        analyzeImage,
        executeRecipe,
        processChatCommand,
        toggleCommand,
        triggerFeature,
        selectedImage
    } = useCommand();

    const isCopilotCollapsed = useCanvasStore(state => state.isCopilotCollapsed);
    const setIsCopilotCollapsed = useCanvasStore(state => state.setIsCopilotCollapsed);
    const isCopilotVisible = useCanvasStore(state => state.isCopilotVisible);
    const setIsCopilotVisible = useCanvasStore(state => state.setIsCopilotVisible);
    const isBrushMode = useCanvasStore(state => state.isBrushMode);
    const isCropMode = useCanvasStore(state => state.isCropMode);
    const zoom = useCanvasStore(state => state.zoom);

    // 🚀 UNIFIED PANEL STATE
    const panelState = aiInsights.analyzing ? 'loading' : 
                      (aiInsights.message && aiInsights.message.includes('Error') ? 'error' : 'ready');

    // Smart Fade logic
    const isInteracting = isBrushMode || isCropMode;

    // 🧠 Assistant Intelligence: Auto-collapse on high zoom
    useEffect(() => {
        if (zoom > 1.2 && !isCopilotCollapsed) {
            setIsCopilotCollapsed(true);
        }
    }, [zoom, isCopilotCollapsed, setIsCopilotCollapsed]);

    // 🧠 AI Intelligence Trigger
    useEffect(() => {
        if (!aiInsights.analyzed && !aiInsights.analyzing && selectedImage) {
            analyzeImage(selectedImage);
        }
    }, [selectedImage, aiInsights.analyzed, aiInsights.analyzing, analyzeImage]);

    const [activeTab, setActiveTab] = useState('insights'); 
    const [chatQuery, setChatQuery] = useState('');
    const chatEndRef = useRef(null);

    const [isAnimating, setIsAnimating] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleRefresh = (e) => {
        if (e) e.stopPropagation();
        analyzeImage(selectedImage);
    };

    const handleToggleCollapse = (collapse, e) => {
        if (e) e.stopPropagation();
        if (isAnimating || isExiting) return;
        setIsAnimating(true);
        setIsCopilotCollapsed(collapse);
        setTimeout(() => setIsAnimating(false), 250);
    };

    const handleFullClose = (e) => {
        if (e) e.stopPropagation();
        if (isAnimating || isExiting) return;

        setIsExiting(true);
        setIsCopilotVisible(false);
        setIsCopilotCollapsed(true);

        setTimeout(() => {
            if (onClose) onClose();
            setIsExiting(false);
        }, 250);
    };

    // FormattedMessage Parser (Upgraded for Advanced Markdown)
    const FormattedMessage = ({ text, sender }) => {
        if (!text) return null;
        if (sender === 'user') return <span>{text}</span>;
        
        const lines = text.split('\n');
        return (
            <div className="space-y-2">
                {lines.map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={idx} className="h-1" />;
                    
                    if (trimmed === '---') {
                        return <div key={idx} className="h-px bg-border-subtle my-4 opacity-40 w-full" />;
                    }

                    // Headers
                    if (trimmed.startsWith('## ')) {
                        return <h2 key={idx} className="text-[14px] font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2">{trimmed.slice(3)}</h2>;
                    }
                    if (trimmed.startsWith('### ')) {
                        return <h3 key={idx} className="text-[13px] font-semibold text-cyan-600 dark:text-cyan-400 mt-3 mb-1">{trimmed.slice(4)}</h3>;
                    }

                    // Lists
                    const isList = trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/);
                    
                    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                    const parsed = parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="font-semibold text-slate-800 dark:text-white">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    });

                    if (isList) {
                        return <div key={idx} className="text-[13px] leading-relaxed pl-3 border-l-2 border-cyan-500/20">{parsed}</div>;
                    }

                    return <p key={idx} className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{parsed}</p>;
                })}
            </div>
        );
    };

    const handleChatSubmit = (e) => {
        e?.preventDefault();
        if (!chatQuery.trim()) return;
        processChatCommand(chatQuery);
        setChatQuery('');
        if (activeTab !== 'chat') setActiveTab('chat');
    };

    const executeDynamicFix = () => {
        if (aiInsights.masterRecipe) {
            executeRecipe(aiInsights.masterRecipe);
            setIsCopilotCollapsed(true);
        }
    };


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiInsights.chatHistory, activeTab]);

    if (!aiInsights || (!aiInsights.analyzing && !aiInsights.analyzed)) {
        return null;
    }

    const {
        description, scene, scores, tags, issues, suggestedTools, authenticity, message
    } = aiInsights;

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };
    return (
        <AnimatePresence mode="wait">
            {!isExiting && (
                <>
                    {/* ── NEURAL TRIGGER BUTTON (Permanent Toggle) ── */}
                    <motion.button
                        key="neural-trigger"
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        whileHover={{ y: -2, scale: 1.05, boxShadow: 'var(--depth-2)' }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isCopilotCollapsed) {
                                setActiveTab('insights');
                                if (!aiInsights.analyzed && !aiInsights.analyzing && selectedImage) {
                                    analyzeImage(selectedImage);
                                }
                            }
                            setIsCopilotCollapsed(!isCopilotCollapsed);
                        }}
                        className="fixed top-[max(12px,env(safe-area-inset-top))] right-3 sm:right-4 md:right-8 h-10 md:h-11 px-4 md:px-6 rounded-full flex items-center justify-center gap-2.5 cursor-pointer z-[110] border border-[var(--border-subtle)] shadow-[var(--depth-1)] processing-pill-glow transition-all"
                        style={{
                            background: isCopilotCollapsed ? 'var(--surface-elevated)' : 'var(--accent)',
                            color: isCopilotCollapsed ? 'var(--text-primary)' : 'white',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        <Sparkles className={`w-4 h-4 ${isCopilotCollapsed ? 'text-[var(--accent)]' : 'text-white'} animate-pulse`} />
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ${isCopilotCollapsed ? 'text-[var(--text-primary)]' : 'text-white'}`} style={{ letterSpacing: 'var(--tracking-widest)' }}>
                            {isCopilotCollapsed ? 'Neural Insights' : 'Close Assistant'}
                        </span>
                    </motion.button>

                    {!isCopilotCollapsed && (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, x: 20, y: 4, scale: 0.98 }}
                            animate={{ opacity: isInteracting ? 0.3 : 1, x: 0, y: 0, scale: isInteracting ? 0.98 : 1 }}
                            exit={{ opacity: 0, x: 20, y: 4, scale: 0.98 }}
                            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                            className="fixed top-[calc(max(64px,env(safe-area-inset-top)+56px))] right-2 sm:right-3 md:right-[40px] w-[min(94vw,340px)] h-[min(74vh,580px)] md:h-[580px] flex flex-col z-[100] vision-glass-panel overflow-hidden"
                            style={{
                                pointerEvents: isInteracting ? 'none' : 'auto',
                            }}
                        >
                            <div className="studio-glass-header p-5 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]/50">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center text-white shadow-xl bg-gradient-to-br from-cyan-600 to-blue-600 shadow-cyan-500/20">
                                            <Sparkles size={26} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)] shadow-sm" style={{ backgroundColor: 'var(--surface)' }}>
                                            <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-[15px] flex items-center gap-2 mb-0.5 text-[var(--text-primary)]" style={{ letterSpacing: 'var(--tracking-tight)' }}>
                                            Assistant Hub
                                            <span className="px-2 py-0.5 rounded-[var(--radius-sm)] text-[8px] font-black uppercase tracking-widest bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">v2.0</span>
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--copilot-accent)' }}>
                                                <Activity size={10} className="animate-pulse" />
                                                Active • {activeTab === 'insights' ? 'Insights Mode' : 'AI Assistant'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => handleToggleCollapse(true, e)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 text-[var(--text-tertiary)] hover:text-red-500"
                                    >
                                        <X size={20} strokeWidth={2.5} />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="px-5 pt-4">
                                <div className="copilot-tabs flex gap-1 p-1 bg-[var(--fill-secondary)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)]">
                                    <button
                                        onClick={() => {
                                            setActiveTab('insights');
                                            if (!aiInsights.analyzed && !aiInsights.analyzing && selectedImage) {
                                                analyzeImage(selectedImage);
                                            }
                                        }}
                                        className={`flex-1 h-9 flex items-center justify-center gap-2 rounded-[calc(var(--radius-lg)-4px)] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'insights' ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        <BarChart3 size={13} />
                                        Insights
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('chat')}
                                        className={`flex-1 h-9 flex items-center justify-center gap-2 rounded-[calc(var(--radius-lg)-4px)] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        <MessageSquare size={13} />
                                        Chat
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-2">
                                {panelState === 'loading' ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-12 gap-5"
                                    >
                                        <div className="relative">
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute -inset-6 rounded-full border-2 border-dashed border-cyan-500/30" />
                                            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                                <Zap size={32} className="text-cyan-400 fill-cyan-400/20" />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[14px] copilot-main font-semibold m-0 tracking-tight">{message || "Analyzing Image DNA..."}</p>
                                            <p className="text-[10px] copilot-label font-medium mt-1 uppercase tracking-wider animate-pulse">Running Neural Vision Labs</p>
                                        </div>
                                    </motion.div>
                                ) : panelState === 'error' ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-5 text-center">
                                        <AlertTriangle size={48} className="text-red-500/80" />
                                        <p className="text-[14px] text-red-500 font-black m-0 tracking-tight">Analysis Failed</p>
                                    </div>
                                ) : activeTab === 'insights' ? (
                                    <motion.div key="insights" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        {/* SECTION 1: AI Image Summary */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between px-1">
                                                <h4 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Sparkles size={12} className="text-cyan-400" /> Image Summary
                                                </h4>
                                                <button 
                                                    onClick={handleRefresh}
                                                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group"
                                                    title="Re-analyze image"
                                                >
                                                    <RefreshCw size={12} className="text-[var(--text-tertiary)] group-hover:text-cyan-400 group-hover:rotate-180 transition-all duration-500" />
                                                </button>
                                            </div>
                                            <div className="vision-card p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                                <p className="text-[13px] leading-relaxed text-[var(--text-primary)] font-medium">
                                                    {aiInsights.summary || aiInsights.message || "Initializing neural scan..."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* SECTION 2: Key Analysis */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                                <BarChart3 size={14} className="text-blue-500" /> Key Analysis
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--fill-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 transition-all hover:border-[var(--accent)]/30 group/item">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)] opacity-60">Image Type</span>
                                                    <div className="flex items-center gap-2">
                                                        <ImageIcon size={14} className="text-cyan-500" />
                                                        <span className="text-[11px] font-bold text-[var(--text-primary)] capitalize">{aiInsights.type || "Scanning..."}</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--fill-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 transition-all hover:border-[var(--accent)]/30 group/item">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)] opacity-60">Detected Scene</span>
                                                    <div className="flex items-center gap-2">
                                                        <Activity size={12} className="text-blue-500" />
                                                        <span className="text-[11px] font-bold text-[var(--text-primary)] capitalize">{aiInsights.scene || "Analyzing..."}</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--fill-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 transition-all hover:border-[var(--accent)]/30 group/item">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)] opacity-60">Subjects Found</span>
                                                    <div className="flex gap-2">
                                                        <span className="px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[9px] font-black text-[var(--accent)]">{aiInsights.subjects?.people || 0}P</span>
                                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-black text-emerald-500">{aiInsights.subjects?.animals || 0}A</span>
                                                        <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-[9px] font-black text-orange-500">{aiInsights.subjects?.objects || 0}O</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--fill-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 transition-all hover:border-[var(--accent)]/30 group/item">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)] opacity-60">Detected Mood</span>
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles size={12} className="text-amber-500" />
                                                        <span className="text-[11px] font-bold text-[var(--text-primary)] capitalize">{aiInsights.mood || "Detecting..."}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quality Sub-grid */}
                                            <div className="mt-2 p-3 rounded-[var(--radius-md)] bg-[var(--fill-secondary)] border border-[var(--border-subtle)]">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Technical Quality</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-bold uppercase tracking-tighter text-[var(--text-tertiary)]">Sharpness</span>
                                                        <span className="text-[10px] font-black text-cyan-500 uppercase">{aiInsights.quality?.sharpness}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-bold uppercase tracking-tighter text-[var(--text-tertiary)]">Lighting</span>
                                                        <span className="text-[10px] font-black text-amber-500 uppercase">{aiInsights.quality?.lighting}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-bold uppercase tracking-tighter text-[var(--text-tertiary)]">Color</span>
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase">{aiInsights.quality?.color}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 3: Smart Recommendations */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                                <Zap size={14} className="text-amber-500" /> Smart Recommendations
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                {(aiInsights.recommendations || []).map((t, i) => {
                                                    const tool = getToolById(t.tool);
                                                    if (!tool) return null;
                                                    const IconComp = tool.icon || Wand2;
                                                    return (
                                                            <div key={i} className="space-y-4">
                                                                <motion.button 
                                                                    whileHover={{ scale: 1.01, x: 4 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => {
                                                                        triggerFeature(tool.id);
                                                                        setIsCopilotCollapsed(true);
                                                                    }} 
                                                                    className={`group flex items-center gap-4 border rounded-[var(--radius-lg)] p-4 transition-all w-full text-left shadow-sm ${
                                                                        tool.id === 'styleTransfer' 
                                                                        ? 'bg-gradient-to-r from-[var(--accent)]/10 to-transparent border-[var(--accent)]/30' 
                                                                        : 'bg-[var(--fill-secondary)] hover:bg-[var(--fill-tertiary)] border-[var(--border-subtle)] hover:border-[var(--accent)]/30'
                                                                    }`}
                                                                >
                                                                    <div className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center group-hover:scale-110 transition-transform ${
                                                                        tool.id === 'styleTransfer' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                                                    }`}>
                                                                        <IconComp size={18} />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1.5">
                                                                            <div className="font-black text-[13px] text-[var(--text-primary)] tracking-tight leading-none uppercase">{tool.label}</div>
                                                                            {tool.id === 'styleTransfer' && (
                                                                                <span className="bg-[var(--accent)] text-[8px] font-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest">Premium</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest opacity-80 leading-tight">{t.reason || "Improve quality"}</div>
                                                                    </div>
                                                                    <ArrowRight size={14} className="text-[var(--text-tertiary)] opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                                </motion.button>

                                                                {/* 🎨 PREMIUM FILTER STRIP (High Fidelity Preview) */}
                                                                {tool.id === 'styleTransfer' && (
                                                                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar px-1 -mx-1">
                                                                        {(t.presets || ['studio-light-pro', 'hdr-boost', 'film-look', 'dream-glow']).map(pid => {
                                                                            const allPresets = Object.values(FILTER_PRESETS).flat();
                                                                            const preset = allPresets.find(p => p.id === pid);
                                                                            if (!preset) return null;
                                                                            
                                                                            const thumbUrl = (selectedImage instanceof File || selectedImage instanceof Blob) 
                                                                                ? URL.createObjectURL(selectedImage) 
                                                                                : selectedImage;

                                                                            return (
                                                                                <motion.div
                                                                                    key={pid}
                                                                                    style={{ flexShrink: 0 }}
                                                                                    className="flex flex-col items-center gap-2"
                                                                                >
                                                                                    <motion.button
                                                                                        whileHover={{ y: -4, scale: 1.02 }}
                                                                                        whileTap={{ scale: 0.96 }}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            applyFilterDirectly(pid);
                                                                                        }}
                                                                                        className="w-[100px] h-[125px] rounded-[18px] overflow-hidden border-2 border-transparent hover:border-[var(--accent)] transition-all relative shadow-lg group"
                                                                                    >
                                                                                        {/* Real Filter Preview Image */}
                                                                                        <img 
                                                                                            src={thumbUrl} 
                                                                                            onLoad={() => { if(selectedImage instanceof File) URL.revokeObjectURL(thumbUrl); }}
                                                                                            style={{ filter: preset.css }}
                                                                                            loading="lazy"
                                                                                            decoding="async"
                                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                                            alt={preset.name}
                                                                                        />
                                                                                        
                                                                                        {/* Glossy Overlay */}
                                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                                                                        
                                                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                            <div className="bg-[var(--accent)] text-white p-2 rounded-full shadow-xl">
                                                                                                <Sparkles size={16} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </motion.button>
                                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-70">
                                                                                        {preset.name.replace(' AI', '')}
                                                                                    </span>
                                                                                </motion.div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                    );
                                                })}
                                                {(!aiInsights.recommendations || aiInsights.recommendations.length === 0) && (
                                                    <p className="text-[11px] text-[var(--text-tertiary)] text-center py-4 opacity-50 uppercase tracking-widest font-black">Scanning for best tools...</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="chat" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col min-h-full space-y-4">
                                        {(aiInsights.chatHistory || []).map((msg) => (
                                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-assistant'}`}>
                                                    <FormattedMessage text={msg.text} sender={msg.sender} />
                                                </div>
                                                <span className="chat-timestamp">{msg.sender === 'user' ? 'You' : 'AI Assistant'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        ))}
                                        {(!aiInsights.chatHistory || aiInsights.chatHistory.length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-50">
                                                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500"><MessageSquare size={32} /></div>
                                                <p className="text-[15px] font-black copilot-main tracking-tight">AI Assistant Ready</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="relative z-10 before:absolute before:inset-0 before:bg-white/40 dark:before:bg-black/20 before:backdrop-blur-xl before:-z-10 before:border-t before:border-white/20 dark:before:border-white/10">
                                <form onSubmit={handleChatSubmit} className="p-5 relative">
                                    <input type="text" value={chatQuery} onChange={(e) => setChatQuery(e.target.value)} placeholder="Type an AI command (e.g. 'Fix face')..." className="w-full bg-[var(--fill-secondary)] rounded-[var(--radius-lg)] py-4 pl-6 pr-14 text-[13px] font-black text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent)]/50 focus:ring-4 focus:ring-[var(--accent)]/10 transition-all outline-none placeholder:opacity-40 uppercase tracking-widest" />
                                    <motion.button whileHover={chatQuery.trim() ? { scale: 1.05 } : {}} whileTap={chatQuery.trim() ? { scale: 0.94 } : {}} type="submit" disabled={!chatQuery.trim()} className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent)] text-white flex items-center justify-center shadow-lg disabled:opacity-30">
                                        <Send size={16} />
                                    </motion.button>
                                </form>
                                {/* FOOTER: Neural Status Bar */}
                                <div className="p-3 px-5 bg-[var(--fill-secondary)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${aiInsights.analyzing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
                                            {aiInsights.analyzing ? 'Neural Engine Active' : 'System Ready'}
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">Documentation</button>
                                        <button onClick={() => setIsCopilotCollapsed(true)} className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)] hover:text-red-500 transition-colors">Exit Hub</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

export default AICopilotPanel;
