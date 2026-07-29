import React, { useEffect, useRef, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

// Lazy-load all popup components — each loads on-demand when user opens that feature
const FaceRestorePopup = React.lazy(() => import('../popups/FaceRestorePopup'));
const SuperResPopup = React.lazy(() => import('../popups/SuperResPopup'));
const MagicEraserPopup = React.lazy(() => import('../popups/MagicEraserPopup'));
const RemoveBGPopup = React.lazy(() => import('../popups/RemoveBGPopup'));
const StyleTransferPopup = React.lazy(() => import('../popups/StyleTransferPopup'));
const TextToImagePopup = React.lazy(() => import('../popups/TextToImagePopup'));
const EditImagePopup = React.lazy(() => import('../popups/EditImagePopup'));
const AITaglinePopup = React.lazy(() => import('../popups/AITaglinePopup'));
const SmartFramesPopup = React.lazy(() => import('../popups/SmartFramesPopup'));
const BatchPopup = React.lazy(() => import('../popups/BatchPopup'));
const FiltersPopup = React.lazy(() => import('../popups/FiltersPopup'));
const ChangeBGPopup = React.lazy(() => import('../popups/ChangeBGPopup'));
const StickersPopup = React.lazy(() => import('../popups/StickersPopup'));

const POPUP_MAP = {
    'face-restore': FaceRestorePopup,
    'super-res': SuperResPopup,
    'magic-eraser': MagicEraserPopup,
    'remove-bg': RemoveBGPopup,
    'style-transfer': StyleTransferPopup,
    'smart-frames': SmartFramesPopup,
    'text-to-image': TextToImagePopup,
    'edit-image': EditImagePopup,
    'ai-tagline': AITaglinePopup,
    'batch': BatchPopup,
    'smart-filters': FiltersPopup,
    'change-bg': ChangeBGPopup,
    'changebg': ChangeBGPopup,
    'sticker-studio': StickersPopup,
    'stickers': StickersPopup,
};

const GenericFallback = () => (
    <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
        Adjust configuration here.
    </p>
);

// Lightweight loading spinner for lazy popup chunks
const PopupLoadingFallback = () => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 20px',
        color: '#8e8e93',
        fontSize: '13px',
        gap: '8px'
    }}>
        <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(0,0,0,0.08)',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
        }} />
        Loading...
    </div>
);

const FeaturePopup = ({ feature, onClose }) => {
    const cardRef = useRef(null);

    // ESC key to close
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        // Focus trap: focus the card on mount
        cardRef.current?.focus();
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!feature) return null;

    const ContentComponent = POPUP_MAP[feature.id] || GenericFallback;

    return (
        <motion.div 
            className="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div 
                ref={cardRef}
                tabIndex={-1}
                className="popup-card"
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.8 }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="popup-header">
                    <div className={`feature-icon-wrap ${feature.iconClass || ''}`}>
                        {feature.icon || '✨'}
                    </div>
                    <div>
                        <div className="popup-title">{feature.name || feature.title || feature.label}</div>
                        {(feature.subtitle || feature.desc) && <div className="popup-subtitle">{feature.subtitle || feature.desc}</div>}
                    </div>
                    <button 
                        className="popup-close" 
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body — wrapped in Suspense for lazy-loaded popups */}
                <Suspense fallback={<PopupLoadingFallback />}>
                    <ContentComponent feature={feature} onClose={onClose} />
                </Suspense>
            </motion.div>
        </motion.div>
    );
};

export default FeaturePopup;
