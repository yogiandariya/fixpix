import React, { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, Palette, Frame, Heart, Gift, PartyPopper, Type, Sticker as StickerIcon, Eye, EyeOff, Zap, Loader2
} from 'lucide-react';
import useCanvasStore from '../../store/canvasStore';
import IOSToggle from '../ui/IOSToggle';
import SettingSlider from '../ui/SettingSlider';


/**
 * SmartFramesStudio — Expanded Decorative System
 * 
 * Sections:
 * 1. Frames (Categories: Birthday, Anniversary, Wedding, Simple, Classic)
 * 2. Stickers (Emoji-based and icons)
 * 3. Text Stickers (Happy Birthday, Anniversary, etc.)
 */

const FRAMES = [
    // ── Minimal ──
    { id: 'm_1', label: 'Perfect White', category: 'Minimal', src: '/frames/minimalist-white-square-border-free-png.png' },
    { id: 'm_2', label: 'Deep Black', category: 'Minimal', src: '/frames/minimalist-black-square-border-free-png.png' },
    { id: 'm_3', label: 'Thin Line', category: 'Minimal', src: '/frames/simple-line-square-shape-can-use-for-simple-framework-text-quote-copy-space-or-for-graphic-design-element-format-png.png' },
    { id: 'm_4', label: 'Clean Box', category: 'Minimal', src: '/frames/square-box-design-illustration-isolated-on-transparent-background-free-png.png' },
    { id: 'm_5', label: 'Ornate Outline', category: 'Minimal', src: '/frames/a-white-frame-with-an-ornate-design-free-png.png' },
    { id: 'm_6', label: 'Smooth Curvy', category: 'Minimal', src: '/frames/curved-white-frame-free-png.png' },

    // ── Luxury ──
    { id: 'l_1', label: 'Royal Gold', category: 'Luxury', src: '/frames/gold-frame-border-png.png' },
    { id: 'l_2', label: 'Golden Mesh', category: 'Luxury', src: '/frames/gold-shiny-glowing-vintage-square-frame-with-shadows-gold-realistic-square-border-illustration-png.png' },
    { id: 'l_3', label: 'Double Luxe', category: 'Luxury', src: '/frames/golden-geometric-frame-double-golden-lines-that-look-luxurious-for-decorating-wedding-cards-free-png.png' },
    { id: 'l_4', label: 'Modern Duo', category: 'Luxury', src: '/frames/modern-elegant-gold-and-silver-frame-double-gold-and-silver-luxury-border-frame-png.png' },
    { id: 'l_5', label: 'Imperial Gold', category: 'Luxury', src: '/frames/square-gold-frame-png.png' },
    { id: 'l_6', label: 'Glass Cube', category: 'Luxury', src: '/frames/3d-render-black-square-window-frame-with-transparent-background-png.png' },
    { id: 'l_7', label: 'Silver Metal', category: 'Luxury', src: '/frames/silver-metal-border-frame-png.png' },

    // ── Floral ──
    { id: 'f_1', label: 'Watercolor Bloom', category: 'Floral', src: '/frames/watercolor-blooming-rose-branch-flower-bouquet-wreath-frame-square-banner-background-free-png.png' },
    { id: 'f_2', label: 'Zen Bamboo', category: 'Floral', src: '/frames/bamboo-square-border-with-leaves-free-png.png' },
    { id: 'f_3', label: 'Forest Edge', category: 'Floral', src: '/frames/square-frame-with-leaves-border-free-png.png' },
    { id: 'f_4', label: 'Peach Rose', category: 'Floral', src: '/frames/elegant-watercolor-peach-rose-square-frame-border-floral-design-element-free-png.png' },
    { id: 'f_5', label: 'Nature Doodle', category: 'Floral', src: '/frames/hand-drawn-doodle-color-frame-with-plants-and-flowers-png.png' },
    { id: 'f_6', label: 'Lavender Glow', category: 'Floral', src: '/frames/watercolor-frame-with-purple-lilac-on-a-transparent-background-square-border-of-spring-flowers-in-lavender-color-create-provence-style-wedding-invitations-save-the-date-or-invitations-png.png' },

    // ── Vintage ──
    { id: 'v_1', label: 'Classic Asian', category: 'Vintage', src: '/frames/asian-vintage-ornaments-frames-border-oriental-square-png.png' },
    { id: 'v_2', label: 'Tribal Mask', category: 'Vintage', src: '/frames/illustration-of-a-photo-frame-with-a-tribal-design-png.png' },
    { id: 'v_3', label: 'Antique Line', category: 'Vintage', src: '/frames/a3-vintage-frame-abstract-classic-pattern-photo-frame-vintage-elements-black-lines-transparent-background-png.png' },
    { id: 'v_4', label: 'Baroque Aura', category: 'Vintage', src: '/frames/vintage-square-carving-frame-with-floral-ornament-elegant-border-in-a-classic-baroque-style-free-png.png' },
    { id: 'v_5', label: 'Golden Scroll', category: 'Vintage', src: '/frames/vintage-frame-and-set-boundaries-golden-photo-frames-for-pictures-png.png' },

    // ── Neon & Cyber ──
    { id: 'c_1', label: 'Cyber Pulse', category: 'Neon', src: '/frames/neon-rectangle-frame-glowing-outline-shapes-vector-abstract-background-illustration-png.png' },
    { id: 'c_2', label: 'Neon Glow', category: 'Neon', src: '/frames/neon-shiny-frame-glowing-frame-on-transparent-background-png.png' },
    { id: 'c_3', label: 'Neuro Gradient', category: 'Neon', src: '/frames/abstract-blue-and-green-gradient-square-frame-png.png' },
    { id: 'c_4', label: 'Sparkle Edge', category: 'Neon', src: '/frames/outline-frame-with-stars-aesthetic-border-element-minimal-graphic-shape-y2k-modern-simple-abstract-figure-with-sparkles-trendy-geometric-linear-corner-png.png' },

    // ── Classic Events ──
    { id: 'e_1', label: 'Party Time', category: 'Events', src: '/frames/bd_1_1774843274381.png' },
    { id: 'e_2', label: 'Hearts Love', category: 'Events', src: '/frames/ann_1_1774843339914.png' },
    { id: 'e_3', label: 'Wedding Silk', category: 'Events', src: '/frames/wd_1_1774843414000.png' },
];

const CATEGORIES = [
    { id: 'Luxury', label: 'Luxury', icon: Gift },
    { id: 'Minimal', label: 'Minimal', icon: Frame },
    { id: 'Floral', label: 'Floral', icon: Heart },
    { id: 'Vintage', label: 'Vintage', icon: Palette },
    { id: 'Neon', label: 'Neon', icon: Zap },
    { id: 'Events', label: 'Events', icon: PartyPopper },
];

const STICKERS = [
    '🎂', '🍰', '🎈', '🎉', '🎊', 
    '❤️', '💖', '💍', '💎', '🥂',
    '✨', '🔥', '🌟', '🦄', '🌈',
    '👑', '🌹', '🦋', '🧸', '🎁'
];

const TEXT_STICKERS = [
    { text: 'Happy Birthday', color: '#FF5733', font: 'Cursive' },
    { text: 'Happy Anniversary', color: '#C70039', font: 'Serif' },
    { text: 'Just Married', color: '#581845', font: 'Serif' },
    { text: 'Best Day Ever', color: '#FFC300', font: 'Sans-serif' },
    { text: 'Love You Forever', color: '#900C3F', font: 'Cursive' },
    { text: 'Life is Beautiful', color: '#2ECC71', font: 'Sans-serif' },
];

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        if (!src.startsWith('data:')) {
            img.crossOrigin = 'anonymous';
        }
        img.onload = () => resolve(img);
        img.onerror = (e) => {
            console.error('Image load failed:', src.substring(0, 80));
            reject(e);
        };
        img.src = src;
    });
}

const SmartFramesStudio = memo(({ onApply, onClose }) => {
    const foregroundSrc = useCanvasStore(state => state.getWorkingImage());
    const store = useCanvasStore();

    // Ensure we have a string URL (handles File objects from initial upload)
    const activeSourceUrl = useMemo(() => {
        if (!foregroundSrc) return null;
        if (foregroundSrc instanceof File) return URL.createObjectURL(foregroundSrc);
        return foregroundSrc;
    }, [foregroundSrc]);

    const [activeTab, setActiveTab] = useState('frames');
    const [activeCategory, setActiveCategory] = useState('Luxury');
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [activeStickers, setActiveStickers] = useState([]);
    const [activeText, setActiveText] = useState(null);
    const [frameOpacity, setFrameOpacity] = useState(100);
    const [isPreviewOn, setIsPreviewOn] = useState(true);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [status, setStatus] = useState('');
    const previewDebounce = useRef(null);

    const filteredFrames = useMemo(() => 
        FRAMES.filter(f => f.category === activeCategory),
    [activeCategory]);

    const handleApplyFinal = useCallback(async (frameSrc, stickers, textObj, opacity) => {
        if (!activeSourceUrl) return;

        setIsApplying(true);
        setStatus('Compositing...');
        store.startProcessing({ featureId: 'smart-frames', featureName: 'Smart Frames', featureIcon: '🖼️', featureColor: '#06b6d4' });
        if (onClose) onClose();

        try {
            const mainImg = await loadImage(activeSourceUrl);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = mainImg.width;
            canvas.height = mainImg.height;

            // 1. Draw Main Image
            ctx.drawImage(mainImg, 0, 0);

            // 2. Add Frame if selected
            if (frameSrc) {
                const frameImg = await loadImage(frameSrc);
                ctx.save();
                ctx.globalAlpha = opacity / 100;
                ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            // 3. Add Stickers (Fixed positions)
            const stickerSize = canvas.width * 0.15;
            stickers.forEach((s, idx) => {
                ctx.font = `${stickerSize}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const x = (idx % 2 === 0) ? stickerSize : canvas.width - stickerSize;
                const y = idx < 2 ? stickerSize : canvas.height - stickerSize;
                ctx.fillText(s, x, y);
            });

            // 4. Add Text Sticker (Bottom Center)
            if (textObj) {
                const fontSize = canvas.width * 0.08;
                ctx.font = `bold ${fontSize}px ${textObj.font || 'sans-serif'}`;
                ctx.fillStyle = textObj.color || 'white';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeText(textObj.text, canvas.width / 2, canvas.height - (fontSize * 1.5));
                ctx.fillText(textObj.text, canvas.width / 2, canvas.height - (fontSize * 1.5));
            }

            const finalDataUrl = canvas.toDataURL('image/png');
            
            if (onApply) {
                onApply(finalDataUrl);
            } else {
                useCanvasStore.getState().pushEdit(finalDataUrl, 'Smart Frame + Deco', 'smart-frames', { frame: frameSrc, stickers, text: textObj?.text, opacity });
            }
            
            setStatus('');
        } catch (err) {
            console.error('Compositing failed:', err);
            store.setProcessingError({ message: `Frame compositing failed: ${err.message}`, canRetry: false });
        } finally {
            setIsApplying(false);
        }
    }, [activeSourceUrl, onApply, store, onClose]);

    // Real-time Preview Generation
    useEffect(() => {
        if (!isPreviewOn || !activeSourceUrl || (!selectedFrame && activeStickers.length === 0 && !activeText)) {
            setPreviewUrl(null);
            return;
        }

        if (previewDebounce.current) clearTimeout(previewDebounce.current);
        
        previewDebounce.current = setTimeout(async () => {
            try {
                const mainImg = await loadImage(activeSourceUrl);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Use a smaller canvas for faster preview performance
                const scale = Math.min(800 / mainImg.width, 800 / mainImg.height, 1);
                canvas.width = mainImg.width * scale;
                canvas.height = mainImg.height * scale;
                
                ctx.drawImage(mainImg, 0, 0, canvas.width, canvas.height);
                
                if (selectedFrame) {
                    const frameImg = await loadImage(selectedFrame);
                    ctx.save();
                    ctx.globalAlpha = frameOpacity / 100;
                    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }
                
                const stickerSize = canvas.width * 0.15;
                activeStickers.forEach((s, idx) => {
                    ctx.font = `${stickerSize}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const x = (idx % 2 === 0) ? stickerSize : canvas.width - stickerSize;
                    const y = idx < 2 ? stickerSize : canvas.height - stickerSize;
                    ctx.fillText(s, x, y);
                });
                
                if (activeText) {
                    const fontSize = canvas.width * 0.08;
                    ctx.font = `bold ${fontSize}px ${activeText.font || 'sans-serif'}`;
                    ctx.fillStyle = activeText.color || 'white';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    ctx.shadowBlur = 10;
                    ctx.fillText(activeText.text, canvas.width / 2, canvas.height - (fontSize * 1.5));
                }
                
                setPreviewUrl(canvas.toDataURL('image/jpeg', 0.8));
            } catch (err) {
                console.error('Preview failed:', err);
            }
        }, 150);

        return () => clearTimeout(previewDebounce.current);
    }, [activeSourceUrl, selectedFrame, activeStickers, activeText, frameOpacity, isPreviewOn]);

    return (
        <div className="smart-frames-studio" style={{ padding: '0 4px', position: 'relative' }}>
            
            {/* Preview Window */}
            {isPreviewOn && (selectedFrame || activeStickers.length > 0 || activeText) && (
                <div style={{ 
                    width: '100%', 
                    aspectRatio: '4/3', 
                    borderRadius: '24px', 
                    backgroundColor: 'rgba(0,0,0,0.03)', 
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <AnimatePresence mode="wait">
                        {previewUrl ? (
                            <motion.img 
                                key={previewUrl}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                src={previewUrl} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                            />
                        ) : (
                            <div style={{ color: '#8e8e93', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <Loader2 className="spinning" size={18} />
                                Generating Preview...
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Main Tabs: Frames | Stickers | Text */}
            <div style={{ display: 'flex', background: 'var(--fill-tertiary)', borderRadius: '16px', padding: '4px', marginBottom: '16px' }}>
                {[
                    { id: 'frames', label: 'Frames', icon: Frame },
                    { id: 'stickers', label: 'Stickers', icon: StickerIcon },
                    { id: 'text', label: 'Text Deco', icon: Type }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            padding: '8px 0', border: 'none', borderRadius: '14px', cursor: 'pointer',
                            fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                            background: activeTab === tab.id ? 'var(--surface-primary)' : 'transparent',
                            boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ height: '320px', overflowY: 'auto', paddingBottom: '20px' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'frames' && (
                        <motion.div key="frames" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        style={{
                                            whiteSpace: 'nowrap', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', border: 'none',
                                            background: activeCategory === cat.id ? '#2563eb' : 'rgba(0,0,0,0.06)',
                                            color: activeCategory === cat.id ? 'white' : '#666', cursor: 'pointer'
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                                {filteredFrames.map(frame => (
                                    <div 
                                        key={frame.id} 
                                        onClick={() => setSelectedFrame(frame.src)}
                                        style={{ 
                                            aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                                            border: selectedFrame === frame.src ? '3px solid #2563eb' : 'none',
                                            transition: 'transform 0.2s',
                                            transform: selectedFrame === frame.src ? 'scale(0.95)' : 'scale(1)',
                                            position: 'relative'
                                        }}
                                    >
                                        <img src={frame.src} alt={frame.label} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selectedFrame === frame.src ? frameOpacity/100 : 1 }} />
                                    </div>
                                ))}
                            </div>

                            <div className="popup-group" style={{ padding: '0 16px' }}>
                                <div className="popup-separator" style={{ padding: '16px 0' }}>
                                    <SettingSlider 
                                        label="Frame Opacity" 
                                        value={frameOpacity} 
                                        onChange={setFrameOpacity} 
                                        min={0} 
                                        max={100} 
                                    />
                                </div>
                                <div className="popup-separator" style={{ padding: '8px 0' }}>
                                    <IOSToggle 
                                        label="Preview on Image" 
                                        value={isPreviewOn} 
                                        onChange={setIsPreviewOn} 
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'stickers' && (
                        <motion.div key="stickers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                {STICKERS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            if (activeStickers.includes(s)) setActiveStickers(activeStickers.filter(x => x !== s));
                                            else if (activeStickers.length < 4) setActiveStickers([...activeStickers, s]);
                                        }}
                                        style={{
                                            fontSize: '28px', height: '60px', borderRadius: '16px', cursor: 'pointer',
                                            background: activeStickers.includes(s) ? 'rgba(37, 99, 235, 0.15)' : 'rgba(0,0,0,0.03)',
                                            border: activeStickers.includes(s) ? '2px solid #2563eb' : '2px solid transparent'
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <p style={{ fontSize: '11px', textAlign: 'center', color: '#999', marginTop: '16px' }}>Select up to 4 stickers</p>
                        </motion.div>
                    )}

                    {activeTab === 'text' && (
                        <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {TEXT_STICKERS.map(t => (
                                    <button
                                        key={t.text}
                                        onClick={() => setActiveText(t)}
                                        style={{
                                            padding: '12px', borderRadius: '14px', textAlign: 'center', cursor: 'pointer',
                                            background: activeText?.text === t.text ? 'rgba(37, 99, 235, 0.1)' : 'rgba(0,0,0,0.03)',
                                            border: activeText?.text === t.text ? '2px solid #2563eb' : '2px solid transparent',
                                            color: t.color, fontSize: '14px', fontWeight: 600, fontFamily: t.font
                                        }}
                                    >
                                        {t.text}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setActiveText(null)}
                                    style={{ marginTop: '12px', color: '#999', background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    Clear Text
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ marginTop: '16px' }}>
                <button
                    type="button"
                    onClick={() => handleApplyFinal(selectedFrame, activeStickers, activeText, frameOpacity)}
                    disabled={isApplying || (!selectedFrame && activeStickers.length === 0 && !activeText)}
                    style={{ 
                        width: '100%', height: '52px', border: 'none', borderRadius: '16px', 
                        fontSize: '16px', fontWeight: 600, background: '#007AFF', color: 'white', 
                        cursor: isApplying || (!selectedFrame && activeStickers.length === 0 && !activeText) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease', 
                        opacity: isApplying || (!selectedFrame && activeStickers.length === 0 && !activeText) ? 0.6 : 1,
                        boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)'
                    }}
                >
                    {isApplying ? 'Applying...' : 'Apply Details'}
                </button>
            </div>

            <AnimatePresence>
                {status && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px 20px', borderRadius: '20px', fontSize: '12px'
                        }}
                    >
                        {status}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

SmartFramesStudio.displayName = 'SmartFramesStudio';

export default SmartFramesStudio;
