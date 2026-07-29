/**
 * Utility to process AI-generated frames and ensure their "opening" is transparent.
 * Most AI-frames have a checkered background (white/grey) or a solid center.
 */

export const processFrameTransparency = async (frameSrc) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = frameSrc;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Checkered pattern detection logic:
            // Most "empty" AI backgrounds are light squares (e.g., 255,255,255 and 240,240,240)
            // Or solid white/grey
            // We focus on the central 90% of the image to avoid touching the border
            const margin = Math.floor(canvas.width * 0.05);

            for (let y = margin; y < canvas.height - margin; y++) {
                for (let x = margin; x < canvas.width - margin; x++) {
                    const idx = (y * canvas.width + x) * 4;
                    const r = data[idx];
                    const g = data[idx+1];
                    const b = data[idx+2];
                    
                    // Detect light grey / white (classic AI checkered colors)
                    const isVeryLight = r > 230 && g > 230 && b > 230;
                    const isGreyish = Math.abs(r - g) < 5 && Math.abs(g - b) < 5 && r > 180;

                    if (isVeryLight || isGreyish) {
                        data[idx + 3] = 0; // Make transparent
                    }
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = () => {
            console.error("Failed to load frame for processing:", frameSrc);
            resolve(frameSrc); // Fallback to original
        };
    });
};
