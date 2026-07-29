import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sticker, Download, Image as ImageIcon, Smile, Type, Package,
    MessageCircle, Check, X, Wand2, Sparkles as SparklesIcon, Loader2,
    RefreshCw, Layers, Palette, Layout, Wand, Stars, Zap
} from 'lucide-react';
import { useImage } from '../../context/ImageContext';
import { useToast } from '../ui/Toast';
import SegmentedControl from '../ui/SegmentedControl';
import { apiEndpoints } from '../../lib/api';
import { authenticatedFetch } from '../../lib/authFetch';
import useCanvasStore from '../../store/canvasStore';
import {
    generateStickerFromImage,
    generateStickerPack,
    generateFaceSticker,
    exportToWhatsApp,
    downloadSticker,
    downloadStickerPack,
} from '../../utils/stickerEngine';

// Default Mascot Image for Preview
const MASCOT_PREVIEW = '/mascot.png';

const MODES = [
    { id: 'text', label: 'Magic', icon: SparklesIcon },
    { id: 'image', label: 'Photo', icon: ImageIcon },
];

const OUTLINE_COLORS = [
    { name: 'White', value: 'white', hex: '#FFFFFF', shadow: 'rgba(255,255,255,0.7)' },
    { name: 'Yellow', value: 'yellow', hex: '#FFE066', shadow: 'rgba(255,224,102,0.7)' },
    { name: 'Pink', value: 'pink', hex: '#FF8FAB', shadow: 'rgba(255,143,171,0.7)' },
    { name: 'Blue', value: 'blue', hex: '#63E6BE', shadow: 'rgba(99,230,190,0.7)' },
];

const STICKER_STYLES = [
    { id: '3d-render', label: '3D Render', emoji: '🎨' },
    { id: 'emoji', label: 'Emojiify', emoji: '😃' },
    { id: 'cartoon', label: 'Cartoon', emoji: '🧸' },
    { id: 'vector', label: 'Minimalist', emoji: '📐' },
    { id: 'cyberpunk', label: 'Neon Soul', emoji: '🌃' },
];

// Helper to generate stars for background sparkle effect
const SPARKLES = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 2 + 1,
    delay: Math.random() * 2
}));

const StickerStudio = memo(({ onClose }) => {
    const { originalImage, processedImage } = useImage();
    const toast = useToast();
    const store = useCanvasStore();
    
    const [activeMode, setActiveMode] = useState('text');
    const [textPrompt, setTextPrompt] = useState('');
    const [stickerStyle, setStickerStyle] = useState('3d-render');
    const [outlineWidth, setOutlineWidth] = useState(8);
    const [outlineColor, setOutlineColor] = useState('white');
    const [isPremium, setIsPremium] = useState(false); // Premium HD toggle
    const [isProcessing, setIsProcessing] = useState(false);
    const [usedEngine, setUsedEngine] = useState(null);
    const [stickerPreview, setStickerPreview] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('');

    const currentImage = processedImage || originalImage;
    const isDisabled = (activeMode !== 'text' && !currentImage) || isProcessing || (activeMode === 'text' && !textPrompt.trim());
    const activeOutline = OUTLINE_COLORS.find(c => c.value === outlineColor);

    // ─── Pipeline 1: Image To Sticker ───
    const handleImageToSticker = useCallback(async () => {
        if (!currentImage) return;
        store.startProcessing({ featureId: 'sticker-studio', featureName: 'Sticker Studio', featureIcon: '✂️', featureColor: '#6366f1' });
        
        try {
            setIsProcessing(true);
            const result = await generateStickerFromImage(currentImage, {
                outlineWidth,
                outlineColor
            });
            setStickerPreview(result);
            store.completeProcessing(currentImage, result, 'Sticker', '✂️');
            store.pushEdit(result, 'Sticker', 'sticker-studio');
            toast.success('✨ Sticker ready!');
        } catch (error) {
            toast.error('Generation failed.');
            store.setProcessingError({ message: 'Sticker generation failed', canRetry: true });
        } finally {
            setIsProcessing(false);
        }
    }, [currentImage, outlineWidth, outlineColor, toast, store]);

    // ─── Pipeline 2: Text To Sticker (AI Magic) ───
    const handleTextToSticker = useCallback(async () => {
        if (!textPrompt.trim()) return;
        
        store.startProcessing({ featureId: 'sticker-studio', featureName: 'Sticker Magic', featureIcon: '🧠', featureColor: '#8b5cf6' });
        if (onClose) onClose();

        setIsProcessing(true);
        setUsedEngine(null);
        setStickerPreview(null);

        const buildUrl = (prompt, seed) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true&seed=${seed}`;

        try {
            const apiUrl = apiEndpoints?.sticker?.textToSticker;
            const response = await authenticatedFetch(`${apiUrl}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: textPrompt,
                    style: stickerStyle,
                    outlineWidth,
                    outlineColor,
                    premium: isPremium // Pass the premium flag
                }),
            });

            if (response.status === 429) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Service is busy. Please try again in a few seconds.');
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.message || errorData.error || 'AI Generation failed';
                throw new Error(errorMsg);
            }

            const data = await response.json();
            
            if (data.status === 'success' || data.sticker) {
                const resultUrl = data.sticker || data.image;
                const engine = data.engine || 'stability';
                setUsedEngine(engine);
                
                store.pushEdit(resultUrl, `AI Sticker (${engine === 'stability' ? 'Premium' : 'Magic'})`, 'sticker-studio', { 
                    prompt: textPrompt,
                    engine: engine
                });
                
                setStickerPreview(resultUrl);
                store.completeProcessing(null, resultUrl, 'AI Sticker', '✨');
                toast.success(usedEngine === 'stability' ? '✨ Magic Sticker Created!' : '✨ Magic Sticker Created via Alternative!');
            } else {
                throw new Error(data.message || 'Generation failed');
            }
        } catch (error) {
            console.error("Sticker generation failed:", error);
            
            // 🚀 SUPER-LAST RESORT (Direct Pollinations UI Preview)
            // If the backend is completely unreachable, we show a direct URL preview
            // even if we can't remove the background or add outlines.
            try {
                const seed = Math.floor(Math.random() * 1000000);
                const augPrompt = `${stickerStyle} style sticker, ${textPrompt}, white background, centered, full subject, vector art, high quality, 4k`;
                const emergencyUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(augPrompt)}?width=768&height=768&nologo=true&seed={seed}`;
                
                setUsedEngine('pollinations-ui');
                toast.warn('⚠️ Server busy, showing Magic Preview...');
                
                // Still add to canvas as a preview
                store.pushEdit(emergencyUrl, 'AI Sticker (Preview)', 'sticker-studio', { prompt: textPrompt });
                setStickerPreview(emergencyUrl);
            } catch (innerError) {
                toast.error('All generation services are currently unavailable.');
                store.setProcessingError({ message: `Sticker generation failed: ${error.message}.`, canRetry: true });
            }
        } finally {
            setIsProcessing(false);
            store.setProcessing(false);
        }
    }, [textPrompt, stickerStyle, outlineWidth, outlineColor, toast, store, onClose]);

    const handleDownload = useCallback(() => {
        if (stickerPreview) {
            downloadSticker(stickerPreview, `fixpix_${Date.now()}.png`);
            toast.success('📥 Downloaded!');
        }
    }, [stickerPreview, toast]);

    const handleWhatsAppExport = useCallback(async () => {
        if (!stickerPreview) return;
        try {
            const webp = await exportToWhatsApp(stickerPreview);
            downloadSticker(webp, `sticker_${Date.now()}.webp`);
            toast.success('📱 WhatsApp Ready!');
        } catch (error) {
            toast.error('Export failed');
        }
    }, [stickerPreview, toast]);

    const action = activeMode === 'text' 
        ? { label: 'Generate Magic', onClick: handleTextToSticker, icon: SparklesIcon } 
        : { label: 'Create Sticker', onClick: handleImageToSticker, icon: Sticker };

    const previewStyles = {
        filter: store.isProcessing 
            ? 'blur(4px) brightness(0.7)' 
            : `
                drop-shadow(${outlineWidth}px 0 0 ${activeOutline.hex}) 
                drop-shadow(-${outlineWidth}px 0 0 ${activeOutline.hex}) 
                drop-shadow(0 ${outlineWidth}px 0 ${activeOutline.hex}) 
                drop-shadow(0 -${outlineWidth}px 0 ${activeOutline.hex}) 
                drop-shadow(${outlineWidth/1.4}px ${outlineWidth/1.4}px 0 ${activeOutline.hex}) 
                drop-shadow(${outlineWidth/1.4}px -${outlineWidth/1.4}px 0 ${activeOutline.hex}) 
                drop-shadow(-${outlineWidth/1.4}px ${outlineWidth/1.4}px 0 ${activeOutline.hex}) 
                drop-shadow(-${outlineWidth/1.4}px -${outlineWidth/1.4}px 0 ${activeOutline.hex}) 
                drop-shadow(0 4px 12px rgba(0,0,0,0.15))
            `,
        transition: 'all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transform: store.isProcessing ? 'scale(0.98)' : 'scale(1)'
    };

    return (
        <div className="flex flex-col h-full bg-inherit font-sans">
            <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Mode Selector */}
                <div className="popup-group" style={{ padding: '4px', display: 'flex' }}>
                    {MODES.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => {
                                setActiveMode(mode.id);
                                setStickerPreview(null);
                            }}
                            style={{
                                flex: 1, padding: '8px 0', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                backgroundColor: activeMode === mode.id ? 'var(--card-bg)' : 'transparent',
                                color: activeMode === mode.id ? '#007AFF' : '#8e8e93',
                                boxShadow: activeMode === mode.id ? '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <mode.icon size={14} />
                            {mode.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center py-2 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[20px] relative overflow-hidden h-[130px] transition-all border border-white/60 dark:border-white/5 shadow-sm">
                    <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05] pointer-events-none" 
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '16px 16px' }} 
                    />
                    
                    <div className="absolute inset-0 pointer-events-none">
                        {SPARKLES.map(s => (
                            <motion.div
                                key={s.id}
                                className="absolute bg-primary rounded-full blur-[1px] opacity-20"
                                style={{
                                    left: `${s.initialX}%`,
                                    top: `${s.initialY}%`,
                                    width: s.size,
                                    height: s.size
                                }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.1, 0.4, 0.1],
                                    y: [0, -20, 0]
                                }}
                                transition={{
                                    duration: s.duration,
                                    delay: s.delay,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>

                    <div 
                        className="absolute bottom-6 w-32 h-6 blur-3xl opacity-10 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: activeOutline.hex }}
                    />
                    
                    <AnimatePresence mode="wait">
                        {stickerPreview ? (
                            <motion.div
                                key="sticker-result"
                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="relative flex flex-col items-center"
                            >
                                <div className="relative isolate">
                                    <img src={stickerPreview} alt="Sticker" className="w-24 h-24 object-contain relative z-10 drop-shadow-lg transition-transform hover:scale-105 duration-300" />
                                    
                                    {/* Engine Badge */}
                                    {usedEngine && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`absolute -top-2 -right-4 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider z-20 border shadow-sm ${
                                                usedEngine === 'stability' 
                                                ? 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' 
                                                : 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
                                            }`}
                                        >
                                            {usedEngine === 'stability' ? 'Premium' : 'Magic Alternative'}
                                        </motion.div>
                                    )}
                                </div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.2 }}
                                    className="flex gap-2 mt-2 w-full px-4"
                                >
                                    <button onClick={handleDownload} className="flex-1 h-8 bg-primary/10 dark:bg-card text-primary rounded-xl text-xs font-black flex items-center justify-center gap-2 border border-primary/20 hover:bg-primary/20 transition-all">
                                        <Download size={14} /> PNG
                                    </button>
                                    <button onClick={handleWhatsAppExport} className="w-8 h-8 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-md shadow-[#25D366]/20">
                                        <MessageCircle size={16} />
                                    </button>
                                    <button onClick={() => setStickerPreview(null)} className="w-8 h-8 bg-black/[0.05] dark:bg-white/[0.1] text-secondary rounded-xl flex items-center justify-center hover:bg-black/10 transition-all">
                                        <RefreshCw size={14} />
                                    </button>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="border-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative flex flex-col items-center group"
                            >
                                <div className="relative isolate">
                                    {store.isProcessing && (
                                        <motion.div 
                                            initial={{ top: '0%' }}
                                            animate={{ top: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(37,99,235,1)] z-20"
                                        />
                                    )}
                                    
                                    <img 
                                        src={activeMode === 'image' && currentImage ? currentImage : MASCOT_PREVIEW} 
                                        alt="Preview" 
                                        className="w-24 h-24 object-contain relative z-10 select-none"
                                        style={previewStyles}
                                    />
                                </div>
                                <motion.div 
                                    animate={store.isProcessing ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.6 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="flex items-center gap-1.5 mt-1"
                                >
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                    <p className="text-[9px] font-black uppercase text-muted tracking-widest pt-0.5">Live Sticker View</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!stickerPreview && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {activeMode === 'text' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="popup-group" style={{ padding: '0 16px' }}>
                                    <div className="popup-separator" style={{ padding: '16px 0' }}>
                                        <textarea
                                            value={textPrompt}
                                            onChange={(e) => setTextPrompt(e.target.value)}
                                            placeholder="Describe your perfect sticker..."
                                            style={{
                                                width: '100%', height: '60px', padding: '0', background: 'transparent',
                                                border: 'none', borderBottom: '1px solid rgba(0,0,0,0.03)', outline: 'none',
                                                fontSize: '14px', fontMedium: 500, color: 'var(--text-primary)', resize: 'none'
                                            }}
                                        />
                                    </div>
                                    <div className="popup-separator" style={{ padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' }}>
                                            <Wand size={14} color={isPremium ? "#8b5cf6" : "#007AFF"} /> 
                                            {isPremium ? 'Premium HD Mode' : 'Standard Magic'}
                                        </div>
                                        <div 
                                            onClick={() => setIsPremium(!isPremium)}
                                            style={{
                                                width: '42px', height: '22px', backgroundColor: isPremium ? '#8b5cf6' : 'rgba(0,0,0,0.1)',
                                                borderRadius: '11px', padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease',
                                                display: 'flex', alignItems: isPremium ? 'flex-end' : 'flex-start',
                                                justifyContent: isPremium ? 'flex-end' : 'flex-start', position: 'relative'
                                            }}
                                        >
                                            <motion.div 
                                                layout
                                                style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} 
                                            />
                                            {!isPremium && <span style={{ position: 'absolute', right: '6px', top: '4.5px', fontSize: '9px', fontWeight: 800, color: '#8e8e93', pointerEvents: 'none' }}>FREE</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Curated Styles Scroller */}
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    {STICKER_STYLES.map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => setStickerStyle(style.id)}
                                            style={{
                                                flexShrink: 0, padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                                letterSpacing: '0.3px', transition: 'all 0.2s', border: '1px solid',
                                                borderColor: stickerStyle === style.id ? 'transparent' : 'rgba(0,0,0,0.06)',
                                                backgroundColor: stickerStyle === style.id ? 'var(--text-primary)' : 'var(--card-bg)',
                                                color: stickerStyle === style.id ? 'var(--card-bg)' : 'var(--text-secondary)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span style={{ marginRight: '6px' }}>{style.emoji}</span>
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Config Panel removed as per user request */}

                        {/* Execute Action Button */}
                        <button
                            type="button"
                            className="popup-button-apply"
                            disabled={isDisabled}
                            onClick={action.onClick}
                            style={{ 
                                marginTop: '16px', 
                                background: isPremium ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : '#007AFF',
                                color: '#fff',
                                height: '52px', borderRadius: '16px', fontWeight: 600, fontSize: '16px', border: 'none', width: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                boxShadow: isPremium ? '0 4px 14px rgba(139, 92, 246, 0.3)' : '0 4px 14px rgba(0, 122, 255, 0.3)', 
                                cursor: 'pointer',
                                filter: isDisabled ? 'grayscale(1) opacity(0.5)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {isProcessing ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <action.icon size={20} strokeWidth={2.5} />
                            )}
                            {isProcessing ? 'Processing...' : (activeMode === 'text' ? 'Generate Magic' : 'Clip Sticker')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

StickerStudio.displayName = 'StickerStudio';
export default StickerStudio;
