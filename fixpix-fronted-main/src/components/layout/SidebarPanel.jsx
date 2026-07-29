import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, RefreshCw, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCanvasStore from '../../store/canvasStore';
import { FEATURES } from '../../data/features';
import useToastStore from '../../store/toastStore';

/* ─── Spring Config ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 450, damping: 32 };

const SidebarPanel = ({ activeFeature, setActiveFeature, loading, isEliteUser }) => {
    const navigate = useNavigate();
    const toast = useToastStore();
    const isProcessing = useCanvasStore(s => s.isProcessing);
    const originalImage = useCanvasStore(s => s.originalImage);
    const reset = useCanvasStore(s => s.reset);

    const handleReset = () => { 
        if (isProcessing) return;
        reset(); 
        toast.success("Project reset"); 
    };

        const previewUrl = useMemo(() => {
            if (!originalImage) return null;
            if (typeof originalImage === 'string') return originalImage;
            return URL.createObjectURL(originalImage);
        }, [originalImage]);

        useEffect(() => {
            if (!previewUrl || typeof originalImage === 'string') return;
            return () => URL.revokeObjectURL(previewUrl);
        }, [previewUrl, originalImage]);

    const handleFileUploadClick = () => {
        if (isProcessing) return;
        document.getElementById('layout-hidden-upload')?.click();
    };

    return (
        <motion.aside
            className={`sidebar-panel ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        >
            <input id="layout-hidden-upload" type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                if (e.target.files[0]) {
                    useCanvasStore.getState().setOriginalImage(e.target.files[0]);
                }
            }} />

            {/* ─── New Project Button ─── */}
            <motion.button 
                whileHover={!isProcessing ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isProcessing ? { scale: 0.96 } : {}}
                transition={SPRING_SNAPPY}
                onClick={handleReset} 
                disabled={isProcessing}
                    className={`sidebar-btn-primary sidebar-mobile-text ${isProcessing ? 'cursor-not-allowed grayscale' : ''}`}
            >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : '+ NEW PROJECT'}
            </motion.button>
            
            {/* ─── Upload / Thumbnail ─── */}
            {originalImage ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sidebar-thumb-row"
                >
                    <div className="sidebar-thumb-img border border-white/10">
                        <img
                            src={previewUrl}
                            alt="Current"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <div className="sidebar-thumb-info">
                        <p className="sidebar-thumb-name" style={{ letterSpacing: 'var(--tracking-tight)' }}>{originalImage.name || 'Generated Image'}</p>
                        {!isProcessing && (
                            <button onClick={handleFileUploadClick} className="sidebar-thumb-change">
                                <RefreshCw size={10} strokeWidth={3} /> Change photo
                            </button>
                        )}
                    </div>
                </motion.div>
            ) : (
                <motion.button 
                    whileHover={!isProcessing ? { scale: 1.02 } : {}}
                    whileTap={!isProcessing ? { scale: 0.96 } : {}}
                    onClick={handleFileUploadClick} 
                    disabled={isProcessing}
                    className={`sidebar-upload-zone sidebar-mobile-text ${isProcessing ? 'cursor-not-allowed' : ''}`}
                >
                    <UploadCloud size={18} strokeWidth={2.5} />
                    <span>Upload photo</span>
                </motion.button>
            )}

            {/* ─── Section Label ─── */}
            <div className="sidebar-section-label">
                <span className="sidebar-pulse-dot" />
                AI Neural Engine
                <div className="sidebar-label-line" />
            </div>

            {/* ─── Feature Grid ─── */}
            <div className="sidebar-scroll">
                <div className="sidebar-feature-grid">
                    {loading ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="sidebar-feature-card opacity-50 pointer-events-none">
                                    <div className="sidebar-feature-icon animate-pulse bg-[var(--fill-secondary)] rounded-[var(--radius-lg)] h-11 w-11" />
                                    <div className="h-2 w-16 bg-[var(--fill-secondary)] animate-pulse rounded-full mt-3" />
                                </div>
                            ))}
                        </>
                    ) : (
                        FEATURES.map((f, i) => {
                            const isLocked = f.isElite && !isEliteUser;
                            const isActive = activeFeature?.id === f.id;
                            
                            return (
                                <motion.button
                                    key={f.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...SPRING_PREMIUM, delay: 0.2 + (i * 0.05) }}
                                    whileHover={!isProcessing && !isLocked ? { scale: 1.04, y: -4 } : {}}
                                    whileTap={!isProcessing && !isLocked ? { scale: 0.96 } : {}}
                                    className={`sidebar-feature-card ${isActive ? 'is-active' : ''} ${isLocked ? 'opacity-60 grayscale-[0.5]' : ''} ${isProcessing ? 'cursor-wait' : ''}`}
                                    onClick={() => {
                                        if (isProcessing) return;
                                        if (isLocked) {
                                            toast.warning('Preview available in Free. Unlock full quality and instant queue with Elite.');
                                            if (window.confirm('This feature is locked. Upgrade to unlock full output quality, instant queue, and premium AI model.')) {
                                                navigate('/app/pricing');
                                            }
                                            return;
                                        }
                                        setActiveFeature(f);
                                    }}
                                    disabled={isProcessing}
                                    type="button"
                                >
                                    <div className={`sidebar-feature-icon ${isActive ? 'is-active shadow-lg' : ''} relative`}>
                                        {React.cloneElement(f.icon, { size: 22, strokeWidth: 2.5 })}
                                        {isLocked && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[var(--surface)] text-white shadow-lg">
                                                <Lock size={10} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`sidebar-feature-label ${isActive ? 'is-active font-black' : ''} flex items-center gap-1.5`}
                                          style={{ letterSpacing: 'var(--tracking-tight)' }}>
                                        {f.name}
                                        {isLocked && (
                                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300/90">
                                                {f.id === 'super-res' ? '4K Locked' : 'Locked'}
                                            </span>
                                        )}
                                    </span>
                                </motion.button>
                            );
                        })
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default SidebarPanel;
