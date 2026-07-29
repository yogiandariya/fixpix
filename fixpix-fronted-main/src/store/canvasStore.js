import { create } from 'zustand';
import { apiEndpoints } from '../lib/api';
import { authenticatedFetch } from '../lib/authFetch';
import useToastStore from './toastStore';

const useCanvasStore = create((set, get) => ({
  // Original uploaded image (never changes)
  originalImage: null,
  
  // Edit history stack
  // Each item: { id, imageUrl, featureName, featureId, timestamp, settings }
  history: [],
  
  // Current position in history (-1 = original)
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  
  // Processing state
  isProcessing: false,
  processingFeature: null,
  processingMessage: 'Processing...',
  processingData: null, // { featureId, featureName, featureIcon, featureColor }
  
  // Enhanced processing state for AIProcessingExperience
  processingProgress: 0,
  processingSteps: [],
  processingStepIndex: 0,
  processingError: null, // { message, canRetry }
  processingStartTime: null,
  uiLocked: false,
  
  // Completion result for before/after transition
  lastCompletedResult: null, // { beforeUrl, afterUrl, featureName, featureIcon }
  lastResultMeta: null,
  
  // Detection state
  detectedFaces: [],
  detectionImageSize: null,
  
  // Brush state (Magic Eraser)
  isBrushMode: false,
  brushSettings: { size: 30, softness: 50, smartFill: true, feather: false },
  
  // Tracking the last action for UI labels
  sourceAction: null,
  
  // View State (Zoom/Pan/Modes)
  zoom: 1.0,
  offset: { x: 0, y: 0 },
  viewMode: 'fit', // 'fit', 'fill', 'actual'
  padding: 80,
  isCropMode: false,
  isCopilotCollapsed: true,
  isCopilotVisible: true,
  previewFilter: '',
  previewImage: null,
  favoriteFilters: [],
  recentFilters: [],
  isExportModalOpen: false,
  
  // Actions:
  setExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setZoom: (zoom) => set({ zoom: Math.min(10, Math.max(0.01, zoom)), viewMode: 'custom' }),
  zoomIn: () => set(state => ({ zoom: Math.min(10, state.zoom * 1.1), viewMode: 'custom' })),
  zoomOut: () => set(state => ({ zoom: Math.max(0.01, state.zoom / 1.1), viewMode: 'custom' })),
  
  setOffset: (offset) => set({ offset }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setPadding: (p) => set({ padding: p }),
  setCropMode: (enabled) => set({ 
    isCropMode: enabled,
    // Auto-collapse copilot when crop opens
    isCopilotCollapsed: enabled || get().isCopilotCollapsed 
  }),
  setIsCopilotCollapsed: (collapsed) => set({ isCopilotCollapsed: collapsed }),
  setIsCopilotVisible: (visible) => set({ isCopilotVisible: visible }),
  setPreviewFilter: (filterStr) => set({ previewFilter: filterStr }),
  setPreviewImage: (image) => set({ previewImage: image }),
  
  toggleFavoriteFilter: (filterId) => set(s => ({
      favoriteFilters: s.favoriteFilters.includes(filterId) 
         ? s.favoriteFilters.filter(id => id !== filterId)
         : [...s.favoriteFilters, filterId]
  })),
  addRecentFilter: (filterId) => set(s => ({
      recentFilters: [filterId, ...s.recentFilters.filter(id => id !== filterId)].slice(0, 10)
  })),
  
  resetView: () => set({ zoom: 1.0, offset: { x: 0, y: 0 }, viewMode: 'fit' }),
  
  // Set original image (on upload)
  setOriginalImage: async (imageFile, sourceAction = null) => {
    // Validate file inputs before accepting
    if (imageFile instanceof File) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
      if (!validTypes.includes(imageFile.type)) {
        useToastStore.getState().error(`Unsupported file type: ${imageFile.type.split('/')[1]?.toUpperCase() || 'unknown'}. Use JPEG, PNG, or WebP.`);
        return;
      }
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > MAX_FILE_SIZE) {
        useToastStore.getState().error(`File too large (${(imageFile.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`);
        return;
      }

      // Auto-compress images larger than 2MB
      if (imageFile.size > 2 * 1024 * 1024) {
        try {
          const { compressImage } = await import('../utils/imageCompression.js');
          const { file: compressedFile } = await compressImage(imageFile, {
             maxWidth: 4096,
             maxHeight: 4096,
             quality: 0.85
          });
          imageFile = compressedFile;
        } catch (err) {
          console.error("Auto-compression failed before upload:", err);
          // fall through to use original
        }
      }
    }

    set({ 
      originalImage: imageFile, 
      history: [], 
      historyIndex: -1,
      detectedFaces: [],
      detectionImageSize: null,
      sourceAction: sourceAction,
      // Reset view state for fresh start
      viewMode: 'fit',
      zoom: 1.0,
      offset: { x: 0, y: 0 },
      isCopilotCollapsed: true,
      isCopilotVisible: true,
      previewFilter: ''
    });

    // Fire and forget upload to register in DB
    if (imageFile instanceof File) {
        get().syncOriginalImage(imageFile);
    }
  },

  // Syncing state (C6 FIX)
  isSyncing: false,

  // Background sync for Original Image Upload
  syncOriginalImage: async (file) => {
    set({ isSyncing: true });
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            set({ isSyncing: false });
            return;
        }

        // We can skip the direct Storage upload since Django handles images 
        // through its own ImageProject pipeline, or just do the existing API Sync.
        let imageUrl = `upload-pending://${file.name}`;

        // 🚀 Step 3: API Sync
        const formData = new FormData();
        formData.append('image', file);
        
        // Let's create an ImageProject via the API
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        try {
            const formDataProj = new FormData();
            formDataProj.append('original_image', file);
            formDataProj.append('source', 'uploaded');
            
            await authenticatedFetch(`${API_URL}/api/images/`, {
                method: 'POST',
                body: formDataProj
            });
            console.log('✅ Django Image Registration SUCCESS');
        } catch (e) {
            console.error('Django DB Sync failed:', e.message);
        }

    } catch (err) {
        console.warn('Sync flow interrupted:', err.message);
    } finally {
        set({ isSyncing: false });
    }
  },
  
  // Push new edit result to history
  pushEdit: (imageUrl, featureName, featureId, settings) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    
    const newEdit = {
      id: Date.now(),
      imageUrl,
      featureName,
      featureId,
      settings,
      timestamp: new Date().toISOString()
    };
    
    set({
      history: [...newHistory, newEdit],
      historyIndex: newHistory.length,
      isProcessing: false,
      processingFeature: null,
      processingMessage: 'Processing...',
      processingData: null,
      processingProgress: 0,
      processingStepIndex: 0,
      processingError: null,
      processingStartTime: null,
      uiLocked: false,
      canUndo: (newHistory.length) > -1,
      canRedo: false
    });

    // Background sync to DB history
    get().syncEditToHistory(newEdit);
  },

  // Sync to Backend
  syncEditToHistory: async (edit) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await authenticatedFetch(`${API_URL}/api/history/edits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: edit.featureName,
          parameters: edit.settings || {},
          output_url: edit.imageUrl
        })
      });
      
      if (!response.ok) {
          console.error('History Sync error:', response.status);
      } else {
          console.log('✅ Django History Sync SUCCESS');
      }
    } catch (err) {
      console.warn('History sync failed (non-critical):', err.message);
    }
  },
  
  // Undo
  undo: () => {
    const { historyIndex } = get();
    // M1 FIX: Only undo when there's actually something to go back to
    if (historyIndex > -1) {
      const newIndex = Math.max(-1, historyIndex - 1);
      set({ 
        historyIndex: newIndex,
        canUndo: newIndex > -1,
        canRedo: newIndex < get().history.length - 1
      });
    }
  },
  
  // Redo  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ 
        historyIndex: newIndex,
        canUndo: newIndex > -1,
        canRedo: newIndex < history.length - 1
      });
    }
  },
  
  // Set processing state (Principle #7: Descriptive Feedback)
  startProcessing: (dataOrFeatureId, message = null) => {
    const isObj = typeof dataOrFeatureId === 'object' && dataOrFeatureId !== null;
    const fId = isObj ? dataOrFeatureId.featureId : dataOrFeatureId;
    const fName = isObj ? dataOrFeatureId.featureName : null;
    
    // Tool-specific high-fidelity messages
    const messageMap = {
      'face_restoration': 'Analyzing facial landmarks and deep-scanning features...',
      'super_resolution': 'Reconstructing pixel patterns and upscaling resolution...',
      'background_removal': 'Identifying boundaries and isolating foreground subject...',
      'object_removal': 'Analyzing surrounding textures for intelligent infill...',
      'color_restore': 'Decoding color channels and neutralizing faded layers...',
      'neural_filter': 'Weaving neural style layers into base image...',
      'default': 'Processing data through the FixPix Neural Engine...'
    };
    
    const displayMessage = message || messageMap[fId] || (fName ? `Optimizing ${fName}...` : messageMap.default);

    return set({
      isProcessing: true,
      processingFeature: fId,
      processingMessage: displayMessage,
      processingData: isObj ? dataOrFeatureId : null,
      processingProgress: 0,
      processingStepIndex: 0,
      processingError: null,
      processingStartTime: Date.now(),
      uiLocked: true
    });
  },
  
  setProcessingMessage: (message) => set({ processingMessage: message }),
  setProcessingProgress: (progress) => set({ processingProgress: Math.min(100, Math.max(0, progress)) }),
  setProcessingStep: (index) => set({ processingStepIndex: index }),
  setProcessingError: (error) => set({ processingError: error, isProcessing: false, uiLocked: false }),
  setUiLocked: (locked) => set({ uiLocked: locked }),
  
  completeProcessing: (beforeUrl, afterUrl, featureName, featureIcon) => set({
    lastCompletedResult: { beforeUrl, afterUrl, featureName, featureIcon, timestamp: Date.now() }
  }),
  
  clearCompletionResult: () => set({ lastCompletedResult: null }),
  setLastResultMeta: (meta) => set({ lastResultMeta: meta || null }),
  
  stopProcessing: () => set({ 
    isProcessing: false, 
    processingFeature: null,
    processingMessage: 'Processing...',
    processingData: null,
    processingProgress: 0,
    processingStepIndex: 0,
    processingError: null,
    processingStartTime: null,
    uiLocked: false
  }),
  
  // Reset everything
  reset: () => set({ 
    originalImage: null, 
    history: [], 
    lastResultMeta: null,
    viewMode: 'fit',
    offset: { x: 0, y: 0 },
    padding: 80,
    isCropMode: false,
    detectedFaces: [],
    detectionImageSize: null
  }),
  
  setDetectedFaces: (faces, imageSize) => set({ 
    detectedFaces: faces, 
    detectionImageSize: imageSize 
  }),
  
  clearDetectedFaces: () => set({ 
    detectedFaces: [], 
    detectionImageSize: null 
  }),
  
  // Get image to send to API (always latest)
  getWorkingImage: () => {
    const { originalImage, history, historyIndex } = get();
    if (historyIndex === -1 || history.length === 0) return originalImage;
    return history[historyIndex]?.imageUrl;
  },
  
  setHistoryIndex: (index) => set({ historyIndex: index }),
  
  setBrushMode: (enabled) => set({ 
    isBrushMode: enabled,
    // Auto-collapse copilot when brush opens
    isCopilotCollapsed: enabled || get().isCopilotCollapsed
  }),
  setBrushSettings: (settings) => set({ brushSettings: settings })
}));

export default useCanvasStore;
