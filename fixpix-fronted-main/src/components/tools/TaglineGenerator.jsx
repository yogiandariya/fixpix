import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Loader2, Copy, Check, ClipboardCopy,
    Type
} from 'lucide-react';
import { useImage } from '../../context/ImageContext';
import { apiEndpoints } from '../../lib/api';

/**
 * TaglineGenerator — AI-Powered Caption & Tagline Tool
 *
 * Analyzes image context and generates:
 *  - Short catchy tagline
 *  - Instagram-style caption
 *  - Ad-style headline
 *
 * Supports multiple tone styles and quick presets.
 * Uses existing LLM pipeline (NVIDIA DeepSeek / Groq).
 */

// ─── Style Presets ───
const STYLE_PRESETS = [
    { id: 'professional', label: '💼 Professional', emoji: '💼' },
    { id: 'instagram', label: '📸 Instagram', emoji: '📸' },
    { id: 'product_ad', label: '🛍 Product Ad', emoji: '🛍' },
    { id: 'romantic', label: '❤️ Romantic', emoji: '❤️' },
    { id: 'funny', label: '😂 Funny', emoji: '😂' },
    { id: 'luxury', label: '👑 Luxury', emoji: '👑' },
    { id: 'emotional', label: '🥺 Emotional', emoji: '🥺' },
];

// ─── Utility: image to base64 description ───
async function getImageDescription(imageSrc) {
    // For now, we provide a generic description prompt that the LLM will use
    // In a vision-enabled setup, we'd send the actual image
    // The LLM will generate taglines based on the description we provide
    return 'A high-quality photograph uploaded by the user for professional editing and content creation';
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

const TaglineGenerator = memo(() => {
    const { originalImage, processedImage } = useImage();
    const currentImage = processedImage || originalImage;

    const [selectedStyle, setSelectedStyle] = useState('professional');
    const [customDesc, setCustomDesc] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [taglineData, setTaglineData] = useState(null);
    const [error, setError] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    // ─── Generate Tagline ───
    const handleGenerate = useCallback(async () => {
        if (!currentImage) return;
        
        setIsGenerating(true);
        setError(null);
        setTaglineData(null);

        try {
            // 1. Get image data (base64)
            // If currentImage is already a data URL, use it directly
            // Otherwise, we'd need to fetch and convert, but in this editor it's usually already a data URL or accessible
            let imageData = currentImage;

            // 2. Build description from user input or auto-detect
            let description = customDesc.trim();
            if (!description) {
                description = 'A visually striking photograph showcasing a subject in high detail';
            }

            const response = await fetch(apiEndpoints.intelligence.generateTagline, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageData,
                    description,
                    style: selectedStyle,
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || `Generation failed (${response.status})`);
            }

            const data = await response.json();

            if (data.tagline || data.caption || data.headline) {
                setTaglineData(data);
            } else {
                throw new Error('No tagline data returned');
            }
        } catch (err) {
            console.error('Tagline generation failed:', err);
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    }, [currentImage, customDesc, selectedStyle]);

    // ─── Copy Text ───
    const handleCopy = useCallback(async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    }, []);

    // ─── Copy All ───
    const handleCopyAll = useCallback(() => {
        if (!taglineData) return;
        const all = `✨ Tagline: ${taglineData.tagline}\n\n📸 Caption: ${taglineData.caption}\n\n🎯 Headline: ${taglineData.headline}`;
        handleCopy(all, 'all');
    }, [taglineData, handleCopy]);

    // ═══════ RENDER ═══════

    return (
        <div className="tagline-studio">
            {/* Header */}
            <div className="tagline-header">
                <div className="tagline-header-icon">
                    <Type size={15} strokeWidth={2} />
                </div>
                <div className="tagline-header-text">
                    <h4>AI Tagline Generator</h4>
                    <p>Generate captions, taglines & headlines</p>
                </div>
            </div>

            {/* Style Presets */}
            <div className="tagline-presets">
                {STYLE_PRESETS.map((preset) => (
                    <motion.button
                        key={preset.id}
                        className={`tagline-preset-chip ${selectedStyle === preset.id ? 'active' : ''}`}
                        onClick={() => setSelectedStyle(preset.id)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {preset.label}
                    </motion.button>
                ))}
            </div>

            {/* Optional Description Input */}
            <textarea
                className="tagline-desc-input"
                placeholder="Describe your image (optional) — e.g. &quot;sunset portrait of a couple&quot;, &quot;luxury watch product shot&quot;..."
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                rows={2}
                disabled={isGenerating}
            />

            {/* Generate Button */}
            <motion.button
                className="tagline-gen-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
                whileHover={!isGenerating ? { scale: 1.02 } : {}}
                whileTap={!isGenerating ? { scale: 0.97 } : {}}
            >
                {isGenerating ? (
                    <>
                        <Loader2 size={16} className="tagline-spinner" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        ✨ Generate Tagline
                    </>
                )}
            </motion.button>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            margin: '0 14px 8px',
                            padding: '8px 12px',
                            borderRadius: 10,
                            background: 'rgba(255, 59, 48, 0.08)',
                            border: '1px solid rgba(255, 59, 48, 0.15)',
                            fontSize: 12,
                            color: '#FF3B30',
                        }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading Shimmer */}
            {isGenerating && (
                <div className="tagline-shimmer">
                    <div className="tagline-shimmer-line" style={{ width: '70%' }} />
                    <div className="tagline-shimmer-line" style={{ width: '100%' }} />
                    <div className="tagline-shimmer-line" style={{ width: '85%' }} />
                </div>
            )}

            {/* Results */}
            <AnimatePresence>
                {taglineData && !isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="tagline-results">
                            {/* Tagline Card */}
                            <TaglineCard
                                label="Tagline"
                                emoji="✨"
                                text={taglineData.tagline}
                                highlight
                                copied={copiedField === 'tagline'}
                                onCopy={() => handleCopy(taglineData.tagline, 'tagline')}
                            />

                            {/* Caption Card */}
                            <TaglineCard
                                label="Caption"
                                emoji="📸"
                                text={taglineData.caption}
                                copied={copiedField === 'caption'}
                                onCopy={() => handleCopy(taglineData.caption, 'caption')}
                            />

                            {/* Headline Card */}
                            <TaglineCard
                                label="Headline"
                                emoji="🎯"
                                text={taglineData.headline}
                                copied={copiedField === 'headline'}
                                onCopy={() => handleCopy(taglineData.headline, 'headline')}
                            />
                        </div>

                        {/* Copy All */}
                        <div className="tagline-copy-all">
                            <motion.button
                                className="tagline-copy-all-btn"
                                onClick={handleCopyAll}
                                whileTap={{ scale: 0.95 }}
                            >
                                {copiedField === 'all' ? (
                                    <>
                                        <Check size={12} />
                                        Copied All!
                                    </>
                                ) : (
                                    <>
                                        <ClipboardCopy size={12} />
                                        Copy All
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

TaglineGenerator.displayName = 'TaglineGenerator';

// ═══════════════════════════════════════════════════════
// RESULT CARD
// ═══════════════════════════════════════════════════════

const TaglineCard = memo(({ label, emoji, text, highlight, copied, onCopy }) => (
    <motion.div
        className="tagline-card"
        whileHover={{ translateY: -1 }}
        transition={{ duration: 0.15 }}
    >
        <div className="tagline-card-label">
            <span>{label}</span>
            <span className="tagline-emoji">{emoji}</span>
        </div>
        <p className={`tagline-card-text ${highlight ? 'highlight' : ''}`}>
            {text}
        </p>
        <button
            className={`tagline-copy-btn ${copied ? 'copied' : ''}`}
            onClick={onCopy}
        >
            {copied ? (
                <>
                    <Check size={10} />
                    Copied!
                </>
            ) : (
                <>
                    <Copy size={10} />
                    Copy
                </>
            )}
        </button>
    </motion.div>
));

TaglineCard.displayName = 'TaglineCard';

export default TaglineGenerator;
