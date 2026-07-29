import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * 60 FPS Optimized Before/After Image Comparison Slider
 * Uses CSS variables to avoid React re-renders during active dragging.
 */

// Move Label outside to prevent recreation on every render
const Label = memo(({ type, position }) => (
    <div
        className={cn(
            "absolute px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase z-10 pointer-events-none",
            "flex items-center gap-2 leading-none transition-ios",
            position
        )}
        style={{
            top: 16,
            backgroundColor: type === 'after'
                ? 'rgb(52 199 89 / 0.9)'
                : 'rgb(0 0 0 / 0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: 'white',
            boxShadow: type === 'after'
                ? '0 2px 8px rgb(52 199 89 / 0.4)'
                : '0 2px 8px rgba(0, 0, 0, 0.2)'
        }}
    >
        <span
            className={cn(
                "w-1.5 h-1.5 rounded-full",
                type === 'after' ? 'bg-white' : 'bg-white/60'
            )}
        />
        {type === 'before' ? 'Before' : 'After'}
    </div>
));

Label.displayName = 'BeforeAfterSlider.Label';

const BeforeAfterSlider = ({ before, after, className, onSlidingChange }) => {
    // We only use state for the INITIAL position and the VISUAL state (isDragging)
    // The active position is updated via CSS variable for 60 FPS
    const [isDragging, setIsDragging] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const containerRef = useRef(null);
    const dragAreaRef = useRef(null);

    // Update CSS variable directly to avoid React's reconciliation overhead during drag
    const updateSliderPos = useCallback((percent) => {
        if (containerRef.current) {
            containerRef.current.style.setProperty('--slider-pos', `${percent}%`);
        }
    }, []);

    // Notify parent about sliding state
    useEffect(() => {
        onSlidingChange?.(isDragging);
    }, [isDragging, onSlidingChange]);

    // Hide hint after first interaction
    useEffect(() => {
        if (isDragging) {
            const timer = setTimeout(() => setShowHint(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isDragging]);

    const handleMove = useCallback((clientX) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percent = Math.max(5, Math.min((x / rect.width) * 100, 95));
            updateSliderPos(percent);
        }
    }, [updateSliderPos]);

    const handleStart = useCallback((clientX) => {
        setIsDragging(true);
        handleMove(clientX);
    }, [handleMove]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        handleStart(e.clientX);
    }, [handleStart]);

    // Global listeners for dragging anywhere
    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (isDragging) {
                handleMove(e.clientX);
            }
        };

        const handleGlobalUp = () => {
            setIsDragging(false);
        };

        const handleGlobalTouchMove = (e) => {
            if (isDragging) {
                handleMove(e.touches[0].clientX);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove, { passive: true });
            window.addEventListener('mouseup', handleGlobalUp);
            window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
            window.addEventListener('touchend', handleGlobalUp);
            window.addEventListener('touchcancel', handleGlobalUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalUp);
            window.removeEventListener('touchcancel', handleGlobalUp);
        };
    }, [isDragging, handleMove]);

    // Non-passive listeners for the drag area to prevent scroll on mobile
    useEffect(() => {
        const dragArea = dragAreaRef.current;
        if (!dragArea) return;

        const touchStartHandler = (e) => {
            e.preventDefault();
            handleStart(e.touches[0].clientX);
        };

        const touchMoveHandler = (e) => {
            if (isDragging) {
                e.preventDefault(); 
                handleMove(e.touches[0].clientX);
            }
        };

        dragArea.addEventListener('touchstart', touchStartHandler, { passive: false });
        dragArea.addEventListener('touchmove', touchMoveHandler, { passive: false });

        return () => {
            dragArea.removeEventListener('touchstart', touchStartHandler);
            dragArea.removeEventListener('touchmove', touchMoveHandler);
        };
    }, [isDragging, handleStart, handleMove]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-full overflow-hidden select-none rounded-2xl gpu-accelerated",
                isDragging ? "cursor-ew-resize" : "cursor-default",
                className
            )}
            style={{
                backgroundColor: 'var(--fill-tertiary)',
                touchAction: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                '--slider-pos': '50%',
            }}
        >
            <img
                src={after}
                alt="After"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
                loading="eager"
                decoding="async"
            />

            <Label type="after" position="right-4" />

            <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none gpu-accelerated"
                style={{
                    clipPath: `inset(0 calc(100% - var(--slider-pos)) 0 0)`,
                    willChange: 'clip-path'
                }}
            >
                <img
                    src={before}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable={false}
                    loading="eager"
                    decoding="async"
                />

                <Label type="before" position="left-4" />
            </div>

            <div
                className="absolute inset-y-0 w-24 pointer-events-none z-20"
                style={{
                    left: `var(--slider-pos)`,
                    transform: 'translateX(-100%)',
                    background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.08))',
                    willChange: 'left'
                }}
            />

            <div
                ref={dragAreaRef}
                className="absolute inset-0 cursor-ew-resize z-30"
                onMouseDown={handleMouseDown}
            />

            <div
                className="absolute top-0 bottom-0 pointer-events-none z-40 gpu-accelerated"
                style={{
                    left: `var(--slider-pos)`,
                    transform: 'translateX(-50%)',
                    width: '1px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 0 12px rgba(0,0,0,0.2)',
                    willChange: 'left'
                }}
            >
                <motion.div
                    className="absolute left-1/2 top-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center z-50 pointer-events-none"
                    initial={false}
                    animate={{
                        x: "-50%",
                        y: "-50%",
                        scale: isDragging ? 1.15 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                    }}
                    style={{
                        backdropFilter: 'blur(4px)',
                        border: '0.5px solid rgba(0,0,0,0.1)'
                    }}
                >
                    <div className="flex items-center gap-0.5 opacity-60">
                        <ChevronLeft size={16} strokeWidth={3} className="text-slate-900" />
                        <ChevronRight size={16} strokeWidth={3} className="text-slate-900" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default memo(BeforeAfterSlider);
