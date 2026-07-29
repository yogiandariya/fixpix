import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, Scissors, Wand2, Sparkles, ImagePlus, Loader2, ChevronDown, Upload, X, Sliders } from 'lucide-react';
import ToolCard from '../editor/ToolCard';
import { useImage } from '../../context/ImageContext';
import { useCommand } from '../../context/CommandContext';
import { useToast } from '../ui/Toast';
import { useDebouncedCallback } from '../../hooks/useDebounce';
import { apiEndpoints } from '../../lib/api';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { cn } from '../../lib/utils';

/**
 * CreateTools - Creative Tool Panel
 * Uses new ToolCard component from EDITOR_REDESIGN_SPEC
 * 
 * Tools:
 * - Text to Image (AI)
 * - Magic Eraser (focus mode)
 * - Remove Background
 * - Generative Edit
 */

const STYLES = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'anime', label: 'Anime' },
];



const CreateTools = memo(() => {
    const { 
        updateSettings, 
        settings, 
        isGenerating, 
        generationError,
        originalImage
    } = useImage();
    const { applyFeature } = useFeatureApply();
    const { toggleCommand, pendingQueue, enterMode } = useCommand();
    const toast = useToast();

    const [prompt, setPrompt] = useState('');
    const [genPrompt, setGenPrompt] = useState('');
    const [style, setStyle] = useState('realistic');

    const [showGenPanel, setShowGenPanel] = useState(true);

    // Edit Image State
    const [editPrompt, setEditPrompt] = useState('');
    const [editStrength, setEditStrength] = useState(0.7);

    const [isOptimizing, setIsOptimizing] = useState(false);

    // Debounced settings update
    const debouncedUpdateSettings = useDebouncedCallback((value) => {
        updateSettings('prompt', value);
    }, 200);

    const handleEraserClick = useCallback(() => {
        enterMode('eraser');
    }, [enterMode]);

    const handlePromptChange = useCallback((e) => {
        const value = e.target.value;
        setPrompt(value);
        debouncedUpdateSettings(value);
    }, [debouncedUpdateSettings]);

    const handleGenerate = useCallback(async () => {
        if (!genPrompt.trim()) {
            toast.warning('Please enter a prompt');
            return;
        }
        await applyFeature({
            featureId: 'text-to-image',
            featureName: 'Image Generator',
            featureIcon: '🖼️',
            endpoint: apiEndpoints.generateImageBinary,
            payload: { prompt: genPrompt, style },
            requiresImage: false,
            isNewImage: true
        });
    }, [genPrompt, style, applyFeature, toast]);


    const handleEditImage = async () => {
        if (!editPrompt.trim()) {
            toast.warning('Please enter a description for the edit');
            return;
        }

        await applyFeature({
            featureId: 'edit-image',
            featureName: 'AI Generative Edit',
            featureIcon: '🪄',
            endpoint: apiEndpoints.editImage,
            payload: { prompt: editPrompt, strength: editStrength }
        });
    };

    const handleOptimizePrompt = async (target, currentPrompt, setter) => {
        if (!currentPrompt.trim()) {
            toast.warning('Please enter a prompt first');
            return;
        }

        setIsOptimizing(true);
        try {
            const response = await fetch(apiEndpoints.intelligence.optimizePrompt, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: currentPrompt })
            });

            const data = await response.json();
            if (data.optimized_prompt) {
                setter(data.optimized_prompt);
                if (target === 'main') {
                    debouncedUpdateSettings(data.optimized_prompt);
                }
                toast.success('Prompt optimized successfully!');
            } else {
                toast.error('Failed to optimize prompt');
            }
        } catch (error) {
            console.error('Optimization error:', error);
            toast.error('Error optimizing prompt');
        } finally {
            setIsOptimizing(false);
        }
    };

    // Sync local state to global settings whenever they change
    useEffect(() => {
        updateSettings({
            editPrompt: editPrompt,
            editStrength: editStrength
        });
    }, [editPrompt, editStrength, updateSettings]);

    const isToolActive = (id) => settings && !!settings[id];
    const isToolPending = (id) => pendingQueue && id in pendingQueue;

    return (
        <div className="space-y-3">
            {/* ═══ Text to Image (AI) ═══ */}
            <motion.div
                style={{
                    borderRadius: 'var(--radius-xl)',
                    border: `1px solid ${showGenPanel ? 'rgba(0,122,255,0.35)' : 'var(--tool-card-border, rgba(255,255,255,0.06))'}`,
                    background: 'var(--tool-card-bg, rgba(255,255,255,0.04))',
                    transition: 'all 180ms ease',
                }}
                layout
            >
                {/* Header Row */}
                <motion.button
                    onClick={() => setShowGenPanel(!showGenPanel)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: '14px 16px',
                        minHeight: 60,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'inherit',
                    }}
                >
                    <div style={{
                        width: 36, height: 36,
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: showGenPanel ? '#007AFF' : 'rgba(147,51,234,0.1)',
                        color: showGenPanel ? '#fff' : '#9333EA',
                        transition: 'all 180ms ease',
                    }}>
                        <ImagePlus size={18} strokeWidth={1.75} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.2px' }}>
                                Text to Image
                            </span>
                            <span style={{
                                padding: '2px 6px',
                                fontSize: 10, fontWeight: 700,
                                textTransform: 'uppercase',
                                background: 'rgba(147,51,234,0.1)',
                                color: '#9333EA',
                                borderRadius: 6,
                            }}>
                                AI
                            </span>
                        </div>
                        <p style={{
                            fontSize: 13, marginTop: 2,
                            opacity: 0.5,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            Generate images from text prompts
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: showGenPanel ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ flexShrink: 0, opacity: 0.5 }}
                    >
                        <ChevronDown size={16} strokeWidth={1.75} />
                    </motion.div>
                </motion.button>

                {/* Expanded Generate Panel */}
                <AnimatePresence>
                    {showGenPanel && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ padding: '0 14px 14px' }}>
                                <div style={{
                                    height: 1,
                                    background: 'var(--glass-border)',
                                    marginBottom: 'var(--space-4)',
                                }} />

                                {/* Prompt Textarea */}
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label style={{
                                            fontSize: 12, fontWeight: 500,
                                            opacity: 0.6,
                                        }}>
                                            Prompt
                                        </label>
                                        <motion.button
                                            onClick={() => handleOptimizePrompt('main', genPrompt, setGenPrompt)}
                                            disabled={isOptimizing || isGenerating || !genPrompt.trim()}
                                            whileHover={{ scale: 1.05, color: '#007AFF' }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                fontSize: 11, fontWeight: 600,
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                padding: '2px 8px', borderRadius: 6,
                                                background: 'rgba(0,122,255,0.08)',
                                                color: '#007AFF', border: 'none', cursor: 'pointer',
                                                opacity: (isOptimizing || isGenerating || !genPrompt.trim()) ? 0.5 : 1
                                            }}
                                        >
                                            {isOptimizing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                            {isOptimizing ? 'Optimizing...' : 'Optimize'}
                                        </motion.button>
                                    </div>
                                    <textarea
                                        value={genPrompt}
                                        onChange={(e) => setGenPrompt(e.target.value)}
                                        placeholder="Describe the image you want..."
                                        disabled={isGenerating}
                                        className={cn(
                                            "w-full rounded-xl p-3 text-[14px] resize-none h-20",
                                            "bg-[rgba(var(--studio-glow),0.04)]",
                                            "border border-[var(--glass-border)]",
                                            "text-[var(--ios-text-primary)]",
                                            "placeholder:text-[var(--ios-text-tertiary)]",
                                            "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]/50",
                                            "transition-all duration-150",
                                            "disabled:opacity-50"
                                        )}
                                    />
                                

                                {/* Style Selection */}
                                <div style={{
                                    marginBottom: 'var(--space-3)',
                                }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 12, fontWeight: 500,
                                        opacity: 0.6,
                                        marginBottom: 6,
                                    }}>
                                        Style
                                    </label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        disabled={isGenerating}
                                        className={cn(
                                            "w-full rounded-lg px-3 py-2 text-[13px]",
                                            "bg-[rgba(var(--studio-glow),0.04)]",
                                            "border border-[var(--glass-border)]",
                                            "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20",
                                            "transition-all duration-150",
                                            "disabled:opacity-50"
                                        )}
                                        style={{ color: 'inherit', appearance: 'none', cursor: 'pointer' }}
                                    >
                                        {STYLES.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Generate Button */}
                                <motion.button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !genPrompt.trim()}
                                    whileHover={!isGenerating && genPrompt.trim() ? { filter: 'brightness(1.05)' } : {}}
                                    whileTap={!isGenerating && genPrompt.trim() ? { scale: 0.97 } : {}}
                                    style={{
                                        width: '100%',
                                        height: 44,
                                        borderRadius: 'var(--radius-lg)',
                                        border: 'none',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: isGenerating || !genPrompt.trim() ? 'not-allowed' : 'pointer',
                                        background: isGenerating ? 'rgba(0,122,255,0.12)' : genPrompt.trim() ? '#007AFF' : 'rgba(255,255,255,0.06)',
                                        color: genPrompt.trim() && !isGenerating ? '#fff' : 'inherit',
                                        opacity: isGenerating || !genPrompt.trim() ? 0.6 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        transition: 'all 180ms ease',
                                        boxShadow: genPrompt.trim() && !isGenerating
                                            ? 'inset 0 1px 0 rgba(255,255,255,0.25)'
                                            : 'none',
                                    }}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Generating image...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={14} />
                                            <span>Generate Image</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ═══ Edit Image (AI) ═══ */}
            <ToolCard
                id="editImage"
                icon={Wand2}
                title="Edit Image"
                description="Modify canvas image with AI prompt"
                isActive={isToolActive('editImage')}
                isPending={isToolPending('editImage')}
                onToggle={(active) => toggleCommand('editImage', active)}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--ios-text-secondary)]">
                                <Sparkles size={14} className="text-[var(--accent-primary)]" />
                                <span>Modification Prompt</span>
                            </div>
                            <motion.button
                                onClick={() => handleOptimizePrompt('edit', editPrompt, setEditPrompt)}
                                disabled={isOptimizing || isGenerating || !editPrompt.trim()}
                                whileHover={{ scale: 1.05, color: '#007AFF' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    fontSize: 11, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    padding: '2px 8px', borderRadius: 6,
                                    background: 'rgba(0,122,255,0.08)',
                                    color: '#007AFF', border: 'none', cursor: 'pointer',
                                    opacity: (isOptimizing || isGenerating || !editPrompt.trim()) ? 0.5 : 1
                                }}
                            >
                                {isOptimizing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                {isOptimizing ? 'Optimizing...' : 'Optimize'}
                            </motion.button>
                        </div>
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="Describe the changes (e.g. 'convert to anime style')..."
                            className={cn(
                                "w-full rounded-xl p-3 text-[14px] resize-none h-24",
                                "bg-[rgba(var(--studio-glow),0.04)]",
                                "border border-[var(--glass-border)]",
                                "text-[var(--ios-text-primary)]",
                                "placeholder:text-[var(--ios-text-tertiary)]",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]/50",
                                "transition-all duration-150"
                            )}
                            disabled={isGenerating}
                        />
                    </div>
                    {/* Strength Slider */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[12px] font-medium text-[var(--ios-text-primary)]">
                            <span className="opacity-60 flex items-center gap-1.5">
                                <Sliders size={12} /> Transformation Strength
                            </span>
                            <span className="text-[#007AFF]">{Math.round(editStrength * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={editStrength}
                            onChange={(e) => setEditStrength(parseFloat(e.target.value))}
                            disabled={isGenerating}
                            className="w-full h-1.5 bg-black/[0.05] dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
                        />
                        <div className="flex justify-between text-[10px] opacity-40 uppercase tracking-wider text-[var(--ios-text-tertiary)]">
                            <span>Subtle</span>
                            <span>Full Redesign</span>
                        </div>
                    </div>
                </div>
            </ToolCard>

        </div>
    );
});

CreateTools.displayName = 'CreateTools';

export default CreateTools;
