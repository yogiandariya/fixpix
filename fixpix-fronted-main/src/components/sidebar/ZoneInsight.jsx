import React, { useEffect } from 'react';
import { useCommand } from '../../context/CommandContext';
import { useImage } from '../../context/ImageContext';
import { Sparkles, AlertTriangle, ScanEye, User, Maximize, Palette, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RECIPES } from '../../data/CommandRegistry';

// ─────────────────────────────────────────────────────────────
// RECIPE CHIP COMPONENT
// ─────────────────────────────────────────────────────────────

const RecipeChip = ({ recipe, onClick, active }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(recipe.id)}
        className={`
            flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[12px] font-bold transition-all uppercase tracking-tight
            ${active
                ? 'bg-accent text-white shadow-lg shadow-accent/20 border border-white/20'
                : 'bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--fill-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/30'
            }
        `}
    >
        <span className="opacity-80">{recipe.label.split(' ')[0]}</span>
        <span>{recipe.label.split(' ').slice(1).join(' ')}</span>
    </motion.button>
);

// ─────────────────────────────────────────────────────────────
// INSIGHT CARD COMPONENT
// ─────────────────────────────────────────────────────────────

const InsightCard = ({ icon: Icon, label, value, color = 'blue', action }) => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
            flex items-center justify-between p-3.5 rounded-2xl
            bg-[var(--surface-secondary)] border border-[var(--border-subtle)] shadow-sm
        `}
    >
        <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-${color}-500/10`}>
                <Icon size={14} className={`text-${color}-500`} />
            </div>
            <span className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-tight">{label}</span>
        </div>
        <span className={`text-[13px] font-black text-${color}-500`}>{value}</span>
    </motion.div>
);

// ─────────────────────────────────────────────────────────────
// MAIN ZONE INSIGHT
// ─────────────────────────────────────────────────────────────

const ZoneInsight = ({ isMobile }) => {
    const { aiInsights, analyzeImage, applyRecipe, pendingQueue } = useCommand();
    const { originalImage } = useImage();

    // Trigger analysis when image changes
    useEffect(() => {
        if (originalImage) {
            analyzeImage(originalImage);
        }
    }, [originalImage, analyzeImage]);

    // Don't render if no image
    if (!originalImage) return null;

    const recipeIds = Object.keys(RECIPES);

    return (
        <div className="bg-[var(--glass-bg-solid)] border border-[var(--border-subtle)] p-5 space-y-5 z-10 sticky top-0 backdrop-blur-2xl rounded-[32px] shadow-[var(--shadow-panel)] mx-1 mt-1 mb-4">

            {/* ─── Header ─── */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${aiInsights.analyzing ? 'bg-accent/20' : 'bg-accent/10 border border-accent/20'}`}>
                        <Sparkles className={`w-4 h-4 ${aiInsights.analyzing ? 'text-accent animate-pulse' : 'text-accent'}`} />
                    </div>
                    <span className="text-[13px] font-black uppercase tracking-[0.1em] text-[var(--text-primary)]">
                        {aiInsights.analyzing ? 'Neural Analysis...' : 'Image Insights'}
                    </span>
                </div>

                {!aiInsights.analyzing && aiInsights.quality && (
                    <span className={`
                        text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg
                        ${aiInsights.quality === 'low'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }
                    `}>
                        {aiInsights.quality} res
                    </span>
                )}
            </div>

            {/* ─── Analysis Results ─── */}
            <AnimatePresence>
                {!aiInsights.analyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                    >
                        {/* Warning Banner */}
                        {aiInsights.quality === 'low' && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[12px] text-amber-600 dark:text-amber-200 font-bold uppercase tracking-tight m-0">Low Resolution</p>
                                    <p className="text-[11px] text-amber-600/70 dark:text-amber-200/60 leading-relaxed mt-0.5 m-0 font-medium">
                                        Recommend upscaling for best results.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Detection Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            {aiInsights.facesDetected > 0 && (
                                <InsightCard
                                    icon={User}
                                    label="Faces"
                                    value={aiInsights.facesDetected}
                                    color="blue"
                                />
                            )}
                            {aiInsights.isGrayscale && (
                                <InsightCard
                                    icon={Palette}
                                    label="Mono"
                                    value="Positive"
                                    color="purple"
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Quick Recipes ─── */}
            <div className="space-y-2">
                <p className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                    Quick Actions
                </p>
                <div className="flex flex-wrap gap-2">
                    {recipeIds.map(id => (
                        <RecipeChip
                            key={id}
                            recipe={RECIPES[id]}
                            onClick={(recipeId) => {
                                if (RECIPES[recipeId]?.isSticker) {
                                    // Trigger sticker studio UI
                                    const stickerHeader = document.querySelector('.sticker-header');
                                    if (stickerHeader) {
                                        // Open if closed
                                        if (!stickerHeader.classList.contains('open')) {
                                            stickerHeader.click();
                                        }
                                        // Scroll into view
                                        stickerHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                } else {
                                    applyRecipe(recipeId);
                                }
                            }}
                            active={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ZoneInsight;
