import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCanvasStore from '../../store/canvasStore';
import EditHistoryStrip from './EditHistoryStrip';
import { UploadCloud, Sparkles, ArrowRight } from 'lucide-react';
import { Gem, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommand } from '../../context/CommandContext';
import AICopilotPanel from '../chatbot/AICopilotPanel';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';
import { useCanvasInteractions } from '../../hooks/useCanvasInteractions';
import CanvasControlBar from './CanvasControlBar';
import CropOverlay from './CropOverlay';
import AIProcessingExperience from './AIProcessingExperience';
import { useImage } from '../../context/ImageContext';
import { X, Check } from 'lucide-react';
import AppleSlider from '../ui/AppleSlider';
import { useAuth } from '../../context/AuthContext';

const UploadZone = ({ onUpload }) => {
  return (
    <div 
      className="group relative flex flex-col items-center justify-center w-full h-full min-h-[450px] border-2 border-dashed border-white/20 dark:border-white/10 rounded-[40px] cursor-pointer bg-white/5 hover:bg-white/10 dark:hover:bg-white/[0.02] transition-all duration-500 overflow-hidden shadow-2xl"
      onClick={() => document.getElementById('canvas-upload').click()}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if(e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
      }}
    >
      <input 
        id="canvas-upload" type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => {
            if(e.target.files && e.target.files[0]) onUpload(e.target.files[0]);
        }}
      />
      
      {/* Ambient Neural Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(6,182,212,0.1)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 mb-8">
            <UploadCloud size={40} className="text-cyan-500 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-3xl font-black text-white tracking-tighter mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
            Start Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Masterpiece</span>
        </h3>
        
        <div className="flex flex-col items-center gap-2">
            <p className="text-[15px] font-bold text-white/40 uppercase tracking-[0.2em]">Drop image anywhere</p>
            <div className="flex items-center gap-3 py-2 px-6 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/30 transition-all">
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-[13px] font-black text-white/60">Click to Select File</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const UniversalCanvas = () => {
  const originalImage = useCanvasStore(state => state.originalImage);
  const history = useCanvasStore(state => state.history);
  const historyIndex = useCanvasStore(state => state.historyIndex);
  const isProcessing = useCanvasStore(state => state.isProcessing);
  const processingFeature = useCanvasStore(state => state.processingFeature);
  const processingData = useCanvasStore(state => state.processingData);
  const sourceAction = useCanvasStore(state => state.sourceAction);
  const setOriginalImage = useCanvasStore(state => state.setOriginalImage);
  const detectedFaces = useCanvasStore(state => state.detectedFaces);
  const detectionImageSize = useCanvasStore(state => state.detectionImageSize);
  const zoom = useCanvasStore(state => state.zoom);
  const isCopilotCollapsed = useCanvasStore(state => state.isCopilotCollapsed);
  const isCopilotVisible = useCanvasStore(state => state.isCopilotVisible);
  const setIsCopilotVisible = useCanvasStore(state => state.setIsCopilotVisible);
  const previewFilter = useCanvasStore(state => state.previewFilter);
  const previewImage = useCanvasStore(state => state.previewImage);
  const lastResultMeta = useCanvasStore(state => state.lastResultMeta);
  
  // Brush Mode State
  const isBrushMode = useCanvasStore(state => state.isBrushMode);
  const brushSettings = useCanvasStore(state => state.brushSettings);
  const setBrushMode = useCanvasStore(state => state.setBrushMode);
  const setZoom = useCanvasStore(state => state.setZoom);
  
  const offset = useCanvasStore(state => state.offset);
  const viewMode = useCanvasStore(state => state.viewMode);
  const setViewMode = useCanvasStore(state => state.setViewMode);
  const padding = useCanvasStore(state => state.padding);
  
  const viewportRef = React.useRef(null);
  const ctxRef = React.useRef(null); // Fixed: Added missing ref for brush canvas
  const { handleZoom, handleDoubleClick } = useCanvasInteractions(viewportRef);
  const brushCanvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { applyFeature } = useFeatureApply();
  const navigate = useNavigate();
  const { plan, isElite, isPro } = useAuth();
  // AI HUB SSOT FIX: Removed fragile ImageContext sync. 
  // CanvasStore is now the master for brush mode.

  // Handle Brush Setup
  React.useEffect(() => {
    if (isBrushMode && brushCanvasRef.current) {
         const canvas = brushCanvasRef.current;
         const rect = canvas.parentElement.getBoundingClientRect();
         canvas.width = rect.width;
         canvas.height = rect.height;
         const ctx = canvas.getContext('2d');
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
         ctx.strokeStyle = `rgba(239, 68, 68, ${brushSettings.softness > 50 ? 0.3 : 0.6})`; // Red mask color
         ctx.lineWidth = brushSettings.size || 30;
         if (brushSettings.feather) {
             ctx.shadowBlur = 10;
             ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
         }
         ctxRef.current = ctx;
    }
  }, [isBrushMode, brushSettings]);

  const startDrawing = (e) => {
      if (!isBrushMode) return;
      const { offsetX, offsetY } = e.nativeEvent;
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
  };
  
  const draw = (e) => {
      if (!isDrawing || !isBrushMode) return;
      const { offsetX, offsetY } = e.nativeEvent;
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
  };
  
  const stopDrawing = () => {
      if (!isBrushMode) return;
      ctxRef.current.closePath();
      setIsDrawing(false);
  };

  const handleApplyErase = async () => {
      if (!brushCanvasRef.current) return;
      const maskDataUrl = brushCanvasRef.current.toDataURL('image/png');
      setBrushMode(false);
      
      applyFeature({
          featureId: 'magic-eraser',
          featureName: 'Magic Eraser',
          featureIcon: '🧹',
          featureColor: '#3b82f6',
          endpoint: apiEndpoints.eraseObject,
          payload: { 
              mask: maskDataUrl,
              smartFill: brushSettings.smartFill ? 'true' : 'false'
          },
          requiresImage: true
      });
  };

  const handleCancelErase = () => {
      setBrushMode(false);
  };

  const { analyzeImage, aiInsights, processChatCommand } = useCommand();

  React.useEffect(() => {
    if (!originalImage) return;
    if (aiInsights.analyzed || aiInsights.analyzing) return; // Don't re-analyze
    
    setIsCopilotVisible(true);

    // Case 1: File object (fresh upload from file picker)
    if (originalImage instanceof File) {
        const url = URL.createObjectURL(originalImage);
        const img = new Image();
        img.onload = () => {
             const canvas = document.createElement('canvas');
             const maxDim = 512; // Standard dimension for AI Analysis (GPT-4o Vision, LLaVA, etc.)
             let width = img.width;
             let height = img.height;

             if (width > height && width > maxDim) {
                 height *= maxDim / width;
                 width = maxDim;
             } else if (height > maxDim) {
                 width *= maxDim / height;
                 height = maxDim;
             }

             canvas.width = width;
             canvas.height = height;
             const ctx = canvas.getContext('2d');
             ctx.drawImage(img, 0, 0, width, height);

             // High-quality JPEG at 0.8 quality is perfect for analysis while keeping size < 50KB
             const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
             analyzeImage(dataUrl);
             URL.revokeObjectURL(url);
        };
        img.src = url;
    }
    // Case 2: Blob or URL string (loaded from history/projects)
    else if (originalImage instanceof Blob) {
        const url = URL.createObjectURL(originalImage);
        analyzeImage(url);
    }
    else if (typeof originalImage === 'string' && originalImage.startsWith('http')) {
        analyzeImage(originalImage);
    }

    // NEW: Reset zoom and tracking state when a new base photo is set
    // This allows the onLoad handler to trigger its auto-scale logic fresh
    }, [originalImage, analyzeImage, setZoom]);
  

  const [baseScale, setBaseScale] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [showingOriginal, setShowingOriginal] = useState(false);
  
  // OPTIMIZATION: Use stable Image URLs to prevent re-generation on re-render
  const [stableOriginalUrl, setStableOriginalUrl] = useState(null);

  React.useEffect(() => {
    let url = null;
    if (originalImage instanceof File || originalImage instanceof Blob) {
      url = URL.createObjectURL(originalImage);
      setStableOriginalUrl(url);
    } else {
      setStableOriginalUrl(originalImage);
    }
    return () => {
      if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
    };
  }, [originalImage]);

  const displayImage = React.useMemo(() => {
    if (previewImage) return previewImage;
    if (showingOriginal) return stableOriginalUrl;
    if (historyIndex === -1) return stableOriginalUrl;
    
    // If we have history, show it even if originalImage is null (e.g. Text-to-Image sticker)
    if (historyIndex >= 0 && history[historyIndex]) {
        return history[historyIndex].imageUrl;
    }
    
    return stableOriginalUrl;
  }, [stableOriginalUrl, history, historyIndex, showingOriginal, previewImage]);

  const getCanvasStatusLabel = () => {
    if (isProcessing && processingData) return `Applying ${processingData.featureName}...`;
    if (isProcessing && processingFeature) return `Applying ${processingFeature}...`;
    if (isBrushMode) return `Magic Eraser Active`;
    if (showingOriginal) return `Viewing Original`;
    if (historyIndex >= 0 && history[historyIndex]) return `${history[historyIndex].featureName} Applied`;
    if (originalImage) return `Original Image`;
    return null;
  };

  const statusLabel = getCanvasStatusLabel();
  const isFreePreview = lastResultMeta?.plan === 'FREE' && !!lastResultMeta?.previewOnly;
  const comparisonDemoImage = lastResultMeta?.comparisonDemoImage || null;
  const planProfile = lastResultMeta?.planProfile || null;

  return (
    <div className="canvas-area relative w-full h-full overflow-hidden">
      {/* AI Context Panel */}
      <AnimatePresence>
        {isCopilotVisible && (
          <AICopilotPanel 
            key="ai-copilot"
            onClose={() => setIsCopilotVisible(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Main image display */}
      <div 
        className="canvas-viewport absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-500" 
        ref={viewportRef}
        style={{
            zIndex: 1,
            backgroundColor: 'transparent'
        }}
      >
        {!originalImage && history.length === 0 ? (
          <div 
            className="group relative flex flex-col items-center justify-center p-14 transition-all duration-700"
            style={{ cursor: 'pointer' }}
            onClick={() => document.getElementById('canvas-upload').click()}
          >
            {/* Pulsing Neural Backdrop — Mode-aware Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/[0.08] dark:bg-cyan-500/[0.05] blur-[100px] animate-pulse opacity-60 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col items-center gap-8">
                <div 
                  className="w-32 h-32 rounded-[40px] bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 flex items-center justify-center shadow-[var(--depth-3)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700"
                >
                  <UploadCloud size={44} strokeWidth={1.2} className="text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
                </div>
                
                <div className="text-center space-y-3">
                    <h2 className="text-[32px] font-black text-slate-900 dark:text-white tracking-tighter group-hover:scale-[1.02] transition-transform">
                        Ready for <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Neural Perfection</span>?
                    </h2>
                    <p className="text-sm font-black text-slate-600 dark:text-white/65 uppercase tracking-[0.22em] flex items-center justify-center gap-4">
                        <span className="w-10 h-[1px] bg-slate-200 dark:bg-white/10" />
                        Click or Drop Image
                        <span className="w-10 h-[1px] bg-slate-200 dark:bg-white/10" />
                    </p>
                </div>
                
                <div className="mt-4 flex items-center gap-3 py-2.5 pr-2.5 pl-6 rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:border-cyan-500/40 transition-all overflow-hidden group/btn shadow-sm">
                    <span className="text-[13px] font-black text-slate-700 dark:text-white/85 uppercase tracking-wide group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Start Project</span>
                    <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover/btn:translate-x-1 transition-transform">
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            <input 
                id="canvas-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => { 
                    if (e.target.files[0]) setOriginalImage(e.target.files[0]); 
                }} 
            />
          </div>
        ) : (
          <>
            {/* Original/Current toggle (hold to compare) — Top Layer */}
            {originalImage && (
              <button 
                className="compare-btn"
                onMouseDown={() => setShowingOriginal(true)}
                onMouseUp={() => setShowingOriginal(false)}
                onMouseLeave={() => setShowingOriginal(false)}
                onTouchStart={() => setShowingOriginal(true)}
                onTouchEnd={() => setShowingOriginal(false)}
                style={{ zIndex: 100 }}
              >
                Hold to compare
              </button>
            )}
            
            {/* 🖼️ Main Image Layer - Fixed Scale Normalized Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoom }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: imageSize.width > 0 ? imageSize.width * baseScale : 'auto',
                height: imageSize.height > 0 ? imageSize.height * baseScale : 'auto',
                maxWidth: '70%',
                maxHeight: '75vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformOrigin: 'center center'
              }}
              className={`shadow-2xl bg-white overflow-hidden ${isProcessing ? 'canvas-image-container--processing' : ''}`}
            >
              {/* 🖌️ Brush Layer for Magic Eraser */}
              <AnimatePresence>
                {isBrushMode && (
                  <motion.canvas
                    ref={brushCanvasRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0 z-50 cursor-crosshair touch-none"
                    style={{
                      width: '100%',
                      height: '100%',
                      touchAction: 'none'
                    }}
                  />
                )}
              </AnimatePresence>

              <img
                src={displayImage}
                className="canvas-image block transition-opacity duration-300"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  filter: previewFilter || 'none',
                  transition: 'filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onLoad={(e) => {
                  const imgElement = e.target;
                  if (!imgElement || imgElement.naturalWidth === 0 || !viewportRef.current) return;
                  
                  const naturalW = imgElement.naturalWidth;
                  const naturalH = imgElement.naturalHeight;
                  setImageSize({ width: naturalW, height: naturalH });

                  const viewport = viewportRef.current.getBoundingClientRect();
                  if (viewport.width < 100 || viewport.height < 100) return;

                  const availableW = viewport.width * 0.7;
                  const availableH = viewport.height * 0.75;
                  
                  const scaleX = availableW / naturalW;
                  const scaleY = availableH / naturalH;
                  const calcBaseScale = Math.min(scaleX, scaleY);

                  setBaseScale(isFinite(calcBaseScale) && calcBaseScale > 0 ? calcBaseScale : 1);
                }}
              />

              {isFreePreview && (
                <div className="absolute bottom-4 right-4 z-[70] max-w-xs rounded-2xl bg-black/65 text-white p-4 border border-white/15 backdrop-blur-xl shadow-2xl pointer-events-auto">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Free Preview</p>
                  <p className="text-sm font-semibold mt-1">Unlock HD output and remove watermark</p>
                  <p className="text-xs text-white/70 mt-1">
                    {lastResultMeta?.upgradeMessage || 'Upgrade to Pro for sharper output and faster processing'}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => navigate('/app/pricing')}
                      className="px-3 py-2 rounded-xl bg-cyan-500 text-white text-xs font-black tracking-wide hover:bg-cyan-400 transition-colors"
                    >
                      Unlock HD
                    </button>
                    <button
                      onClick={() => navigate('/app/pricing')}
                      className="px-3 py-2 rounded-xl border border-white/25 text-white text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      <Lock size={12} /> Remove watermark
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Smart Crop Overlay */}
            <CropOverlay />
          </>
        )}
      </div>

      {/* ⚡ AI Processing Experience Overlay — ALWAYS rendered (covers Text-to-Image with no image) */}
      <AIProcessingExperience />

      {/* Status indicator (Top-Left) - ABSOLUTE */}
      {statusLabel && (
        <div className="canvas-edit-badge absolute top-6 left-6 z-[95] pointer-events-none">
          {isProcessing && <div className="animate-spin w-3 h-3 border-2 border-white/20 border-t-white rounded-full" />}
          {isBrushMode && <span style={{ fontSize: '14px' }}>🧹</span>}
          {statusLabel}
        </div>
      )}

      {isElite && (
        <div className="absolute top-6 right-6 z-[95] px-3 py-2 rounded-full bg-emerald-500/20 border border-emerald-300/30 text-emerald-100 text-xs font-black tracking-wider flex items-center gap-2">
          <Gem size={13} /> Premium AI Model Activated
        </div>
      )}

      {(isFreePreview && comparisonDemoImage) && (
        <div className="absolute bottom-24 left-6 z-[92] w-[min(560px,72vw)] rounded-2xl overflow-hidden border border-white/20 bg-black/45 backdrop-blur-xl">
          <div className="grid grid-cols-2">
            <div className="p-2 border-r border-white/10">
              <p className="text-xs font-black uppercase tracking-wide text-white/85 mb-1">Free Result</p>
              <img src={displayImage} alt="Free preview" className="w-full h-32 object-cover rounded-lg" />
            </div>
            <div className="p-2">
              <p className="text-xs font-black uppercase tracking-wide text-cyan-300 mb-1">Pro Clarity Preview</p>
              <img src={comparisonDemoImage} alt="Pro demo" className="w-full h-32 object-cover rounded-lg" />
            </div>
          </div>
          <div className="px-3 py-2 flex items-center justify-between border-t border-white/10">
            <p className="text-xs text-white/85">
              {planProfile ? `Free ${planProfile.resolutionPx}px | Pro 1024px | Elite 2048px+` : 'Upgrade for visibly sharper output'}
            </p>
            <button
              onClick={() => navigate('/app/pricing')}
              className="text-xs font-black text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1"
            >
              <Zap size={12} /> Upgrade
            </button>
          </div>
        </div>
      )}

      {!isElite && (isPro || plan === 'free') && (
        <button
          onClick={() => navigate('/app/pricing')}
          className="absolute top-16 right-6 z-[95] px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-300/40 text-cyan-50 text-xs font-black tracking-wide hover:bg-cyan-500/30 transition-colors"
        >
          Upgrade for Elite Instant Queue
        </button>
      )}
      
      {/* Edit History Strip — bottom of canvas */}
      {history.length > 0 && !isProcessing && (
        <EditHistoryStrip />
      )}

      {/* Professional Interaction HUD */}
      {(originalImage || history.length > 0) && <CanvasControlBar />}

      {/* Floating Brush Controls HUD */}
      <AnimatePresence>
        {isBrushMode && (
          <motion.div
            initial={{ y: 20, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 20, opacity: 0, x: '-50%' }}
            className="absolute bottom-24 left-1/2 z-[120] flex flex-col gap-4 p-5 w-72 bg-white/90 dark:bg-black/80 backdrop-blur-2xl rounded-[32px] border border-white/20 dark:border-white/10 shadow-2xl"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-black text-black/40 dark:text-white/40 uppercase tracking-widest">Neural Brush</span>
              <button 
                onClick={handleCancelErase}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={16} className="text-black/60 dark:text-white/60" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-black dark:text-white">Size</span>
                  <span className="text-cyan-500">{brushSettings.size}px</span>
                </div>
                <AppleSlider 
                  value={brushSettings.size}
                  min={5}
                  max={200}
                  step={1}
                  onChange={(val) => useCanvasStore.getState().setBrushSettings({ ...brushSettings, size: val })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-black dark:text-white">Softness</span>
                  <span className="text-cyan-500">{brushSettings.softness}%</span>
                </div>
                <AppleSlider 
                  value={brushSettings.softness}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(val) => useCanvasStore.getState().setBrushSettings({ ...brushSettings, softness: val })}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCancelErase}
                className="flex-1 py-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-[13px] font-black text-black/60 dark:text-white/60 hover:bg-black/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyErase}
                className="flex-[1.5] py-3.5 rounded-2xl bg-cyan-500 text-[13px] font-black text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Erase Objects
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default UniversalCanvas;
