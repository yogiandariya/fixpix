// filterEngine.js

export const FILTER_PRESETS = {
  portrait: [
    { id: 'studio-light-pro', name: 'Studio Light Pro', css: 'brightness(1.12) contrast(1.08) saturate(1.05) drop-shadow(0 4px 10px rgba(255,255,255,0.15))' },
    { id: 'skin-smooth-ai', name: 'Skin Smooth AI', css: 'blur(0.2px) brightness(1.08) contrast(0.95) saturate(1.02)' },
    { id: 'linkedin-clean', name: 'LinkedIn Clean', css: 'brightness(1.08) contrast(1.12) saturate(1.08)' },
    { id: 'passport-ready', name: 'Passport Ready', css: 'brightness(1.05) contrast(1.15) saturate(0.95)' },
    { id: 'beauty-glow', name: 'Beauty Glow', css: 'brightness(1.15) contrast(1.05) saturate(1.15) drop-shadow(0 0 8px rgba(255,240,240,0.3)) blur(0.1px)' },
    { id: 'sharp-face-hd', name: 'Sharp Face HD', css: 'contrast(1.22) saturate(1.12) brightness(0.98)' } 
  ],
  cinematic: [
    { id: 'teal-orange', name: 'Teal & Orange', css: 'hue-rotate(-12deg) contrast(1.25) saturate(1.35) brightness(0.95)' },
    { id: 'film-look', name: 'Film Look', css: 'sepia(0.25) contrast(1.15) brightness(0.95) saturate(0.85) drop-shadow(0 2px 4px rgba(0,0,0,0.3))' },
    { id: 'hdr-boost', name: 'HDR Boost', css: 'contrast(1.35) saturate(1.45) brightness(1.08) drop-shadow(0 4px 12px rgba(0,0,0,0.4))' },
    { id: 'moody-dark', name: 'Moody Dark', css: 'brightness(0.8) contrast(1.4) saturate(0.9) grayscale(0.15)' },
    { id: 'netflix-tone', name: 'Netflix Tone', css: 'contrast(1.25) saturate(0.85) hue-rotate(8deg) brightness(0.88)' }
  ],
  social_media: [
    { id: 'ig-warm', name: 'Instagram Warm', css: 'sepia(0.2) saturate(1.3) contrast(1.1) hue-rotate(-8deg) brightness(1.05)' },
    { id: 'viral-pop', name: 'Viral Pop', css: 'saturate(1.45) contrast(1.2) brightness(1.1) drop-shadow(0 2px 8px rgba(255,255,255,0.2))' },
    { id: 'reels-boost', name: 'Reels Boost', css: 'contrast(1.25) saturate(1.35) brightness(1.02)' },
    { id: 'selfie-glow', name: 'Selfie Glow', css: 'brightness(1.15) blur(0.1px) contrast(0.98) saturate(1.15) drop-shadow(0 0 6px rgba(255,255,255,0.2))' }
  ],
  product: [
    { id: 'ecommerce-bright', name: 'E-commerce Bright', css: 'brightness(1.18) contrast(1.08) saturate(1.08)' },
    { id: 'clean-white', name: 'Clean White', css: 'brightness(1.25) contrast(1.15) saturate(0.95)' },
    { id: 'amazon-ready', name: 'Amazon Ready', css: 'contrast(1.3) brightness(1.15)' },
    { id: 'product-sharp', name: 'Product Sharp', css: 'contrast(1.35) saturate(1.2) brightness(1.05)' }
  ],
  creative: [
    { id: 'dream-glow', name: 'Dream Glow', css: 'brightness(1.15) contrast(0.9) saturate(1.3) blur(0.8px) drop-shadow(0 0 10px rgba(255,255,255,0.4))' },
    { id: 'anime-style', name: 'Anime Style', css: 'saturate(1.9) contrast(1.25) brightness(1.15)' },
    { id: 'oil-paint', name: 'Oil Paint', css: 'saturate(1.6) contrast(1.3) blur(0.4px) brightness(1.05)' },
    { id: 'cartoon-lite', name: 'Cartoon Lite', css: 'saturate(2.2) contrast(1.6)' }
  ]
};

// Interpolate CSS filter values based on strength (0.0 to 1.0)
// Interpolate CSS filter values based on strength (0.0 to 100)
const parseAndScaleFilter = (cssStr, strengthObj) => {
    const ratio = Math.max(0, Math.min(1, strengthObj / 100));
    if (ratio === 1) return cssStr;
    if (ratio === 0) return ''; // Fixed: return empty instead of 'none' to avoid mixing CSS

    // Regex to match functions like `brightness(1.5)` or `hue-rotate(-15deg)` or `blur(1.5px)`
    // We improve this to only target simple numeric functions for now. 
    // Complex ones like drop-shadow or those containing rgba() are passed through to avoid corruption.
    const funcRegex = /([a-z-]+)\(([^)]+)\)/g;
    
    let result = cssStr.replace(funcRegex, (match, funcName, valStr) => {
        // Skip complex functions that our simple scaler can't handle (like drop-shadow or functions with multiple params)
        if (['drop-shadow', 'url'].includes(funcName) || valStr.includes(',') || valStr.includes('rgba')) {
            return match; 
        }

        // Handle specialized units
        let unit = '';
        if (valStr.includes('px')) unit = 'px';
        else if (valStr.includes('deg')) unit = 'deg';
        else if (valStr.includes('%')) unit = '%';

        const val = parseFloat(valStr);
        if (isNaN(val)) return match; 

        // Define baselines to interpolate towards
        let baseline = 1.0; 
        if (['blur', 'hue-rotate', 'sepia', 'grayscale', 'invert', 'opacity'].includes(funcName)) baseline = 0;
        
        let scaledVal = baseline + (val - baseline) * ratio;
        
        // Round to 3 decimal places for cleaner CSS
        scaledVal = Math.round(scaledVal * 1000) / 1000;
        
        return `${funcName}(${scaledVal}${unit})`;
    });
    
    return result.replace(/none/g, '').trim();
};

// Build final filter: Scales the base CSS by strength, then applies explicit post-modifiers.
export const buildCustomFilterCSS = (baseFilterStr = '', { strength = 100, brightness = 0, contrast = 0, saturation = 0, warmth = 0 }) => {
    
    let baseScaled = baseFilterStr ? parseAndScaleFilter(baseFilterStr, strength) : '';

    let custom = '';
    
    // Scale user -100 to 100 range to CSS values
    if (brightness !== 0) custom += ` brightness(${1 + (brightness / 100)})`;
    if (contrast !== 0) custom += ` contrast(${1 + (contrast / 100)})`;
    if (saturation !== 0) custom += ` saturate(${1 + (saturation / 100)})`;
    if (warmth !== 0) {
        custom += warmth > 0 
           ? ` sepia(${warmth / 100}) hue-rotate(-${warmth * 0.15}deg)` 
           : ` hue-rotate(${Math.abs(warmth) * 0.2}deg)`;
    }

    const finalCss = `${baseScaled} ${custom}`.trim();
    return finalCss === '' ? 'none' : finalCss;
};

// Deep-Bake SVG Primitive Generator for Safari/Chrome stability
const buildSVGFilterTags = (cssStr) => {
    const funcRegex = /([a-z-]+)\(([^)]+)\)/g;
    let primitives = '';
    
    let match;
    while ((match = funcRegex.exec(cssStr)) !== null) {
        const [full, func, val] = match;
        const num = parseFloat(val);
        
        switch (func) {
            case 'brightness':
                primitives += `<feComponentTransfer><feFuncR type="linear" slope="${num}"/><feFuncG type="linear" slope="${num}"/><feFuncB type="linear" slope="${num}"/></feComponentTransfer>`;
                break;
            case 'contrast':
                const intercept = -(0.5 * num) + 0.5;
                primitives += `<feComponentTransfer><feFuncR type="linear" slope="${num}" intercept="${intercept}"/><feFuncG type="linear" slope="${num}" intercept="${intercept}"/><feFuncB type="linear" slope="${num}" intercept="${intercept}"/></feComponentTransfer>`;
                break;
            case 'saturate':
                primitives += `<feColorMatrix type="saturate" values="${num}"/>`;
                break;
            case 'grayscale':
                primitives += `<feColorMatrix type="saturate" values="${1 - num}"/>`;
                break;
            case 'sepia':
                // Standard W3C Sepia Matrix
                const s = num;
                const matrix = [
                    (0.393 + 0.607 * (1 - s)), (0.769 - 0.769 * (1 - s)), (0.189 - 0.189 * (1 - s)), 0, 0,
                    (0.349 - 0.349 * (1 - s)), (0.686 + 0.314 * (1 - s)), (0.168 - 0.168 * (1 - s)), 0, 0,
                    (0.272 - 0.272 * (1 - s)), (0.534 - 0.534 * (1 - s)), (0.131 + 0.869 * (1 - s)), 0, 0,
                    0, 0, 0, 1, 0
                ].join(' ');
                primitives += `<feColorMatrix type="matrix" values="${matrix}"/>`;
                break;
            case 'hue-rotate':
                const angle = val.includes('deg') ? num : num * 1;
                primitives += `<feColorMatrix type="hueRotate" values="${angle}"/>`;
                break;
            case 'blur':
                primitives += `<feGaussianBlur stdDeviation="${num}"/>`;
                break;
        }
    }
    return primitives;
};

export const applyFilterToImage = (imageUrl, htmlCssFilter) => {
    return new Promise((resolve, reject) => {
        const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
        const img = new Image();
        if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            img.crossOrigin = "anonymous";
        }

        img.onload = async () => {
            try {
                const width = img.naturalWidth || img.width;
                const height = img.naturalHeight || img.height;
                const MAX_DIM = 2048;
                let scale = 1;
                if (width > MAX_DIM || height > MAX_DIM) {
                    scale = Math.min(MAX_DIM / width, MAX_DIM / height);
                }
                const targetWidth = Math.floor(width * scale);
                const targetHeight = Math.floor(height * scale);

                const bakeCanvas = document.createElement('canvas');
                bakeCanvas.width = targetWidth;
                bakeCanvas.height = targetHeight;
                // use software-backed buffer for better filter persistence in Safari
                const bakeCtx = bakeCanvas.getContext('2d', { willReadFrequently: true });

                const finalize = () => {
                   // Safari 16/17 GPU buffers can lag; we add a slight sync delay
                   setTimeout(() => {
                       try {
                           const dataUrl = bakeCanvas.toDataURL('image/png');
                           if (!dataUrl || dataUrl === 'data:,') {
                               resolve(imageUrl); // Last resort fallback
                           } else {
                               resolve(dataUrl);
                           }
                       } catch(e) { reject(e); }
                   }, isSafari ? 150 : 20);
                };

                // DEEP FIX: Use SVG primitives for Safari to guarantee pixel bake
                if (isSafari && htmlCssFilter !== 'none') {
                    try {
                        // 1. Convert Image to Base64 to bypass security locks in Safari SVG tags
                        const blob = await fetch(imageUrl).then(r => r.blob());
                        const base64 = await new Promise(r => {
                            const reader = new FileReader();
                            reader.onloadend = () => r(reader.result);
                            reader.readAsDataURL(blob);
                        });

                        // 2. Build the SVG with internal primitives
                        const primitives = buildSVGFilterTags(htmlCssFilter);
                        const svgXml = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="${targetWidth}" height="${targetHeight}">
                                <defs>
                                    <filter id="f" x="0" y="0" width="100%" height="100%">
                                        ${primitives}
                                    </filter>
                                </defs>
                                <image href="${base64}" width="${targetWidth}" height="${targetHeight}" filter="url(#f)" />
                            </svg>
                        `;

                        const svgImg = new Image();
                        const blobSvg = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
                        const svgUrl = URL.createObjectURL(blobSvg);

                        svgImg.onload = () => {
                            bakeCtx.drawImage(svgImg, 0, 0);
                            URL.revokeObjectURL(svgUrl);
                            finalize();
                        };
                        svgImg.onerror = () => {
                            URL.revokeObjectURL(svgUrl);
                            // Emergency fallback to ctx.filter
                            bakeCtx.filter = htmlCssFilter.replace(/drop-shadow\s*\([^)]*?(\([^)]*?\)[^)]*?)*?\)/g, '');
                            bakeCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
                            finalize();
                        };
                        svgImg.src = svgUrl;
                    } catch (err) {
                        console.warn("SVG Primitive engine failed, using direct ctx fallback", err);
                        bakeCtx.filter = htmlCssFilter.replace(/drop-shadow\s*\([^)]*?(\([^)]*?\)[^)]*?)*?\)/g, '');
                        bakeCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
                        finalize();
                    }
                } else {
                    // Chrome/Firefox: standard path is optimized and reliable
                    bakeCtx.filter = htmlCssFilter;
                    bakeCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    finalize();
                }
                
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = () => reject(new Error('Failed to load buffer image'));
        img.src = imageUrl;
    });
};

