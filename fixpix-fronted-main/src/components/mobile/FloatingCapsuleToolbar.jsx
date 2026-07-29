import React, { memo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { Sparkles, Download, LayoutGrid, X, Brain } from 'lucide-react';
import { FEATURES } from '../../data/features';
import { useChatbot } from '../chatbot/useChatbot';

/**
 * PREMIUM MOBILE TOOLBAR & FEATURES DRAWER
 * Implements iOS-native floating dock and bottom-sheet grid.
 */

const SPRING = { type: 'spring', stiffness: 350, damping: 30, mass: 0.8 };

// ─── FEATURES GRID BOTTOM SHEET ─────────────────
const FeatureGridDrawer = memo(({ isOpen, onClose }) => {
    const handleFeatureSelect = (f) => {
        if (window.setActiveFeatureProxy) {
            window.setActiveFeatureProxy(f.id);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-80 bg-black/40 backdrop-blur-md"
                        style={{ zIndex: 1000 }}
                    />
                    
                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={SPRING}
                        className="fixed left-0 right-0 bottom-0 z-85 bg-white dark:bg-[#151517] border-t border-white/10 flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.3)] overflow-hidden"
                        style={{
                            height: 'min(72vh, 760px)', zIndex: 1001,
                            borderTopLeftRadius: 40, borderTopRightRadius: 40,
                            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
                        }}
                    >
                        {/* Header Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1.5 rounded-full bg-gray-300 dark:bg-white/20" />
                        </div>

                        {/* Title Row */}
                        <div className="flex flex-wrap justify-between items-center gap-3 px-5 sm:px-8 py-4 sm:py-5">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent block mb-1">PRO SUITE</span>
                                <h2 className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Neural Engine
                                </h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
                            >
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                        
                        {/* Scrolling Grid */}
                        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-10 sm:pb-12 no-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {FEATURES.map((f, i) => {
                                    const isNew = ['smart-filters', 'batch', 'sticker-studio', 'smart-frames'].includes(f.id);
                                    return (
                                        <motion.button
                                            key={f.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            whileTap={{ scale: 0.94 }}
                                            onClick={() => handleFeatureSelect(f)}
                                            className="touch-scale flex flex-col items-center gap-3 p-5 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[32px] text-gray-900 dark:text-white relative shadow-sm active:bg-gray-100 dark:active:bg-white/10 transition-colors"
                                            style={{ WebkitTapHighlightColor: 'transparent' }}
                                        >
                                            {isNew && (
                                                <div className="absolute top-4 right-4 bg-accent text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter shadow-lg shadow-accent/20">
                                                    New
                                                </div>
                                            )}
                                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg border border-black/5 dark:border-white/10 text-accent">
                                                {React.cloneElement(f.icon, { size: 28, strokeWidth: 2.5 })}
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm md:text-base lg:text-lg font-black tracking-tight leading-tight">{f.name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 mt-0.5 px-1 leading-tight line-clamp-1">
                                                    {f.subtitle}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});
FeatureGridDrawer.displayName = 'FeatureGridDrawer';


// ─── MAIN COMPONENT ─────────────────────────────
const FloatingCapsuleToolbar = memo(({ onExport }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Import global chatbot controller
    const { toggleChat, isOpen: isChatOpen } = useChatbot();
    
    const { processedImage, originalImage, isProcessing } = useImage();
    const { pendingQueue, commitCommands } = useCommand();

    // Smart logic for dynamic dock elements
    const hasImage = !!originalImage;
    const hasProcessed = !!processedImage;
    const hasAnyImage = hasImage || hasProcessed;
    const stepCount = pendingQueue ? Object.keys(pendingQueue).length : 0;
    const canGenerate = stepCount > 0 && hasImage && !isProcessing;

    const handleGenerate = async () => {
        if (canGenerate && commitCommands) await commitCommands();
    };

    const handleChatToggle = () => {
        if (!isChatOpen) setIsDrawerOpen(false);
        toggleChat();
    };

    const handleToolsToggle = () => {
        if (!isDrawerOpen) {
            // Close chat if it is open
            if (isChatOpen) toggleChat();
            setIsDrawerOpen(true);
        } else {
            setIsDrawerOpen(false);
        }
    };

    return (
        <>
            <FeatureGridDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            {/* Floating iOS Dock */}
            <motion.div
                initial={{ y: 100, x: '-50%', opacity: 0 }}
                animate={{ y: 0, x: '-50%', opacity: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.4 }}
                className="mobile-capsule-toolbar fixed left-1/2 bottom-[calc(env(safe-area-inset-bottom,0px)+20px)] z-[90] w-[min(92vw,560px)] max-w-[560px] flex flex-wrap items-center justify-center gap-2 p-2 rounded-[32px] bg-white/80 dark:bg-[#1a1a1c]/80 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-x-hidden"
                style={{
                    pointerEvents: isProcessing ? 'none' : 'auto',
                    opacity: isProcessing ? 0.6 : 1,
                }}
            >
                {/* AI Chatbot button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleChatToggle}
                    className={`w-12 h-12 rounded-[24px] flex items-center justify-center transition-all ${
                        isChatOpen ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <Brain size={24} strokeWidth={isChatOpen ? 3 : 2} className={isChatOpen ? 'animate-pulse' : ''} />
                </motion.button>
                
                {/* Tools button (Neural Engine) */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToolsToggle}
                    className={`h-12 px-4 sm:px-6 rounded-[24px] flex items-center gap-2.5 transition-all text-sm md:text-base lg:text-lg font-black ${
                        isDrawerOpen ? 'bg-accent/10 text-accent' : 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-xl shadow-black/10'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <LayoutGrid size={20} strokeWidth={3} />
                    Neural Engine
                </motion.button>

                {/* Generate / Save Dynamic Block */}
                <AnimatePresence mode="popLayout">
                    {canGenerate && (
                        <motion.button
                            key="generate"
                            initial={{ scale: 0.5, opacity: 0, width: 0 }}
                            animate={{ scale: 1, opacity: 1, width: 'auto' }}
                            exit={{ scale: 0.5, opacity: 0, width: 0 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleGenerate}
                            className="h-12 px-5 rounded-[24px] bg-accent text-white flex items-center gap-2 text-sm md:text-base lg:text-lg font-black shadow-xl shadow-accent/40"
                        >
                            <Sparkles size={18} strokeWidth={3} />
                            Ingest
                        </motion.button>
                    )}

                    {hasAnyImage && !canGenerate && (
                        <motion.button
                            key="save"
                            initial={{ scale: 0.5, opacity: 0, width: 0 }}
                            animate={{ scale: 1, opacity: 1, width: 'auto' }}
                            exit={{ scale: 0.5, opacity: 0, width: 0 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onExport}
                            className="h-12 px-5 rounded-[24px] bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center gap-2 text-sm md:text-base lg:text-lg font-black border border-black/5 dark:border-white/10"
                        >
                            <Download size={18} strokeWidth={3} />
                            Save
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
});

FloatingCapsuleToolbar.displayName = 'FloatingCapsuleToolbar';
export default FloatingCapsuleToolbar;
