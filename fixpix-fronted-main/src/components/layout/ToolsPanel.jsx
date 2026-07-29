import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Wand2 } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import ZoneMagic from '../sidebar/ZoneMagic';
import ZoneAdjust from '../sidebar/ZoneAdjust';
import GenerateButton from '../editor/GenerateButton';
import { cn } from '../../lib/utils';

/**
 * APPLE-GRADE TOOLS PANEL
 * 
 * Architecture:
 * - Panel surface with 7-layer shadow
 * - Spring accordion physics
 * - Dense tool grouping
 * - Physical press states
 * - No outer glows
 */

// ═══════════════════════════════════════════════════════════════════════════
// ACCORDION SECTION - Software-grade collapsible
// ═══════════════════════════════════════════════════════════════════════════

const AccordionSection = memo(({ title, isOpen, onClick, children, pendingCount }) => {
    // Optimized transition for better performance (no height animation)
    const transition = useMemo(() => ({
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1]
    }), []);

    return (
        <div className="relative mb-[var(--space-s)] gpu-accelerated">
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center justify-between",
                    "px-[var(--space-l)] py-[var(--space-m)]",
                    "transition-colors duration-150",
                    "group"
                )}
            >
                <div className="flex items-center gap-[var(--space-m)]">
                    <span className={cn(
                        "text-[15px] tracking-wide font-semibold",
                        isOpen
                            ? "text-[var(--ios-label)]"
                            : "text-[var(--ios-label-secondary)] group-hover:text-[var(--ios-label)]"
                    )}>
                        {title}
                    </span>

                    {pendingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[rgba(var(--ios-accent),0.1)] text-[var(--accent)] text-[10px] font-bold">
                            {pendingCount}
                        </span>
                    )}
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={transition}
                    className="opacity-40 group-hover:opacity-100"
                >
                    <ChevronDown size={16} strokeWidth={2.5} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={transition}
                        className="gpu-accelerated"
                    >
                        <div className="pb-[var(--space-l)] pt-2 px-[var(--space-l)]">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && <div className="h-px bg-black/5 dark:bg-white/5 mx-[var(--space-l)]" />}
        </div>
    );
});

AccordionSection.displayName = 'AccordionSection';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TOOLS PANEL
// ═══════════════════════════════════════════════════════════════════════════

const ToolsPanel = () => {
    const {
        expandedZone,
        setExpandedZone,
        pendingCount,
        pendingQueue,
        hasPendingChanges,
        commitCommands
    } = useCommand();

    const { isProcessing } = useImage();

    // Zone toggle handler
    const toggleZone = (zone) => {
        setExpandedZone(expandedZone === zone ? null : zone);
    };

    // Count pending per zone
    const getZonePending = (zoneTools) => {
        return zoneTools.filter(t => t in pendingQueue).length;
    };

    const buttonEnabled = hasPendingChanges && !isProcessing;

    return (
        <div className="flex flex-col h-full glass-panel-floating rounded-[var(--radius-xl)] transition-all duration-150">
            {/* ═══════════════════════════════════════════════════════════
                PANEL HEADER
            ═══════════════════════════════════════════════════════════ */}
            <header className="flex items-center gap-[var(--space-m)] px-[var(--space-l)] py-[var(--space-l)] border-b border-black/5 dark:border-white/5 backdrop-blur-md rounded-t-[var(--radius-xl)]">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <Wand2 size={16} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-[var(--ios-label)]">
                        FixPix Magic Studio
                    </h2>
                    <p className="text-[11px] font-medium text-[var(--ios-label-tertiary)] uppercase tracking-wider">
                        Advanced AI Engine
                    </p>
                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════
                ACCORDION TOOL GROUPS
            ═══════════════════════════════════════════════════════════ */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
                {/* AI Magic Box - The new consolidated zone */}
                <AccordionSection
                    title="AI Magic Box"
                    isOpen={expandedZone === 'magic' || expandedZone === 'create' || !expandedZone}
                    onClick={() => toggleZone('magic')}
                    pendingCount={getZonePending(['faceRestoration', 'upscaleX', 'styleTransfer', 'editImage'])}
                >
                    <ZoneMagic />
                </AccordionSection>

                {/* Color & Light - Traditional adjustments */}
                <AccordionSection
                    title="Color & Light"
                    isOpen={expandedZone === 'adjust'}
                    onClick={() => toggleZone('adjust')}
                    pendingCount={0}
                >
                    <ZoneAdjust />
                </AccordionSection>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                GENERATE BUTTON - Primary CTA (Dominant)
            ═══════════════════════════════════════════════════════════ */}
            <div className="p-[var(--space-l)] border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-b-[var(--radius-xl)]">
                <GenerateButton
                    onCommit={commitCommands}
                    pendingCount={pendingCount}
                    isProcessing={isProcessing}
                    disabled={!hasPendingChanges}
                />
            </div>
        </div>
    );
};

export default ToolsPanel;
