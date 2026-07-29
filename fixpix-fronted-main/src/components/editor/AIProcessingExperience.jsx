// src/components/editor/AIProcessingExperience.jsx
// Unified AI Processing Experience — Premium Canvas Overlay
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCanvasStore from '../../store/canvasStore';
import { useAuth } from '../../context/AuthContext';
import '../../styles/processing-experience.css';

// ─────────────────────────────────────────────────────
// FEATURE-SPECIFIC CONTENT MAP
// ─────────────────────────────────────────────────────
const FEATURE_CONFIG = {
  'face-restore': {
    title: 'Rebuilding facial details...',
    icon: '🧑',
    color: '#3b82f6',
    steps: [
      'Detecting faces in image...',
      'Analyzing facial structure...',
      'Enhancing skin tones...',
      'Balancing exposure...',
      'Sharpening edges...',
      'Applying restoration...'
    ]
  },
  'smart-filters': {
    title: 'Applying cinematic style...',
    icon: '🎨',
    color: '#8b5cf6',
    steps: [
      'Analyzing color palette...',
      'Mapping tonal curves...',
      'Adjusting luminance range...',
      'Blending cinematic effects...',
      'Finalizing render...'
    ]
  },
  'remove-bg': {
    title: 'Separating subject from background...',
    icon: '✂️',
    color: '#f43f5e',
    steps: [
      'Detecting main subject...',
      'Generating alpha mask...',
      'Refining hair & edges...',
      'Applying output format...'
    ]
  },
  'change-bg': {
    title: 'Compositing new background...',
    icon: '🖼️',
    color: '#f59e0b',
    steps: [
      'Preparing new background...',
      'Extracting subject...',
      'Blending edges naturally...',
      'Finalizing composite...'
    ]
  },
  'magic-eraser': {
    title: 'Removing unwanted objects...',
    icon: '🧹',
    color: '#3b82f6',
    steps: [
      'Analyzing mask area...',
      'Removing selected objects...',
      'Filling intelligently...',
      'Cleaning edges...'
    ]
  },
  'super-res': {
    title: 'Enhancing image quality...',
    icon: '🔍',
    color: '#10b981',
    steps: [
      'Analyzing pixel structure...',
      'Upscaling resolution...',
      'Reconstructing texture detail...',
      'Sharpening micro-detail...',
      'Finalizing quality...'
    ]
  },
  'text-to-image': {
    title: 'Generating visuals from AI...',
    icon: '✨',
    color: '#8b5cf6',
    steps: [
      'Understanding your prompt...',
      'Building composition...',
      'Adding fine details...',
      'Optimizing color harmony...',
      'Rendering final image...'
    ]
  },
  'edit-image': {
    title: 'Applying intelligent edit...',
    icon: '✏️',
    color: '#2563eb',
    steps: [
      'Understanding changes...',
      'Applying your edit...',
      'Preserving composition...',
      'Finalizing result...'
    ]
  },
  'style-transfer': {
    title: 'Transferring artistic style...',
    icon: '🎭',
    color: '#ec4899',
    steps: [
      'Loading style model...',
      'Analyzing composition...',
      'Transferring artistic style...',
      'Blending with original...'
    ]
  },
  'ai-tagline': {
    title: 'Crafting intelligent tagline...',
    icon: '💬',
    color: '#f59e0b',
    steps: [
      'Analyzing image content...',
      'Understanding context...',
      'Generating creative copy...'
    ]
  },
  'smart-frames': {
    title: 'Preparing smart frame...',
    icon: '🖼️',
    color: '#06b6d4',
    steps: [
      'Preparing frame layout...',
      'Compositing layers...',
      'Finalizing...'
    ]
  },
  'batch': {
    title: 'Batch processing initiated...',
    icon: '⚡',
    color: '#f59e0b',
    steps: [
      'Queuing images...',
      'Processing batch...',
      'Generating results...'
    ]
  }
};

const DEFAULT_CONFIG = {
  title: 'Processing your image...',
  icon: '✨',
  color: '#06b6d4',
  steps: [
    'Analyzing image...',
    'Applying transformation...',
    'Optimizing output...',
    'Finalizing...'
  ]
};

// ─────────────────────────────────────────────────────
// SMART PROGRESS HOOK
// ─────────────────────────────────────────────────────
function useSmartProgress(isActive) {
  const [progress, setProgress] = useState(0);
  const setStoreProgress = useCanvasStore(s => s.setProcessingProgress);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    setProgress(0);
    let frame;
    let startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      let next;

      // Non-linear progress curve:
      // Fast start, slow middle, crawl near end
      if (elapsed < 800) {
        // 0-800ms: rush to 30%
        next = (elapsed / 800) * 30;
      } else if (elapsed < 3000) {
        // 800-3000ms: 30% → 65%
        next = 30 + ((elapsed - 800) / 2200) * 35;
      } else if (elapsed < 8000) {
        // 3-8s: 65% → 85%
        next = 65 + ((elapsed - 3000) / 5000) * 20;
      } else if (elapsed < 20000) {
        // 8-20s: 85% → 95% (crawl)
        next = 85 + ((elapsed - 8000) / 12000) * 10;
      } else {
        // 20s+: hold at 96%
        next = 96;
      }

      next = Math.min(96, next);
      setProgress(next);
      setStoreProgress(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, setStoreProgress]);

  // Snap to 100% from outside
  const complete = useCallback(() => {
    setProgress(100);
    setStoreProgress(100);
  }, [setStoreProgress]);

  return { progress, complete };
}

// ─────────────────────────────────────────────────────
// STEP COMMENTARY HOOK
// ─────────────────────────────────────────────────────
function useStepCommentary(steps, isActive, stepDelayMs = 2200) {
  const [stepIndex, setStepIndex] = useState(0);
  const setStoreStep = useCanvasStore(s => s.setProcessingStep);

  useEffect(() => {
    if (!isActive || steps.length === 0) {
      setStepIndex(0);
      return;
    }

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex(prev => {
        const next = prev < steps.length - 1 ? prev + 1 : prev;
        setStoreStep(next);
        return next;
      });
    }, stepDelayMs);

    return () => clearInterval(interval);
  }, [isActive, steps.length, setStoreStep, stepDelayMs]);

  return stepIndex;
}

// ─────────────────────────────────────────────────────
// SUCCESS MESSAGES
// ─────────────────────────────────────────────────────
const SUCCESS_MESSAGES = {
  'face-restore': '✨ Face Restored Successfully',
  'smart-filters': '✨ Filter Applied',
  'remove-bg': '✨ Background Removed',
  'change-bg': '✨ Background Changed',
  'magic-eraser': '✨ Objects Erased',
  'super-res': '✨ Quality Enhanced',
  'text-to-image': '✨ Image Generated',
  'edit-image': '✨ Edit Applied',
  'style-transfer': '✨ Style Transferred',
  'ai-tagline': '✨ Tagline Generated',
  'smart-frames': '✨ Frame Applied',
  'batch': '✨ Batch Started'
};

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────
const AIProcessingExperience = memo(() => {
  const { isElite, isPro } = useAuth();
  const isProcessing = useCanvasStore(s => s.isProcessing);
  const processingData = useCanvasStore(s => s.processingData);
  const processingFeature = useCanvasStore(s => s.processingFeature);
  const processingError = useCanvasStore(s => s.processingError);
  const lastCompletedResult = useCanvasStore(s => s.lastCompletedResult);
  const clearCompletionResult = useCanvasStore(s => s.clearCompletionResult);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Determine feature config
  const featureId = processingData?.featureId || processingFeature || '';
  const config = useMemo(() => {
    const base = FEATURE_CONFIG[featureId] || DEFAULT_CONFIG;
    return {
      ...base,
      // Allow overrides from processingData
      icon: processingData?.featureIcon || base.icon,
      color: processingData?.featureColor || base.color
    };
  }, [featureId, processingData]);

  // Smart progress
  const { progress, complete } = useSmartProgress(isProcessing);

  // Step commentary
  const stepDelayMs = isElite ? 1200 : isPro ? 1700 : 2500;
  const stepIndex = useStepCommentary(config.steps, isProcessing, stepDelayMs);

  // Handle completion ceremony
  useEffect(() => {
    if (lastCompletedResult && !isProcessing) {
      complete();

      // Show success after a brief delay for the completion animation
      const timer = setTimeout(() => {
        const msg = SUCCESS_MESSAGES[lastCompletedResult.featureName] || 
                    SUCCESS_MESSAGES[featureId] || 
                    '✨ Enhancement Complete';
        setSuccessMessage(msg);
        setShowSuccess(true);
      }, 200);

      // Auto-clear success
      const clearTimer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
        clearCompletionResult();
      }, 2800);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [lastCompletedResult, isProcessing, complete, featureId, clearCompletionResult]);

  // Error dismiss handler — clears error and returns to canvas
  const handleDismiss = useCallback(() => {
    useCanvasStore.getState().stopProcessing();
  }, []);

  // Error retry handler
  const handleRetry = useCallback(() => {
    // The retry mechanism is handled by the consumer via a window event  
    window.dispatchEvent(new CustomEvent('ai-processing-retry', { detail: { featureId } }));
  }, [featureId]);

  return (
    <>
      {/* ═══ PROCESSING OVERLAY ═══ */}
      <AnimatePresence>
        {isProcessing && !processingError && (
          <motion.div
            key="ai-processing"
            className="ai-processing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Blur Backdrop */}
            <div className="ai-processing-backdrop" />

            {/* Shimmer Scan */}
            <div className="ai-processing-shimmer" />

            {/* Glassmorphism Card */}
            <div className="ai-processing-card">
              {/* Animated Icon */}
              <div className="ai-processing-icon-container">
                <div className="ai-processing-icon-glow" />
                <div 
                  className="ai-processing-icon-ring"
                  style={{ borderTopColor: config.color }}
                />
                <div 
                  className="ai-processing-icon-inner"
                  style={{ background: `${config.color}18` }}
                >
                  <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                    {config.icon}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="ai-processing-title">
                {config.title}
              </div>

              {/* Live Commentary Subtitle */}
              <div 
                className="ai-processing-subtitle" 
                key={stepIndex}
                style={{ animation: 'ape-textSwap 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {config.steps[stepIndex] || 'Optimizing output...'}
              </div>

              {/* Smart Progress Bar */}
              <div className="ai-processing-progress-label">
                <span>Neural Pipeline</span>
                <span className="ai-processing-progress-percent">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="ai-processing-progress">
                <div 
                  className="ai-processing-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Step Indicators */}
              <div className="ai-processing-steps">
                {config.steps.map((step, idx) => {
                  let state = 'pending';
                  if (idx < stepIndex) state = 'done';
                  if (idx === stepIndex) state = 'active';

                  return (
                    <div
                      key={idx}
                      className={`ai-processing-step ai-processing-step--${state}`}
                    >
                      <div className="ai-processing-step-dot">
                        {state === 'done' && '✓'}
                        {state === 'active' && (
                          <div className="ai-processing-step-spinner" />
                        )}
                      </div>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ERROR STATE ═══ */}
      <AnimatePresence>
        {processingError && (
          <motion.div
            key="ai-error"
            className="ai-processing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ai-processing-backdrop" />
            <div className="ai-processing-card">
              <div className="ai-processing-error">
                <div className="ai-processing-error-icon">😔</div>
                <div className="ai-processing-error-title">Something went wrong</div>
                <div className="ai-processing-error-message">
                  {processingError.message || 'An unexpected error occurred. Please try again.'}
                </div>
                <div className="ai-processing-error-actions">
                  {processingError.canRetry !== false && (
                    <button 
                      className="ai-processing-error-retry"
                      onClick={handleRetry}
                    >
                      Try Again
                    </button>
                  )}
                  <button 
                    className="ai-processing-error-dismiss"
                    onClick={handleDismiss}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ COMPLETION FLASH ═══ */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              key="completion-flash"
              className="ai-processing-completion-flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <div key="success-toast" className="ai-processing-success-toast">
              <div className="ai-processing-success-dot" />
              <span className="ai-processing-success-text">{successMessage}</span>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

AIProcessingExperience.displayName = 'AIProcessingExperience';

export default AIProcessingExperience;
