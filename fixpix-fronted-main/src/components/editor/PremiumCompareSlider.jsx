import React, { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * PremiumCompareSlider - Split Slider Compare Mode
 * From EDITOR_CANVAS_SPEC.md Section 3.3
 * 
 * Features:
 * - Draggable split divider with handle
 * - Magnetic snap to center (within 5%)
 * - Before/After labels on drag
 * - Haptic feedback on mobile
 * - clipPath for smooth clipping
 */
const PremiumCompareSlider = memo(({ before, after }) => {
    const [position, setPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Magnetic snap to center
    const handleRelease = useCallback(() => {
        setIsDragging(false);
        // Snap to center if within 5%
        if (Math.abs(position - 50) < 5) {
            setPosition(50);
            // Haptic feedback on mobile
            if ('vibrate' in navigator) navigator.vibrate(10);
        }
    }, [position]);

    // Smooth position tracking
    const handleMove = useCallback((clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.max(2, Math.min(98, x)));
    }, []);

    // Mouse handlers
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            handleMove(e.clientX);
        }
    }, [isDragging, handleMove]);

    const handleMouseUp = useCallback(() => {
        handleRelease();
    }, [handleRelease]);

    // Touch handlers
    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (isDragging && e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, [isDragging, handleMove]);

    const handleTouchEnd = useCallback(() => {
        handleRelease();
    }, [handleRelease]);

    // Global mouse events
    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    return (
        <div
            ref={containerRef}
            className="compare-slider relative w-full h-full overflow-hidden cursor-ew-resize touch-none select-none"
        >
            {/* After (background) */}
            <img
                src={after}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                alt="After"
                draggable={false}
            />

            {/* Before (clipped) */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)`, willChange: 'clip-path' }}
            >
                <img
                    src={before}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    alt="Before"
                    draggable={false}
                />
            </div>

            {/* Labels - Permanent but subtle */}
            <div className="absolute inset-x-0 top-6 flex justify-between px-6 pointer-events-none z-10">
                <motion.span
                    className="px-4 py-2 bg-black/40 backdrop-blur-2xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border border-white/10 shadow-lg"
                    animate={{ 
                        opacity: isDragging ? 1 : 0.4,
                        scale: isDragging ? 1.05 : 1,
                        x: isDragging ? 5 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    Before
                </motion.span>
                <motion.span
                    className="px-4 py-2 bg-black/40 backdrop-blur-2xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/90 border border-white/10 shadow-lg"
                    animate={{ 
                        opacity: isDragging ? 1 : 0.4,
                        scale: isDragging ? 1.05 : 1,
                        x: isDragging ? -5 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    After
                </motion.span>
            </div>

            {/* Divider Line with Glow */}
            <div
                className="absolute top-0 bottom-0 w-[1.5px] z-20"
                style={{
                    left: `${position}%`,
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(to bottom, transparent, var(--accent), var(--accent), transparent)',
                    boxShadow: '0 0 12px var(--accent-soft)',
                    willChange: 'left',
                }}
            />

            {/* Tactical Handle */}
            <motion.div
                className="compare-handle absolute top-1/2 w-12 h-12 flex items-center justify-center bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl rounded-full cursor-grab active:cursor-grabbing z-30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10"
                style={{
                    left: `${position}%`,
                    top: '50%',
                    translateX: '-50%',
                    translateY: '-50%',
                    willChange: 'left, transform',
                }}
                animate={{
                    scale: isDragging ? 1.15 : 1,
                    boxShadow: isDragging
                        ? `0 0 30px var(--accent), 0 0 0 4px var(--accent-soft)`
                        : '0 8px 24px rgba(0,0,0,0.2)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="flex items-center gap-1">
                    <ChevronLeft size={18} className="text-accent" strokeWidth={3} />
                    <ChevronRight size={18} className="text-accent" strokeWidth={3} />
                </div>
                
                {/* Visual Glow Core */}
                <motion.div 
                    className="absolute inset-0 rounded-full bg-accent"
                    animate={{ 
                        opacity: isDragging ? 0.15 : 0.05,
                        scale: isDragging ? [1, 1.2, 1] : 1
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            </motion.div>
        </div>
    );
});

PremiumCompareSlider.displayName = 'PremiumCompareSlider';

export default PremiumCompareSlider;
