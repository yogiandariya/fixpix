import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const MaskCanvas = forwardRef(({ width, height, imageSrc, onMaskChange, brushSize = 20, brushSoftness = 50 }, ref) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    
    // Performance Refs - decouple from React state
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const currentPosRef = useRef({ x: 0, y: 0 });
    const rafIdRef = useRef(null);

    // Mouse Tracking for Preview using Motion Values (no re-renders)
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        getMask: () => {
            return canvasRef.current.toDataURL('image/png');
        },
        clear: () => {
            const ctx = contextRef.current;
            if (ctx) {
                ctx.clearRect(0, 0, width, height);
            }
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        const ctx = canvas.getContext('2d', { alpha: true });
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#ff0000'; // Pure red for mask
        ctx.lineWidth = brushSize;
        
        // Apply softness via shadow
        if (brushSoftness > 0) {
            ctx.shadowBlur = brushSoftness / 2;
            ctx.shadowColor = '#ff0000';
        } else {
            ctx.shadowBlur = 0;
        }

        contextRef.current = ctx;

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [width, height, brushSize, brushSoftness]);

    // High-performance drawing loop
    const renderDrawing = useCallback(() => {
        if (!isDrawingRef.current) return;

        const ctx = contextRef.current;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
            ctx.lineTo(currentPosRef.current.x, currentPosRef.current.y);
            ctx.stroke();
            
            // Sync positions for next frame
            lastPosRef.current = { ...currentPosRef.current };
        }

        rafIdRef.current = requestAnimationFrame(renderDrawing);
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        isDrawingRef.current = true;
        lastPosRef.current = { x: offsetX, y: offsetY };
        currentPosRef.current = { x: offsetX, y: offsetY };
        
        // Start the loop
        rafIdRef.current = requestAnimationFrame(renderDrawing);
    };

    const finishDrawing = () => {
        if (!isDrawingRef.current) return;
        
        isDrawingRef.current = false;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        
        if (onMaskChange) {
            onMaskChange(canvasRef.current.toDataURL('image/png'));
        }
    };

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        cursorX.set(offsetX);
        cursorY.set(offsetY);
        
        if (isDrawingRef.current) {
            currentPosRef.current = { x: offsetX, y: offsetY };
        }
    };

    return (
        <div 
            className="absolute inset-0 z-30 overflow-hidden" 
            style={{ width, height, margin: 'auto' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                finishDrawing();
            }}
        >
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={handleMouseMove}
                className="w-full h-full cursor-none touch-none"
                style={{ pointerEvents: 'auto' }}
            />
            
            {/* Brush Preview Circle */}
            <AnimatePresence>
                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            x: cursorX,
                            y: cursorY,
                            width: brushSize,
                            height: brushSize,
                            borderRadius: '50%',
                            border: '1.5px solid white',
                            boxShadow: `0 0 0 ${brushSoftness/4}px rgba(255,255,255,0.2), 0 0 15px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.1)`,
                            pointerEvents: 'none',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 100,
                            backdropFilter: brushSoftness > 20 ? `blur(${brushSoftness/20}px)` : 'none',
                        }}
                        transition={{ type: 'spring', damping: 30, stiffness: 500, mass: 0.5 }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
});

MaskCanvas.displayName = 'MaskCanvas';

export default React.memo(MaskCanvas);
