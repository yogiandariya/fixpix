/**
 * stickerEngine.js — Client-side sticker helpers
 * 
 * Handles download, preview, and conversion utilities.
 * Heavy processing (outline, resize) is done server-side via Sharp.
 */

import { apiEndpoints } from '../lib/api';
import { authenticatedFetch } from '../lib/authFetch';

/**
 * Generate a sticker from an image blob via the backend.
 * The image should already have its background removed.
 * 
 * @param {Blob|string} image - Image blob or data URL
 * @param {Object} options
 * @param {number} options.outlineWidth - Outline thickness
 * @param {string} options.outlineColor - Color preset key
 * @returns {Promise<string>} Sticker data URL
 */
export async function generateStickerFromImage(image, options = {}) {
    const formData = new FormData();

    if (typeof image === 'string') {
        // Convert data URL or blob URL to blob
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, 'sticker_input.png');
    } else {
        formData.append('image', image, 'sticker_input.png');
    }

    if (options.outlineWidth) {
        formData.append('outlineWidth', options.outlineWidth.toString());
    }
    if (options.outlineColor) {
        formData.append('outlineColor', options.outlineColor);
    }

    const res = await authenticatedFetch(apiEndpoints.sticker.generate, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Sticker generation failed' }));
        throw new Error(err.error || err.message || 'Sticker generation failed');
    }

    const data = await res.json();
    return data.sticker;
}

/**
 * Generate a sticker pack (4 variants) from an image.
 * 
 * @param {Blob|string} image - Image blob or data URL
 * @returns {Promise<Object>} Pack object with normal, outlined, emoji, neon keys
 */
export async function generateStickerPack(image) {
    const formData = new FormData();

    if (typeof image === 'string') {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, 'pack_input.png');
    } else {
        formData.append('image', image, 'pack_input.png');
    }

    const res = await authenticatedFetch(apiEndpoints.sticker.pack, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Pack generation failed' }));
        throw new Error(err.error || err.message || 'Pack generation failed');
    }

    const data = await res.json();
    return data.pack;
}

/**
 * Generate face/emoji sticker from an image.
 * 
 * @param {Blob|string} image - Face image
 * @param {Object} options
 * @returns {Promise<string>} Sticker data URL
 */
export async function generateFaceSticker(image, options = {}) {
    const formData = new FormData();

    if (typeof image === 'string') {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, 'face_input.png');
    } else {
        formData.append('image', image, 'face_input.png');
    }

    if (options.outlineWidth) {
        formData.append('outlineWidth', options.outlineWidth.toString());
    }
    if (options.outlineColor) {
        formData.append('outlineColor', options.outlineColor);
    }

    const res = await authenticatedFetch(apiEndpoints.sticker.face, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Face sticker failed' }));
        throw new Error(err.error || err.message || 'Face sticker generation failed');
    }

    const data = await res.json();
    return data.sticker;
}

/**
 * Convert a sticker to WhatsApp-compatible WebP format.
 * 
 * @param {Blob|string} image - Sticker image
 * @returns {Promise<{sticker: string, whatsappCompliant: boolean}>}
 */
export async function exportToWhatsApp(image) {
    const formData = new FormData();

    if (typeof image === 'string') {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, 'whatsapp_input.png');
    } else {
        formData.append('image', image, 'whatsapp_input.png');
    }

    const res = await authenticatedFetch(apiEndpoints.sticker.whatsapp, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'WhatsApp export failed' }));
        throw new Error(err.error || err.message || 'WhatsApp export failed');
    }

    const data = await res.json();
    return {
        sticker: data.sticker,
        whatsappCompliant: data.whatsappCompliant,
    };
}

/**
 * Get optimized prompt for text→sticker generation.
 * 
 * @param {string} prompt - User prompt
 * @param {string} style - Style key
 * @returns {Promise<string>} Optimized prompt
 */
export async function buildStickerPrompt(prompt, style = 'cartoon') {
    const res = await fetch(apiEndpoints.sticker.textPrompt, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
    });

    if (!res.ok) {
        throw new Error('Failed to build sticker prompt');
    }

    const data = await res.json();
    return data.optimizedPrompt;
}

/**
 * Download a data URL as a file.
 * 
 * @param {string} dataUrl - Data URL of the image
 * @param {string} filename - Download filename
 */
export function downloadSticker(dataUrl, filename = 'sticker.png') {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Download all stickers in a pack as individual files.
 * 
 * @param {Object} pack - Sticker pack object
 * @param {string} prefix - Filename prefix
 */
export function downloadStickerPack(pack, prefix = 'sticker') {
    const timestamp = Date.now();
    Object.entries(pack).forEach(([key, dataUrl], index) => {
        setTimeout(() => {
            downloadSticker(dataUrl, `${prefix}_${key}_${timestamp}.png`);
        }, index * 300); // Stagger downloads to avoid browser blocking
    });
}
