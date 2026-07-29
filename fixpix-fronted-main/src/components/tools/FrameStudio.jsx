import React, { memo, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout, Sparkles, Loader2, X, Plus,
    Image as ImageIcon, Heart, Gift, PartyPopper,
    Trophy
} from 'lucide-react';
import { useImage } from '../../context/ImageContext';
import { apiEndpoints } from '../../lib/api';
import { useToast } from '../ui/Toast';

/**
 * FrameStudio — Smart Frame & Sticker Overlay Tool
 */

// ─── Constants: Frame Assets ───
const FRAMES = {
    birthday: [
        { id: 'bday_1', src: '/frames/birthday_frame_1_1774680154851.png', label: 'Festive Party' },
    ],
    anniversary: [
        { id: 'anni_1', src: '/frames/anniversary_frame_1_1774680174838.png', label: 'Royal Romance' },
    ],
    wedding: [
        { id: 'wed_1', src: '/frames/wedding_frame_1_1774680190917.png', label: 'Elegant Vows' },
    ],
    festival: [
        { id: 'fest_1', src: '/frames/festival_frame_1_1774680209573.png', label: 'Golden Lights' },
    ]
};

// ─── Constants: Sticker Assets ───
const STICKERS = [
    { id: 'cake', src: '🎂', label: 'Cake', isEmoji: true },
    { id: 'heart', src: '❤️', label: 'Heart', isEmoji: true },
    { id: 'rings', src: '💍', label: 'Rings', isEmoji: true },
    { id: 'party', src: '🎉', label: 'Party', isEmoji: true },
    { id: 'balloon', src: '🎈', label: 'Balloon', isEmoji: true },
    { id: 'stars', src: '✨', label: 'Stars', isEmoji: true },
    { id: 'gift', src: '🎁', label: 'Gift', isEmoji: true },
    { id: 'wine', src: '🥂', label: 'Cheers', isEmoji: true },
];

const TABS = [
    { id: 'birthday', label: 'Birthday', icon: Gift },
    { id: 'anniversary', label: 'Anniversary', icon: Heart },
    { id: 'wedding', label: 'Wedding', icon: Trophy },
    { id: 'festival', label: 'Festival', icon: PartyPopper },
];


const FrameStudio = memo(() => {
    const { 
        processedImage, originalImage, 
        activeFrame, setActiveFrame, 
        frameScale, setFrameScale,
        stickers, setStickers 
    } = useImage();
    const currentImage = processedImage || originalImage;
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('birthday');
    const [isAutoFraming, setIsAutoFraming] = useState(false);

    // ─── Auto Frame Logic ───
    const handleAutoFrame = useCallback(async () => {
        if (!currentImage) {
            toast.warning('Please upload an image first');
            return;
        }

        setIsAutoFraming(true);
        try {
            // Reuse the tagline/analysis API as it now includes "occasion"
            const response = await fetch(apiEndpoints.intelligence.generateTagline, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: currentImage,
                    style: 'professional' // Default style for detection
                })
            });

            if (!response.ok) throw new Error('AI analysis failed');

            const data = await response.json();
            const occasion = data.occasion || 'general';

            if (occasion === 'general') {
                toast.info("No specific occasion detected. Applying a general celebration frame.");
                setActiveTab('festival');
                setActiveFrame(FRAMES.festival[0]);
            } else if (FRAMES[occasion]) {
                toast.success(`🎉 Detected ${occasion.charAt(0).toUpperCase() + occasion.slice(1)}! Applying smart frame.`);
                setActiveTab(occasion);
                setActiveFrame(FRAMES[occasion][0]);
            } else {
                toast.info("Applying decorative festival frame.");
                setActiveTab('festival');
                setActiveFrame(FRAMES.festival[0]);
            }
        } catch (error) {
            console.error('Auto frame failed:', error);
            toast.error('Could not analyze image for auto-framing');
        } finally {
            setIsAutoFraming(false);
        }
    }, [currentImage, setActiveFrame, toast]);

    // ─── Sticker Logic ───
    const addSticker = useCallback((sticker) => {
        const newSticker = {
            id: Date.now(),
            src: sticker.src,
            isEmoji: sticker.isEmoji,
            x: 50, // center (percentage)
            y: 50,
            scale: 1,
            rotation: 0
        };
        setStickers(prev => [...prev, newSticker]);
        toast.success(`Added ${sticker.label} sticker`);
    }, [setStickers, toast]);

    const removeFrame = useCallback(() => {
        setActiveFrame(null);
        toast.info('Frame removed');
    }, [setActiveFrame, toast]);

    // ═══════ RENDER ═══════

    return (
        <div className="frame-studio">
            {/* Header */}
            <div className="frame-header">
                <div className="frame-header-icon">
                    <ImageIcon size={16} strokeWidth={2.5} />
                </div>
                <div className="frame-header-text">
                    <h4>Smart Frames & Stickers</h4>
                    <p>Add decorative overlays to your shots</p>
                </div>
            </div>

            {/* Auto Frame AI Button */}
            <motion.button
                className="frame-auto-btn"
                onClick={handleAutoFrame}
                disabled={isAutoFraming || !currentImage}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {isAutoFraming ? (
                    <Loader2 size={16} className="frame-loading-spinner" />
                ) : (
                    <Sparkles size={16} />
                )}
                <span>Auto AI Frame</span>
            </motion.button>

            {/* Photo Fit Slider (Only if frame is active) */}
            <AnimatePresence>
                {activeFrame && (
                    <motion.div 
                        key="photo-fit"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 space-y-2 overflow-hidden"
                    >
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-bold text-[var(--ios-text-secondary)] uppercase tracking-wider">Photo Fit Scale</span>
                            <span className="text-[11px] font-bold text-[var(--accent-primary)]">{frameScale}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="50" 
                            max="150" 
                            value={frameScale} 
                            onChange={(e) => setFrameScale(parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="frame-tabs">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`frame-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="flex items-center gap-1.5">
                                <Icon size={12} />
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Frame Grid */}
            <div className="frame-grid">
                {/* None Option */}
                <div 
                    className={`frame-item ${!activeFrame ? 'active' : ''}`}
                    onClick={removeFrame}
                >
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                        <X size={20} />
                        <span className="text-[10px] mt-1">None</span>
                    </div>
                </div>

                {/* Frame List */}
                {FRAMES[activeTab]?.map((frame) => (
                    <div
                        key={frame.id}
                        className={`frame-item ${activeFrame?.id === frame.id ? 'active' : ''}`}
                        onClick={() => setActiveFrame(frame)}
                    >
                        <img src={frame.src} alt={frame.label} />
                        <div className="frame-item-label">{frame.label}</div>
                    </div>
                ))}
            </div>

            {/* Stickers Section */}
            <div className="stickers-section">
                <div className="stickers-header">
                    <ImageIcon size={10} />
                    <span>Quick Stickers</span>
                </div>
                <div className="stickers-grid">
                    {STICKERS.map((sticker) => (
                        <motion.button
                            key={sticker.id}
                            className="sticker-item"
                            onClick={() => addSticker(sticker)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {sticker.isEmoji ? (
                                <span className="text-xl">{sticker.src}</span>
                            ) : (
                                <img src={sticker.src} alt={sticker.label} />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
});

FrameStudio.displayName = 'FrameStudio';

export default FrameStudio;
