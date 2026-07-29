import React, { memo, useCallback } from 'react';
import { Wand2, Loader2, Smile, Scaling, Eraser, Palette } from 'lucide-react';
import ToolCard from '../editor/ToolCard';
import AppleSlider from '../ui/AppleSlider';
import { useImage } from '../../context/ImageContext';
import { useCommand } from '../../context/CommandContext';
import { useToast } from '../ui/Toast';
import { apiEndpoints } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import BackgroundStudio from './BackgroundStudio';
import TaglineGenerator from './TaglineGenerator';
import FrameStudio from './FrameStudio';
import StickerStudio from './StickerStudio';

/**
 * AIStudioTools - Unified AI Processing Panel
 * 
 * Tools:
 * - Face Restoration — recover facial details
 * - Super Resolution — enhance to 4K (Conservative Upscaler)
 * - Remove Background — transparent background
 * - Colorize — AI colorization for B&W photos
 */

// Labeled Slider Component
const LabeledSlider = memo(({ label, value, onChange, min, max, step }) => (
    <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-[var(--ios-text-secondary)]">
                {label}
            </span>
            <span className="text-[13px] font-bold tabular-nums text-[var(--accent-primary)] bg-[rgba(var(--studio-glow),0.1)] px-2 py-0.5 rounded-md">
                {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
        </div>
        <AppleSlider
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
        />
    </div>
));

LabeledSlider.displayName = 'LabeledSlider';

const AIStudioTools = memo(() => {
    const { updateSettings, settings, isMasking, setIsMasking } = useImage();
    const { toggleCommand, pendingQueue } = useCommand();
    const toast = useToast();
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleOptimizeStylePrompt = async () => {
        const currentPrompt = settings?.prompt || '';
        if (!currentPrompt.trim()) {
            toast.warning('Please enter a style description first');
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
                updateSettings('prompt', data.optimized_prompt);
                toast.success('Style optimized successfully!');
            } else {
                toast.error('Failed to optimize prompt');
            }
        } catch (error) {
            console.error('Optimization error:', error);
            toast.error('Error optimizing style');
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleFidelityChange = useCallback((val) => {
        updateSettings('fidelity', val);
    }, [updateSettings]);

    const isToolActive = (id) => settings && !!settings[id];
    const isToolPending = (id) => pendingQueue && id in pendingQueue;

    return (
        <div className="space-y-3">
            {/* Section Label */}
            <div className="px-1 pb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ios-text-secondary)] opacity-60">
                    AI Processing
                </p>
            </div>

            {/* Face Restoration */}
            <ToolCard
                id="faceRestoration"
                icon={Smile}
                title="Face Restoration"
                description="Recover facial details with AI"
                isActive={isToolActive('faceRestoration')}
                isPending={isToolPending('faceRestoration')}
                onToggle={(active) => toggleCommand('faceRestoration', active)}
            >
                <LabeledSlider
                    label="Restoration Strength"
                    value={(settings && settings.fidelity) || 0.5}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleFidelityChange}
                />
            </ToolCard>

            {/* Face Restoration */}

            {/* Super Resolution (Conservative Upscaler) */}
            <ToolCard
                id="upscaleX"
                icon={Scaling}
                title="Super Resolution"
                description="Enhance image to 4K quality"
                isActive={isToolActive('upscaleX')}
                isPending={isToolPending('upscaleX')}
                onToggle={(active) => toggleCommand('upscaleX', active ? 4 : false)}
            />

            {/* Magic Eraser (Object Removal) */}
            <ToolCard
                id="isMasking"
                icon={Wand2}
                title="Magic Eraser"
                description="Brush over objects to remove them"
                isActive={isMasking}
                isPending={isToolPending('inpaint')}
                onToggle={(active) => setIsMasking(active)}
            />

            {/* Remove Background */}
            <ToolCard
                id="removeBg"
                icon={Eraser}
                title="Remove Background"
                description="AI-powered background removal"
                isActive={isToolActive('removeBg')}
                isPending={isToolPending('removeBg')}
                onToggle={(active) => toggleCommand('removeBg', active)}
            />

            {/* Background Studio — appears when Remove BG is active/completed */}
            <AnimatePresence>
                {(isToolActive('removeBg') || isToolPending('removeBg')) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <BackgroundStudio />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Style Transfer */}
            <ToolCard
                id="styleTransfer"
                icon={Palette}
                title="Style Transfer"
                description="Apply artistic style to your image"
                isActive={isToolActive('styleTransfer')}
                isPending={isToolPending('styleTransfer')}
                onToggle={(active) => toggleCommand('styleTransfer', active)}
            >
                <div className="space-y-4 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                    {/* Prompts */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[11px] font-medium text-[var(--ios-text-secondary)] uppercase">
                                Prompt
                            </label>
                            <motion.button
                                onClick={handleOptimizeStylePrompt}
                                disabled={isOptimizing || !settings?.prompt?.trim()}
                                whileHover={{ scale: 1.05, color: '#007AFF' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    fontSize: 10, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    padding: '2px 6px', borderRadius: 4,
                                    background: 'rgba(0,122,255,0.08)',
                                    color: '#007AFF', border: 'none', cursor: 'pointer',
                                    opacity: (isOptimizing || !settings?.prompt?.trim()) ? 0.5 : 1,
                                    textTransform: 'uppercase'
                                }}
                            >
                                {isOptimizing ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                                {isOptimizing ? 'Optimizing...' : 'Optimize'}
                            </motion.button>
                        </div>
                        <textarea
                            placeholder="Describe the desired output style..."
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[var(--accent-primary)] transition-colors min-h-[60px] resize-none"
                            value={settings?.prompt || ''}
                            onChange={(e) => updateSettings('prompt', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-medium text-[var(--ios-text-secondary)] uppercase px-1">
                            Negative Prompt
                        </label>
                        <textarea
                            placeholder="What to avoid..."
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[var(--accent-primary)] transition-colors min-h-[40px] resize-none"
                            value={settings?.negativePrompt || ''}
                            onChange={(e) => updateSettings('negativePrompt', e.target.value)}
                        />
                    </div>

                    {/* Sliders */}
                    <LabeledSlider
                        label="Style Strength"
                        value={settings?.style_strength ?? 0.5}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateSettings('style_strength', v)}
                    />

                    <LabeledSlider
                        label="Composition Fidelity"
                        value={settings?.composition_fidelity ?? 0.5}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateSettings('composition_fidelity', v)}
                    />

                    <LabeledSlider
                        label="Change Strength"
                        value={settings?.change_strength ?? 0.5}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateSettings('change_strength', v)}
                    />

                    {/* Extra Settings Row */}
                    <div className="flex gap-3 items-end pt-2">
                        <div className="flex-1 space-y-2">
                            <label className="text-[11px] font-medium text-[var(--ios-text-secondary)] uppercase px-1">
                                Seed
                            </label>
                            <input
                                type="number"
                                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-[var(--accent-primary)]"
                                value={settings?.seed ?? 0}
                                onChange={(e) => updateSettings('seed', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-[11px] font-medium text-[var(--ios-text-secondary)] uppercase px-1">
                                Format
                            </label>
                            <select
                                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-2 py-1.5 text-[13px] outline-none focus:border-[var(--accent-primary)] text-white"
                                value={settings?.output_format || 'jpeg'}
                                onChange={(e) => updateSettings('output_format', e.target.value)}
                            >
                                <option value="jpeg">JPEG</option>
                                <option value="png">PNG</option>
                                <option value="webp">WebP</option>
                            </select>
                        </div>
                    </div>
                </div>
            </ToolCard>

            {/* AI Tagline Generator */}
            <TaglineGenerator />

            {/* Smart Frame & Sticker Studio - AI powered overlays */}
            <FrameStudio />

            {/* AI Sticker Generator */}
            <StickerStudio />

        </div>
    );
});

AIStudioTools.displayName = 'AIStudioTools';

export default AIStudioTools;
