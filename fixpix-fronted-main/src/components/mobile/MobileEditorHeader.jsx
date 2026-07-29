import { motion } from 'framer-motion';
import { ChevronLeft, Download, FilePlus2, Menu } from 'lucide-react';
import { useImage } from '../../context/ImageContext';
import MobileGenerateFAB from './MobileGenerateFAB';

/**
 * Mobile Header — Premium Frosted Glass
 * Height: 44px + safe area. Frosted glass with gradient accent.
 */
const MobileEditorHeader = ({
    title = 'FixPix',
    onBack,
    onExport,
    onReset,
    onMenu,
}) => {
    const { processedImage, originalImage, isProcessing } = useImage();
    const showDownload = (!!processedImage || !!originalImage) && !isProcessing;

    return (
        <header
            className="mobile-glass mobile-glass-border shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                paddingTop: 'env(safe-area-inset-top, 0px)',
                background: 'var(--surface-glass)',
                backdropFilter: 'blur(32px) saturate(200%)',
                WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                borderBottom: '1px solid var(--border-subtle)',
            }}
        >
            <div className="flex items-center justify-between h-[50px] px-4 sm:px-5 gap-1.5">
                {/* Left: Back */}
                <div className="flex items-center gap-2">
                    <motion.button
                        onClick={onBack}
                        whileTap={{ scale: 0.94 }}
                        className="flex items-center gap-1 text-accent font-black text-sm md:text-base lg:text-lg active:opacity-60 transition-opacity"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <ChevronLeft size={20} strokeWidth={3} />
                        <span>Back</span>
                    </motion.button>

                    {onMenu && (
                        <motion.button
                            onClick={onMenu}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-300 flex items-center justify-center border border-black/5 dark:border-white/10"
                            aria-label="Open editor menu"
                        >
                            <Menu size={18} strokeWidth={2.5} />
                        </motion.button>
                    )}
                </div>

                {/* Center: Title */}
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                    <h1 className="text-[13px] md:text-base lg:text-lg font-black text-gray-900 dark:text-white tracking-widest uppercase opacity-90 leading-tight">
                        {title}
                    </h1>
                    <div className="text-[8px] font-black text-accent tracking-[0.2em] opacity-80 -mt-0.5">NEURAL STUDIO</div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {originalImage && onReset && (
                        <motion.button
                            onClick={onReset}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 flex items-center justify-center border border-black/5 dark:border-white/10 active:scale-95 transition-all"
                        >
                            <FilePlus2 size={18} strokeWidth={2.5} />
                        </motion.button>
                    )}
                    
                    {showDownload && onExport && (
                        <motion.button
                            onClick={onExport}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20 active:scale-95 transition-all border border-white/20"
                        >
                            <Download size={18} strokeWidth={2.5} />
                        </motion.button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default MobileEditorHeader;
