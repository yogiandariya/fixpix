import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { useToast } from '../ui/Toast';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';
import ActionCard from './ActionCard';
import { 
    Eraser, 
    Wand2, 
    Sparkles, 
    ImagePlus, 
    Loader2, 
    ChevronDown, 
    Upload, 
    Sliders, 
    X,
    Smile,
    Scaling
} from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ZoneMagic - The Unified AI Magic Toolkit
 * Consolidates Creation, Editing, Restoration, and Enhancement
 */

// ─── Sub-components ───

const PromptInput = memo(({ value, onChange, placeholder, disabled }) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
                "w-full rounded-xl p-3 text-[14px] resize-none h-20 gpu-accelerated",
                "bg-black/[0.03] dark:bg-white/[0.06]",
                "border border-black/[0.04] dark:border-white/[0.08]",
                "text-[var(--text-primary)]",
                "placeholder:text-[var(--text-tertiary)]",
                "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]/50",
                "transition-all duration-150",
                "disabled:opacity-50"
            )}
        />
    );
});
PromptInput.displayName = 'PromptInput';

const STYLES = [
    { label: 'Realistic', value: 'realistic' },
    { label: 'Cinematic', value: 'cinematic' },
    { label: 'Digital Art', value: 'digital-art' },
    { label: 'Anime', value: 'anime' },
    { label: 'Fantasy', value: 'fantasy' }
];

const StyleSelector = memo(({ value, onChange, disabled }) => {
    return (
        <div>
            <label className="text-[12px] font-medium opacity-60 mb-1.5 block">Style</label>
            <div className="grid grid-cols-2 gap-2">
                {STYLES.map(s => (
                    <button
                        key={s.value}
                        onClick={() => onChange(s.value)}
                        disabled={disabled}
                        className={cn(
                            "px-3 py-2 rounded-lg text-[12px] font-medium transition-all",
                            value === s.value
                                ? "bg-[var(--accent)] text-white shadow-sm"
                                : "bg-black/[0.03] dark:bg-white/[0.06] text-[var(--text-secondary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.1]"
                        )}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
});
StyleSelector.displayName = 'StyleSelector';

const ZoneMagic = memo(({ isMobile }) => {
    const { enterMode } = useCommand();
    const { 
        updateSettings, 
        isGenerating, 
        originalImage,
        settings
    } = useImage();
    const { applyFeature } = useFeatureApply();
    const toast = useToast();

    // Local states
    const [genPrompt, setGenPrompt] = useState('');
    const [style, setStyle] = useState('realistic');
    const [editPrompt, setEditPrompt] = useState('');
    const [editStrength, setEditStrength] = useState(0.7);
    const [showGenPanel, setShowGenPanel] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = React.useRef(null);

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

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (filePreview) URL.revokeObjectURL(filePreview);
            setFilePreview(URL.createObjectURL(file));
        }
    }, [filePreview]);

    const handleEditImage = useCallback(async () => {
        if (!selectedFile && !originalImage) {
            toast.warning('Please upload an image first');
            return;
        }
        if (!editPrompt.trim()) {
            toast.warning('Please enter a prompt');
            return;
        }
        await applyFeature({
            featureId: 'edit-image',
            featureName: 'AI Generative Edit',
            featureIcon: '🪄',
            endpoint: apiEndpoints.editImage,
            payload: { prompt: editPrompt, strength: editStrength }
        });
        setSelectedFile(null);
        setFilePreview(null);
    }, [selectedFile, originalImage, editPrompt, editStrength, applyFeature, toast]);

    return (
        <div className="space-y-4">
            
            {/* ═══ 1. Face Restoration ═══ */}
            <ActionCard
                id="faceRestoration"
                title="Face Restoration"
                description="Recover sharp facial details"
                icon={Smile}
                badge="AI"
                isRecommended={true}
            >
                <div className="space-y-3">
                    <p className="text-[13px] text-[var(--ios-label-tertiary)] leading-relaxed">
                        Reconstruct faces and enhance resolution of low-quality portraits.
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium opacity-60">Fidelity</span>
                        <span className="text-[var(--accent)] text-[12px] font-bold">{Math.round((settings.fidelity || 0.5) * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.fidelity || 0.5}
                        onChange={(e) => updateSettings('fidelity', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-black/[0.05] dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                    />
                </div>
            </ActionCard>

            {/* ═══ 2. Super Resolution ═══ */}
            <ActionCard
                id="upscaleX"
                title="Super Resolution"
                description="Enhance to 4K quality"
                icon={Scaling}
                badge="Premium"
            >
                <div className="space-y-3">
                    <p className="text-[13px] text-[var(--ios-label-tertiary)] leading-relaxed">
                        Upscale your image to pro-grade resolution while preserving authentic texture.
                    </p>
                    <div className="p-3 rounded-xl bg-[rgba(var(--ios-accent),0.05)] border border-[rgba(var(--ios-accent),0.1)]">
                        <span className="text-[12px] font-semibold text-[var(--accent)] flex items-center gap-2">
                            <Sparkles size={14} /> Cloud-accelerated 4X Upscale
                        </span>
                    </div>
                    {/* Value is locked to 4 for simplicity as requested */}
                    <input type="hidden" value="4" />
                </div>
            </ActionCard>

            {/* ═══ 3. Text to Image (Expandable) ═══ */}
            <div className={cn(
                "ios-material-card overflow-hidden transition-all duration-300",
                showGenPanel && "ring-1 ring-[#007AFF]/30 shadow-lg"
            )}>
                <button
                    onClick={() => setShowGenPanel(!showGenPanel)}
                    className="w-full p-4 flex items-center justify-between ios-press-scale"
                >
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-[12px] flex items-center justify-center transition-all",
                            showGenPanel ? "bg-[#007AFF] text-white" : "bg-purple-500/10 text-purple-500"
                        )}>
                            <ImagePlus size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Image Generator</h3>
                            <p className="text-[12px] text-[var(--text-tertiary)]">Create from text prompt</p>
                        </div>
                    </div>
                    <motion.div animate={{ rotate: showGenPanel ? 180 : 0 }} transition={{ duration: 0.15 }}>
                        <ChevronDown size={16} className="opacity-40" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {showGenPanel && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/[0.01] dark:bg-white/[0.01]"
                        >
                            <div className="px-4 pb-4 space-y-4 pt-1">
                                <PromptInput 
                                    value={genPrompt} 
                                    onChange={setGenPrompt} 
                                    placeholder="A futuristic city in cyberpunk style..."
                                    disabled={isGenerating}
                                />
                                <StyleSelector 
                                    value={style} 
                                    onChange={setStyle} 
                                    disabled={isGenerating} 
                                />
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !genPrompt.trim()}
                                    className={cn(
                                        "w-full h-11 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all",
                                        isGenerating ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-[#007AFF] text-white shadow-md active:scale-95"
                                    )}
                                >
                                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    {isGenerating ? "Generating..." : "Generate Magic"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ═══ 4. AI Generative Edit ═══ */}
            <ActionCard
                id="editImage"
                title="AI Generative Edit"
                description="Modify content via prompt"
                icon={Wand2}
                badge="Img2Img"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[12px] font-medium opacity-60">Modification Prompt</label>
                        <PromptInput
                            value={editPrompt}
                            onChange={setEditPrompt}
                            placeholder="Change background to a tropical beach..."
                            disabled={isGenerating}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[12px]">
                            <span className="opacity-60 font-medium">Magic Strength</span>
                            <span className="text-[var(--accent)] font-bold">{Math.round(editStrength * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={editStrength}
                            onChange={(e) => setEditStrength(parseFloat(e.target.value))}
                            disabled={isGenerating}
                            className="w-full accent-[var(--accent)] h-1.5 bg-black/[0.05] dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <button
                        onClick={handleEditImage}
                        disabled={isGenerating || (!originalImage && !selectedFile) || !editPrompt.trim()}
                        className={cn(
                            "w-full h-11 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all",
                            isGenerating ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-black dark:bg-white text-white dark:text-black shadow-md active:scale-95"
                        )}
                    >
                        {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                        Apply AI Magic
                    </button>
                </div>
            </ActionCard>

        </div>
    );
});

ZoneMagic.displayName = 'ZoneMagic';

export default ZoneMagic;
