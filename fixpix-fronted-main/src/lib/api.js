/**
 * API Configuration for FixPix
 */

// Base API URL
let rawApiUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://fixpix-backend-production.up.railway.app' : 'http://localhost:8000');
if (rawApiUrl && !rawApiUrl.startsWith('http')) {
    rawApiUrl = `https://${rawApiUrl}`;
}
export const API_URL = rawApiUrl.replace(/\/$/, '');

// Intelligence Node API (Local Proxy in Dev)
// M2 FIX: Default port must match Node server.js (PORT || 4000) and vite.config.js proxy
const DEFAULT_NODE_URL = ''; // Empty in Dev forces relative path through Vite proxy
let rawNodeApiUrl = import.meta.env.VITE_NODE_API_URL || (import.meta.env.PROD ? 'https://fixpix-intelligence-production.up.railway.app' : DEFAULT_NODE_URL);
if (rawNodeApiUrl && !rawNodeApiUrl.startsWith('http') && rawNodeApiUrl.length > 0) {
    rawNodeApiUrl = `https://${rawNodeApiUrl}`;
}
export const NODE_API_URL = rawNodeApiUrl.replace(/\/$/, '');

export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || API_URL;

export const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${MEDIA_URL}/${cleanPath}`;
};

export const apiEndpoints = {
    token: `${API_URL}/api/token/`,
    tokenRefresh: `${API_URL}/api/token/refresh/`,
    register: `${API_URL}/api/register/`,
    profile: `${API_URL}/api/profile/`,
    images: `${API_URL}/api/images/`,
    processImage: (id) => `${API_URL}/api/images/${id}/process/`,
    imageDetail: (id) => `${API_URL}/api/images/${id}/`,
    
    // ═══ AI TOOL ENDPOINTS (Django Backend) ═══
    
    // Face Restore (GFPGAN via ImageViewSet action — detail=False)
    restoreFace: `${API_URL}/api/images/restore_face/`,
    
    // Face Detection
    detectFaces: `${API_URL}/api/images/detect_faces/`,
    
    // Super Resolution (v1 proxy + Stability conservative)
    superResolution: `${API_URL}/api/v1/image/super-resolution/`,
    conservativeUpscale: `${API_URL}/api/v1/image/upscale-conservative/`,
    
    // Magic Eraser / Inpainting (ImageViewSet action)
    inpaint: `${API_URL}/api/images/inpaint/`,
    eraseObject: `${API_URL}/api/images/inpaint/`,
    
    // Background (Stability AI proxy views)
    removeBg: `${API_URL}/api/v1/image/remove-bg/`,
    changeBg: `${API_URL}/api/v1/image/change-bg/`,
    segment: `${API_URL}/api/v1/image/remove-bg/`,
    
    // Style Transfer (Stability AI)
    styleTransfer: `${API_URL}/api/v1/image/style-transfer/`,
    
    // Text-to-Image (Cloudflare/Stability cascade proxy)
    cloudflareGenerate: `${API_URL}/api/generate/text-to-image/`,
    generateImageBinary: `${API_URL}/api/generate/text-to-image/`,
    
    // Edit Image (Img2Img via Cloudflare/Stability proxy)
    editImage: `${API_URL}/api/generate/edit-image/`,
    
    // Colorize (v1 proxy)
    colorize: `${API_URL}/api/v1/image/colorize/`,

    // Enhancement & Correction
    dehaze: `${API_URL}/api/v1/image/dehaze/`,
    autoColor: `${API_URL}/api/v1/image/auto-color/`,
    autoEnhance: `${API_URL}/api/v1/image/auto-enhance/`,
    
    // Generation Status
    generationStatus: `${API_URL}/api/images/generation_status/`,
    
    // Sticker Engine (Migrated to Django)
    sticker: {
        generate: `${API_URL}/api/v1/sticker/generate/`,
        pack: `${API_URL}/api/v1/sticker/generate/`, // Pack logic now handled by same endpoint or handled client-side
        face: `${API_URL}/api/v1/sticker/generate/`,
        whatsapp: `${API_URL}/api/v1/sticker/generate/`,
        removeBg: `${API_URL}/api/v1/image/remove-bg/`,
        textToSticker: `${API_URL}/api/v1/sticker/text-to-sticker/`,
    },

    // AI Intelligence
    intelligence: {
        upload: `${NODE_API_URL}/api/upload`,
        status: `${NODE_API_URL}/api/status`,
        analyzeImage: `${NODE_API_URL}/api/chatbot/analyze-image`,
        chatbotIntent: `${NODE_API_URL}/api/chatbot/intent`,
        optimizePrompt: `${NODE_API_URL}/api/chatbot/optimize-prompt`,
        generateTagline: `${NODE_API_URL}/api/chatbot/generate-tagline`,
        history: {
            all: `${NODE_API_URL}/api/history/all`,
            chat: `${NODE_API_URL}/api/history/chat`,
            workflow: `${NODE_API_URL}/api/history/workflow`,
        }
    },

    // Subscriptions
    subscriptions: {
        status: `${API_URL}/api/subscriptions/status/`,
        createOrder: `${API_URL}/api/subscriptions/create-order/`,
        verifyPayment: `${API_URL}/api/subscriptions/verify-payment/`,
    },
    contact: `${API_URL}/api/contact/`,
};

export default {
    API_URL,
    NODE_API_URL,
    MEDIA_URL,
    apiEndpoints,
    getMediaUrl
};
