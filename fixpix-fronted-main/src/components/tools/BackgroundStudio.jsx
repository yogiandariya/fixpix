import React, { memo, useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon, Sparkles, Wand2, Loader2,
    Check, Clock, Bot, Palette
} from 'lucide-react';
import useCanvasStore from '../../store/canvasStore';
import { apiEndpoints } from '../../lib/api';
import { authenticatedFetch } from '../../lib/authFetch';

/**
 * BackgroundStudio — Hybrid Background System
 *
 * Three modes:
 * 1. Templates — Pre-made backgrounds (instant)
 * 2. AI Generate — Custom AI backgrounds from text prompt
 * 3. Auto AI — Smart analysis + auto-generated background
 *
 * Uses existing text-to-image API (Stability/Cloudflare) for generation.
 * All compositing happens client-side via Canvas API.
 */

// ─── Template Backgrounds ───
const BACKGROUNDS = [
    { id: 'wedding', label: 'Wedding', src: '/bg/wedding.jpg' },
    { id: 'beach', label: 'Beach', src: '/bg/beach.jpg' },
    { id: 'city', label: 'City', src: '/bg/city.jpg' },
    { id: 'nature', label: 'Nature', src: '/bg/nature.jpg' },
    { id: 'studio', label: 'Studio', src: '/bg/studio.jpg' },
    // ── New Premium Backgrounds (WhatsApp Assets) ──
    { id: 'int-1', label: 'Modern Hall', src: '/bg/WhatsApp Image 2026-03-28 at 11.38.47.jpeg' },
    { id: 'int-2', label: 'Luxe Interior', src: '/bg/WhatsApp Image 2026-03-28 at 11.38.48.jpeg' },
    { id: 'int-3', label: 'Studio White', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.33.jpeg' },
    { id: 'ext-1', label: 'Skyline Blue', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.34.jpeg' },
    { id: 'ext-2', label: 'Natural Light', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.35.jpeg' },
    { id: 'premium-6', label: 'Studio Gradient', src: '/bg/WhatsApp Image 2026-03-28 at 11.38.47 (1).jpeg' },
    { id: 'premium-7', label: 'Minimal Room', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.33 (1).jpeg' },
    { id: 'premium-8', label: 'Creative Studio', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.33 (2).jpeg' },
    { id: 'premium-9', label: 'City Dusk', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.34 (1).jpeg' },
    { id: 'premium-10', label: 'Modern Office', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.34 (2).jpeg' },
    { id: 'premium-11', label: 'Portrait Backdrop', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.35 (1).jpeg' },
    { id: 'premium-12', label: 'Soft Sunset', src: '/bg/WhatsApp Image 2026-03-28 at 12.37.35 (2).jpeg' },
];

const SOLID_COLORS = [
    { id: 'black', label: 'Black', value: '#000000' },
    { id: 'white', label: 'White', value: '#ffffff' },
    { id: 'grad-blue', label: 'Sky', value: 'linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)' },
    { id: 'grad-purple', label: 'Indigo', value: 'linear-gradient(180deg, #AF52DE 0%, #5856D6 100%)' },
    { id: 'grad-sunset', label: 'Sunset', value: 'linear-gradient(180deg, #FF9500 0%, #FF2D55 100%)' },
];

// ─── AI Style Presets ───
const STYLE_PRESETS = [
    { id: 'realistic', label: 'Realistic' },
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'portrait', label: 'Portrait' },
    { id: 'anime', label: 'Anime' },
];

// ─── Tab Definitions ───
const TABS = [
    { id: 'templates', label: 'Templates', icon: ImageIcon },
    { id: 'ai-generate', label: 'AI Generate', icon: Sparkles },
    { id: 'auto-ai', label: 'Auto AI', icon: Bot },
];

// ─── Cache for generated backgrounds ───
const bgCache = new Map();

// ─── Utility: Load image from URL or data URL ───
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        // M7 FIX: Don't use CORS for local data/blob URLs which are on the same origin
        if (!src.startsWith('data:') && !src.startsWith('blob:')) {
            img.crossOrigin = 'anonymous';
        }
        img.onload = () => resolve(img);
        img.onerror = (e) => {
            console.error('Image load failed:', src.substring(0, 80));
            reject(new Error(`Failed to load image: ${src.substring(0, 40)}...`));
        };
        img.src = src;
    });
}

function useDebounce(value, delay) {
    const [debounced, setDebounced] = React.useState(value);
    React.useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

const BackgroundStudio = memo(({ onApply, onClose }) => {
    
    // The foreground is exactly whatever image is currently actively visible on Canvas Timeline
    const foregroundSrc = useCanvasStore(state => state.getWorkingImage());

    // Ensure we have a string URL (handles File objects from initial upload)
    const activeSourceUrl = useMemo(() => {
        if (!foregroundSrc) return null;
        if (foregroundSrc instanceof File) return URL.createObjectURL(foregroundSrc);
        return foregroundSrc;
    }, [foregroundSrc]);

    const myFetch = authenticatedFetch || fetch;

    const [activeTab, setActiveTab] = useState('templates');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiStyle, setAiStyle] = useState('realistic');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [previewBg, setPreviewBg] = useState(null);
    const [compositeUrl, setCompositeUrl] = useState(null);
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [autoAnalysis, setAutoAnalysis] = useState(null);
    
    const store = useCanvasStore();
    const setPreviewImage = useCanvasStore(state => state.setPreviewImage);

    const [isolatedSubject, setIsolatedSubject] = useState(null);
    const [isIsolating, setIsIsolating] = useState(false);
    const [isolationError, setIsolationError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const debounceTimer = useRef(null);
    const debouncedPrompt = useDebounce(aiPrompt, 300);

    // ─── Utility: Detect transparency ───
    const checkTransparency = useCallback(async (src) => {
        try {
            const img = await loadImage(src);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Sample pixels to see if there is transparency
            // We check a grid of pixels for performance
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            for (let i = 3; i < imageData.length; i += 4) {
                if (imageData[i] < 250) return true; // Found transparency
            }
            return false;
        } catch (e) {
            return false;
        }
    }, []);

    // ─── Utility: Downscale for API ───
    const downscaleForIsolation = useCallback(async (src, maxSize = 1024) => {
        const img = await loadImage(src);
        if (img.width <= maxSize && img.height <= maxSize) return src;

        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    }, []);

    const addToHistory = useCallback((bgSrc) => {
        setHistory(prev => {
            const filtered = prev.filter(h => h !== bgSrc);
            return [bgSrc, ...filtered].slice(0, 3);
        });
    }, []);

    // ── Magic Isolation Effect ──
    React.useEffect(() => {
        if (!activeSourceUrl) return;
        
        const isolate = async () => {
            setIsIsolating(true);
            setIsolationError(false);
            try {
                // 1. Check if already transparent. If so, skip AI.
                const hasTransparency = await checkTransparency(activeSourceUrl);
                if (hasTransparency) {
                    console.log('BackgroundStudio: Transparency detected, skipping AI isolation.');
                    setIsolatedSubject(activeSourceUrl);
                    setIsIsolating(false);
                    return;
                }

                // 2. Downscale for better success rate and speed
                const processedUrl = await downscaleForIsolation(activeSourceUrl);
                const sourceResponse = await fetch(processedUrl);
                if (!sourceResponse.ok) throw new Error('Failed to fetch source');
                
                const blob = await sourceResponse.blob();
                const formData = new FormData();
                formData.append('image', blob);
                
                const apiResponse = await myFetch(apiEndpoints.removeBg, {
                    method: 'POST',
                    body: formData
                });
                
                if (apiResponse.ok) {
                    const data = await apiResponse.json();
                    let rawUrl = data.image || data.restored_image || null;
                    if (rawUrl && !rawUrl.startsWith('http') && !rawUrl.startsWith('data:')) {
                        rawUrl = `data:image/png;base64,${rawUrl}`;
                    }
                    if (!rawUrl) throw new Error('No image in response');
                    setIsolatedSubject(rawUrl);
                } else {
                    throw new Error('API rejection');
                }
            } catch (err) {
                console.warn('Subject isolation failed:', err);
                setIsolatedSubject(activeSourceUrl); // Fallback to opaque
                setIsolationError(true);
            } finally {
                setIsIsolating(false);
            }
        };
        
        isolate();

        // Cleanup preview on unmount
        return () => {
            setPreviewImage(null);
        };
    }, [activeSourceUrl, retryCount, myFetch, setPreviewImage, checkTransparency, downscaleForIsolation]);

    const applyBackground = useCallback(async (bgSrc, isFinal = false) => {
        const source = isolatedSubject || activeSourceUrl;
        if (!source) return;

        setIsGenerating(true);
        if (!isFinal) setGenerationStatus('Compositing...');

        try {
            const fgImg = await loadImage(source);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = fgImg.width;
            canvas.height = fgImg.height;
            if (bgSrc.startsWith('#') || bgSrc.startsWith('linear-gradient')) {
                // Apply color or gradient
                if (bgSrc.startsWith('linear-gradient')) {
                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    // Simple parser for the standard presets
                    if (bgSrc.includes('#5AC8FA')) {
                        gradient.addColorStop(0, '#5AC8FA'); gradient.addColorStop(1, '#007AFF');
                    } else if (bgSrc.includes('#AF52DE')) {
                        gradient.addColorStop(0, '#AF52DE'); gradient.addColorStop(1, '#5856D6');
                    } else if (bgSrc.includes('#FF9500')) {
                        gradient.addColorStop(0, '#FF9500'); gradient.addColorStop(1, '#FF2D55');
                    }
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else {
                    ctx.fillStyle = bgSrc;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            } else {
                const bgImg = await loadImage(bgSrc);
                const bgScale = Math.max(
                    canvas.width / bgImg.width,
                    canvas.height / bgImg.height
                );
                const bgW = bgImg.width * bgScale;
                const bgH = bgImg.height * bgScale;
                const bgX = (canvas.width - bgW) / 2;
                const bgY = (canvas.height - bgH) / 2;
                ctx.drawImage(bgImg, bgX, bgY, bgW, bgH);
            }

            const fx = (canvas.width - fgImg.width) / 2;
            const fy = (canvas.height - fgImg.height) / 2;
            ctx.drawImage(fgImg, fx, fy, fgImg.width, fgImg.height);

            const finalDataUrl = canvas.toDataURL('image/png');
            
            if (isFinal) {
                if (onApply) {
                    onApply(finalDataUrl);
                } else {
                    store.pushEdit(finalDataUrl, 'Background Studio', 'change-bg', { background: bgSrc });
                }
                addToHistory(bgSrc);
                setPreviewImage(null);
                // SUCCESS: Close the popup
                if (onClose) onClose();
            } else {
                setCompositeUrl(finalDataUrl);
                setPreviewBg(bgSrc);
                setPreviewImage(finalDataUrl);
            }
            
            setGenerationStatus('');
        } catch (err) {
            console.error('Background compositing failed:', err);
            store.setProcessingError({ 
                message: `Failed to combine images: ${err.message}`, 
                canRetry: true 
            });
            setGenerationStatus('Compositing failed');
            setTimeout(() => setGenerationStatus(''), 2000);
            
            // Still close the popup on failure to avoid a "stuck" state if they want
            // if (isFinal && onClose) onClose();
        } finally {
            setIsGenerating(false);
        }
    }, [foregroundSrc, isolatedSubject, activeSourceUrl, onApply, addToHistory, store, onClose, setPreviewImage]);

    const handleTemplateClick = useCallback((bg) => {
        setSelectedTemplate(bg.id);
        setPreviewBg(bg.src);
        applyBackground(bg.src, false);
    }, [applyBackground]);

    const handleAIGenerate = useCallback(async () => {
        const prompt = aiPrompt.trim();
        if (!prompt) return;

        const cacheKey = `${prompt}__${aiStyle}`;
        if (bgCache.has(cacheKey)) {
            const cachedBg = bgCache.get(cacheKey);
            setPreviewBg(cachedBg);
            applyBackground(cachedBg);
            return;
        }

        setIsGenerating(true);
        setGenerationStatus('Generating AI background...');
        store.startProcessing({ featureId: 'change-bg', featureName: 'AI Background', featureIcon: '🖼️', featureColor: '#f59e0b' });
        if (onClose) onClose();

        const startTime = Date.now();

        try {
            const enhancedPrompt = `${prompt}. Background scene only, no people, high quality, photorealistic`;

            const response = await myFetch(apiEndpoints.cloudflareGenerate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    style: aiStyle,
                    aspectRatio: '1:1',
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || `Generation failed (${response.status})`);
            }

            const data = await response.json();
            const bgImage = data.image;

            if (!bgImage) throw new Error('No image returned from API');

            // Enforce minimum animation time
            const elapsed = Date.now() - startTime;
            if (elapsed < 1200) await new Promise(r => setTimeout(r, 1200 - elapsed));

            bgCache.set(cacheKey, bgImage);

            setPreviewBg(bgImage);
            applyBackground(bgImage, false);
            setGenerationStatus('AI background ready. Click Apply below.');
            store.stopProcessing();
            setTimeout(() => setGenerationStatus(''), 3000);

        } catch (err) {
            console.error('AI background generation failed:', err);
            store.setProcessingError({ message: `Background generation failed: ${err.message}`, canRetry: true });
            setGenerationStatus(`Error: ${err.message}`);
            setTimeout(() => setGenerationStatus(''), 3000);
        } finally {
            setIsGenerating(false);
        }
    }, [aiPrompt, aiStyle, applyBackground, store]);

    const handleAutoAI = useCallback(async () => {
        if (!foregroundSrc) return;

        setIsGenerating(true);
        setGenerationStatus('🧠 AI is thinking...');
        store.startProcessing({ featureId: 'change-bg', featureName: 'Auto AI Background', featureIcon: '🤖', featureColor: '#8b5cf6' });
        if (onClose) onClose();
        
        setAutoAnalysis(null);
        const startTime = Date.now();

        try {
            let suggestedPrompt = '';
            
            try {
                const analyzeResponse = await myFetch(apiEndpoints.intelligence.optimizePrompt, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: 'Generate a single, specific, visually stunning background scene description for a portrait photo. Be creative and specific about the environment, lighting, colors, and mood. Examples: "Golden hour sunset over lavender fields with warm amber light", "Sleek modern office with floor-to-ceiling windows overlooking a city skyline at dusk", "Enchanted forest clearing with soft morning mist and rays of sunlight through ancient oak trees". Return ONLY the scene description, nothing else. Make it unique and cinematic.'
                    }),
                });

                if (analyzeResponse.ok) {
                    const analyzeData = await analyzeResponse.json();
                    suggestedPrompt = analyzeData.optimized_prompt || '';
                }
            } catch (llmErr) {
                console.warn('LLM suggestion failed, using fallback:', llmErr);
            }

            if (!suggestedPrompt || suggestedPrompt.length < 10) {
                const fallbacks = [
                    'Professional photography studio with soft gradient backdrop and rim lighting',
                    'Golden sunset beach with warm amber light reflecting on calm ocean waves',
                    'Modern urban rooftop terrace overlooking city skyline at blue hour twilight',
                    'Lush tropical garden with soft bokeh green foliage and natural sunlight',
                    'Elegant marble interior with warm chandelier lighting and soft shadows',
                ];
                suggestedPrompt = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            }

            setAutoAnalysis(suggestedPrompt);
            setGenerationStatus('🎨 Generating background...');

            const enhancedPrompt = `${suggestedPrompt}. Background scene only, no people, no text, high quality, photorealistic, 8k`;

            const response = await myFetch(apiEndpoints.cloudflareGenerate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    style: 'cinematic',
                    aspectRatio: '1:1',
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Background generation failed (${response.status})`);
            }

            const data = await response.json();
            const bgImage = data.image;

            if (!bgImage) throw new Error('No image returned from AI');

            // Enforce minimum animation time
            const elapsed = Date.now() - startTime;
            if (elapsed < 1200) await new Promise(r => setTimeout(r, 1200 - elapsed));

            setGenerationStatus('✅ Background ready. Click Apply below.');
            setPreviewBg(bgImage);
            applyBackground(bgImage, false);
            store.stopProcessing();
            setTimeout(() => setGenerationStatus(''), 4000);
        } catch (err) {
            console.error('Auto AI background failed:', err);
            store.setProcessingError({ message: `Auto AI failed: ${err.message}`, canRetry: true });
            setGenerationStatus(`❌ ${err.message}`);
            setTimeout(() => setGenerationStatus(''), 4000);
        } finally {
            setIsGenerating(false);
        }
    }, [foregroundSrc, applyBackground, store]);

    const handleHistoryClick = useCallback((bgSrc) => {
        applyBackground(bgSrc);
    }, [applyBackground]);


    return (
        <div className="bg-studio" style={{ marginTop: '4px' }}>
            {/* Isolation Guardrail Feedback */}
            <AnimatePresence>
                {isIsolating && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                            position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(255,255,255,0.8)', 
                            backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', 
                            alignItems: 'center', justifyContent: 'center', gap: '16px', borderRadius: '24px'
                        }}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Bot size={24} className="text-blue-500 animate-pulse" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-[15px] font-bold text-slate-900">Identifying subject...</h4>
                            <p className="text-[12px] text-slate-500">AI is segmenting your photo for the best fit.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Isolation Error Warning */}
            <AnimatePresence>
                {isolationError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            margin: '4px 8px 12px 8px', padding: '10px 14px', borderRadius: '14px',
                            background: 'rgba(255, 59, 48, 0.08)', border: '1px solid rgba(255, 59, 48, 0.1)',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Bot size={14} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ff3b30', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Detection Warning</div>
                            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                No subject found. Use <b>Remove BG</b> first for better results.
                            </div>
                        </div>
                        <button 
                            onClick={() => setRetryCount(c => c + 1)}
                            style={{
                                background: 'white', border: '1px solid #ff3b30', color: '#ff3b30',
                                padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="popup-group" style={{ padding: '4px', display: 'flex' }}>
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1, padding: '8px 0', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                backgroundColor: activeTab === tab.id ? 'var(--card-bg)' : 'transparent',
                                color: activeTab === tab.id ? '#007AFF' : '#8e8e93',
                                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <Icon size={14} strokeWidth={activeTab === tab.id ? 2.5 : 1.75} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="bg-studio-content"
                >
                    {activeTab === 'templates' && (
                        <TemplatesTab
                            selectedTemplate={selectedTemplate}
                            onSelect={handleTemplateClick}
                            isGenerating={isGenerating}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    )}

                    {activeTab === 'ai-generate' && (
                        <AIGenerateTab
                            prompt={aiPrompt}
                            onPromptChange={setAiPrompt}
                            style={aiStyle}
                            onStyleChange={setAiStyle}
                            onGenerate={handleAIGenerate}
                            isGenerating={isGenerating}
                            generationStatus={generationStatus}
                        />
                    )}

                    {activeTab === 'auto-ai' && (
                        <AutoAITab
                            onAutoGenerate={handleAutoAI}
                            isGenerating={isGenerating}
                            generationStatus={generationStatus}
                            analysis={autoAnalysis}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {isGenerating && generationStatus && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ padding: '12px 0 0 0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <Loader2 size={14} className="bg-spinner" />
                            <span>{generationStatus}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Apply Button */}
            <div className="popup-footer">
                <button
                    type="button"
                    className="popup-button-apply"
                    onClick={() => applyBackground(previewBg || '', true)}
                    disabled={isIsolating || isGenerating || !previewBg}
                    style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                        background: '#007AFF', color: '#fff', height: '52px', borderRadius: '16px',
                        fontWeight: 600, fontSize: '16px', border: 'none', width: '100%',
                        boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)', cursor: 'pointer',
                        opacity: (isIsolating || isGenerating || !previewBg) ? 0.7 : 1, transition: 'all 0.2s ease'
                    }}
                >
                    {(isIsolating || isGenerating) ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>{isIsolating ? 'Isolating...' : 'Applying...'}</span>
                        </>
                    ) : (
                        'Apply Background'
                    )}
                </button>
            </div>
        </div>
    );
});

BackgroundStudio.displayName = 'BackgroundStudio';

const TemplatesTab = memo(({ selectedTemplate, onSelect, isGenerating, searchQuery, onSearchChange }) => {
    const filteredTemplates = useMemo(() => {
        if (!searchQuery.trim()) return BACKGROUNDS;
        const q = searchQuery.toLowerCase();
        return BACKGROUNDS.filter(bg => 
            bg.label.toLowerCase().includes(q) || 
            bg.id.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="popup-group" style={{ padding: '0 16px' }}>
                {/* Search Bar */}
                <div className="popup-separator" style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <div style={{ position: 'relative' }}>
                        <ImageIcon size={16} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                        <input 
                            type="text"
                            placeholder="Search backgrounds..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            style={{
                                width: '100%', padding: '0 0 0 28px', background: 'transparent',
                                border: 'none', outline: 'none', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                </div>

                {/* Solid Colors Section */}
                <div className="popup-separator" style={{ padding: '16px 0' }}>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>
                        Solid Backdrops
                    </div>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', padding: '2px' }}>
                        {SOLID_COLORS.map(color => (
                            <button
                                key={color.id}
                                onClick={() => !isGenerating && onSelect({ id: color.id, src: color.value })}
                                style={{
                                    flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
                                    background: color.value, cursor: 'pointer', border: selectedTemplate === color.id ? '2.5px solid #007AFF' : '1px solid rgba(0,0,0,0.08)',
                                    transition: 'all 0.2s ease', transform: selectedTemplate === color.id ? 'scale(1.1)' : 'scale(1)',
                                    boxShadow: selectedTemplate === color.id ? '0 0 10px rgba(0,122,255,0.3)' : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', padding: '4px 0 0 4px' }}>
                Style Templates
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxHeight: '280px', overflowY: 'auto', scrollbarWidth: 'none', padding: '2px' }}>
                <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((bg) => (
                        <motion.div
                            key={bg.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => !isGenerating && onSelect(bg)}
                            style={{ 
                                position: 'relative', aspectRatio: '1', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                                border: selectedTemplate === bg.id ? '3px solid #007AFF' : '1px solid rgba(0,0,0,0.04)',
                                opacity: isGenerating ? 0.5 : 1, transition: 'all 0.2s ease'
                            }}
                        >
                            <img src={bg.src} alt={bg.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                            <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', color: 'white', fontSize: '10px', fontWeight: 700, textAlign: 'center', opacity: 0.9 }}>
                                {bg.label}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {filteredTemplates.length === 0 && (
                    <div style={{ gridColumn: 'span 3', padding: '40px 0', textAlign: 'center', color: '#8e8e93', fontSize: '14px' }}>
                        No results found
                    </div>
                )}
            </div>
        </div>
    );
});
TemplatesTab.displayName = 'TemplatesTab';

const AIGenerateTab = memo(({
    prompt, onPromptChange,
    style, onStyleChange,
    onGenerate, isGenerating
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="popup-group" style={{ padding: '0 16px' }}>
            <div className="popup-separator" style={{ padding: '16px 0' }}>
                <textarea
                    placeholder="Describe your perfect setting..."
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    disabled={isGenerating}
                    style={{
                        width: '100%', height: '80px', padding: '0', background: 'transparent',
                        border: 'none', outline: 'none', fontSize: '15px', fontWeight: 500,
                        color: 'var(--text-primary)', resize: 'none'
                    }}
                />
            </div>
            <div className="popup-separator" style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={14} color="#007AFF" />
                <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' }}>Standard AI Styles</span>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', paddingLeft: '4px' }}>
            {STYLE_PRESETS.map((s) => (
                <button
                    key={s.id}
                    onClick={() => onStyleChange(s.id)}
                    disabled={isGenerating}
                    style={{
                        flexShrink: 0, padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                        transition: 'all 0.2s ease', border: '1px solid',
                        borderColor: style === s.id ? 'transparent' : 'rgba(0,0,0,0.06)',
                        backgroundColor: style === s.id ? 'var(--text-primary)' : 'var(--card-bg)',
                        color: style === s.id ? 'var(--card-bg)' : 'var(--text-secondary)',
                        boxShadow: style === s.id ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    {s.label}
                </button>
            ))}
        </div>

        <button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="popup-button-apply"
            style={{ 
                marginTop: '16px', background: '#007AFF', color: '#fff',
                height: '52px', borderRadius: '16px', fontWeight: 600, fontSize: '16px', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)', cursor: 'pointer',
                opacity: (isGenerating || !prompt.trim()) ? 0.6 : 1, transition: 'all 0.2s ease'
            }}
        >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isGenerating ? 'Imagining...' : 'Generate Scene'}
        </button>
    </div>
));
AIGenerateTab.displayName = 'AIGenerateTab';

const AutoAITab = memo(({ onAutoGenerate, isGenerating, analysis }) => (
    <div className="popup-group" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #5856D6, #AF52DE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(88,86,214,0.3)' }}>
            <Bot size={32} />
        </div>
        
        <div>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Vision AI</h5>
            <p style={{ margin: '0', fontSize: '13px', fontWeight: 500, color: '#8e8e93', lineHeight: 1.4 }}>
                AI analyzes your subject and creates a tailored atmosphere.
            </p>
        </div>
        
        {analysis && (
            <div style={{ padding: '12px 16px', background: 'rgba(88,86,214,0.06)', borderRadius: '14px', border: '1px solid rgba(88,86,214,0.1)', width: '100%' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#5856D6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>AI Analysis</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontStyle: 'italic' }}>"{analysis}"</div>
            </div>
        )}

        <button
            onClick={onAutoGenerate}
            disabled={isGenerating}
            className="popup-button-apply"
            style={{ 
                marginTop: '8px', background: 'black', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: isGenerating ? 0.6 : 1
            }}
        >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
            {isGenerating ? 'Analyzing...' : 'Auto-Match Background'}
        </button>
    </div>
));
AutoAITab.displayName = 'AutoAITab';

export default BackgroundStudio;
