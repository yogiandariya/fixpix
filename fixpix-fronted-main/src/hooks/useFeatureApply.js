import { useContext, useRef, useEffect, useCallback } from 'react';
import useCanvasStore from '../store/canvasStore';
import useToastStore from '../store/toastStore';
import AuthContext from '../context/AuthContext';
import { authenticatedFetch } from '../lib/authFetch';

// Minimum animation time (ms) to prevent jarring instant results
const BASE_MIN_PROCESSING_ANIMATION_MS = 1200;

// Helper: Convert object URL, base64, or string to Blob
async function fetchImageBlob(url) {
    if (url instanceof File || url instanceof Blob) return url;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch image data.');
    return await res.blob();
}

// Helper: delay promise
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Get a displayable URL from image source
function getDisplayUrl(img) {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
    return null;
}

export function useFeatureApply() {
  const store = useCanvasStore();
  const toast = useToastStore();
  const authContext = useContext(AuthContext);
  
  // Store last apply config for retry
  const lastApplyConfigRef = useRef(null);

  const applyFeature = async (config) => {
    const {
      featureId,
      featureName,
      featureIcon,
      featureColor = '#2563eb',
      endpoint,
      payload = {},
      isNewImage = false,
      requiresImage = true,
      isJson = false,
      onClose
    } = config;
    
    // GUARD: Prevent double-submit while already processing
    if (store.isProcessing) {
      toast.warning('Processing in progress... please wait.');
      return;
    }
    
    // VALIDATE: Prompt length for text-based features
    if (payload.prompt && typeof payload.prompt === 'string' && payload.prompt.length > 2000) {
      toast.error('Prompt is too long (max 2000 characters).');
      return;
    }
    
    // Store config for retry
    lastApplyConfigRef.current = config;
    
    // Validate endpoint exists
    if (!endpoint) {
      toast.error(`${featureName}: API endpoint not configured`);
      return;
    }
    
    // Capture the "before" image URL for completion ceremony
    let beforeUrl = null;
    // C4 FIX: Track the previous working image URL for cleanup
    let previousWorkingUrl = null;
    if (requiresImage) {
      const workingImage = store.getWorkingImage();
      if (!workingImage && featureId !== 'batch') {
        toast.error("Please upload an image first! 📸");
        return;
      }
      beforeUrl = getDisplayUrl(workingImage);
      // Track the current display URL so we can revoke it after replacement
      previousWorkingUrl = typeof workingImage === 'string' ? workingImage : null;
    }
    
    // 1. Close popup immediately with smooth exit
    if (onClose) onClose();
    
    // 2. Start processing on canvas (also locks UI)
    store.startProcessing({
      featureId,
      featureName,
      featureIcon,
      featureColor
    });
    
    // No toast during processing — the canvas overlay IS the feedback
    const processingStartTime = Date.now();
    
    try {
      let finalBody;
      let finalHeaders = {};
      
      if (isJson) {
         finalHeaders['Content-Type'] = 'application/json';
         finalBody = JSON.stringify(payload);
      } else {
         const formData = new FormData();
         
         if (requiresImage) {
             const workingImage = store.getWorkingImage();
             if (workingImage) {
                 const currentBlob = await fetchImageBlob(workingImage);
                 formData.append('image', currentBlob, 'image.png');
                 formData.append('file', currentBlob, 'image.png');
             }
         }
         
         Object.keys(payload).forEach(key => {
             if (payload[key] !== undefined && payload[key] !== null) {
                 formData.append(key, payload[key]);
             }
         });
         
         finalBody = formData;
      }
      
      // 3. Call API + enforce minimum animation time
      console.log(`[${featureName}] Calling: ${endpoint}`);
      
      const minDelay = authContext?.isElite ? 500 : authContext?.isPro ? 1200 : 2400;
      const [response] = await Promise.all([
        authenticatedFetch(endpoint, {
          method: 'POST',
          headers: finalHeaders,
          body: finalBody
        }),
        // Ensure minimum processing animation time
        delay(minDelay || BASE_MIN_PROCESSING_ANIMATION_MS)
      ]);
      
      console.log(`[${featureName}] Response status: ${response.status}`);
      
      if (!response.ok) {
        let errMessage = `API error: ${response.status}`;
        let details = null;
        try {
           const errData = await response.json();
           details = errData;
            errMessage = errData.upgradeMessage || errData.error || errData.detail || errData.message || errMessage;

            if (errData.upgradeMessage || errData.reason === 'limit_reached') {
            toast.warning(errData.upgradeMessage || "You've reached today's limit. Upgrade to continue instantly");
            }
        } catch(e) {}
        console.error(`[${featureId}] API Failure:`, { status: response.status, message: errMessage, details });
        throw new Error(errMessage);
      }
      
      // Parse response
      const contentType = response.headers.get('content-type') || '';
      let finalUrl;
      
      if (contentType.includes('image/')) {
        const blob = await response.blob();
        finalUrl = URL.createObjectURL(blob);
      } else {
        const result = await response.json();
        store.setLastResultMeta({
          ...(result || {}),
          featureId,
          featureName,
          endpoint
        });
        
        let resultImage = result.image || result.image_url || result.imageUrl || 
                          result.upscaled_image || result.restored_image || 
                          result.inpainted_image || result.processed_image ||
                          result.optimized_image || result.generated_image;
        
        if (!resultImage) {
          console.error(`[${featureId}] Response missing image field:`, result);
          throw new Error("No image in API response");
        }
        
        if (!resultImage.startsWith('http') && !resultImage.startsWith('data:') && !resultImage.startsWith('blob:')) {
            resultImage = `data:image/jpeg;base64,${resultImage}`;
        }
        
        const resultBlob = await fetchImageBlob(resultImage);
        finalUrl = URL.createObjectURL(resultBlob);
      }
      
      // 4. Store completion result for the before/after ceremony
      store.completeProcessing(beforeUrl, finalUrl, featureName, featureIcon);
      
      // 5. Push to canvas history or set as new
      if (isNewImage) {
        // Pass the blob URL string directly — it's already a displayable URL
        store.setOriginalImage(finalUrl, featureName);
        store.stopProcessing();
      } else {
        // pushEdit internally stops processing
        store.pushEdit(finalUrl, featureName, featureId, payload);
      }
      
      // C4 FIX: Revoke previous working image blob URL to prevent memory leak
      // Only revoke blob: URLs (not data: or http: URLs)
      if (previousWorkingUrl && previousWorkingUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previousWorkingUrl);
      }
      // Revoke beforeUrl if it was a blob (created by getDisplayUrl)
      if (beforeUrl && beforeUrl.startsWith('blob:') && beforeUrl !== previousWorkingUrl) {
        URL.revokeObjectURL(beforeUrl);
      }
      
    } catch (error) {
      console.error(`[${featureName}] Error:`, error);
      
      // Set error state for the processing overlay to show retry UI
      store.setProcessingError({ 
        message: `${featureName} failed: ${error.message}`,
        canRetry: true 
      });
    }
  };
  
  // Retry handler — listens for retry events from AIProcessingExperience
  const handleRetry = useCallback(() => {
    if (lastApplyConfigRef.current) {
      // Clear the error first
      store.stopProcessing();
      // Re-apply with the same config (minus onClose since popup is already closed)
      const retryConfig = { ...lastApplyConfigRef.current, onClose: undefined };
      setTimeout(() => applyFeature(retryConfig), 300);
    }
  }, [store]);
  
  // Listen for retry events from the processing overlay
  useEffect(() => {
    const handler = () => handleRetry();
    window.addEventListener('ai-processing-retry', handler);
    return () => window.removeEventListener('ai-processing-retry', handler);
  }, [handleRetry]);
  
  return { applyFeature, authenticatedFetch };
}
