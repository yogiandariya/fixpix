import React, { useRef, useEffect, useState } from "react";

const DotMap = ({ isDark }) => {
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const accentColor = 'rgba(0, 122, 255, 0.4)'; // iOS Blue tint
    const dotColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
    const routeColor = isDark ? 'rgba(0, 122, 255, 0.6)' : 'rgba(0, 122, 255, 0.4)';

    const routes = [
        { start: { x: 0.1, y: 0.3, delay: 0 }, end: { x: 0.3, y: 0.2, delay: 2 } },
        { start: { x: 0.3, y: 0.2, delay: 2 }, end: { x: 0.4, y: 0.4, delay: 4 } },
        { start: { x: 0.05, y: 0.1, delay: 1 }, end: { x: 0.2, y: 0.5, delay: 3 } },
        { start: { x: 0.5, y: 0.2, delay: 0.5 }, end: { x: 0.35, y: 0.4, delay: 2.5 } },
    ];

    const generateDots = (width, height) => {
        const dots = [];
        const gap = 16;
        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                const isInMapShape =
                    ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
                    ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
                    ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
                    ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
                    ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
                    ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6));

                if (isInMapShape && Math.random() > 0.4) {
                    dots.push({ x, y, opacity: Math.random() * 0.4 + 0.1 });
                }
            }
        }
        return dots;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                setDimensions({ width: canvas.width, height: canvas.height });
            }
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const dots = generateDots(dimensions.width, dimensions.height);
        let animationFrameId;
        let startTime = Date.now();

        function draw() {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            
            // Draw Dots
            dots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = dotColor.replace('0.08', dot.opacity.toString()).replace('0.15', dot.opacity.toString());
                ctx.fill();
            });

            // Draw Routes
            const currentTime = (Date.now() - startTime) / 1000;
            routes.forEach(route => {
                const elapsed = currentTime - route.delay;
                if (elapsed <= 0) return;
                
                const progress = Math.min(elapsed / 3, 1);
                const startX = route.start.x * dimensions.width;
                const startY = route.start.y * dimensions.height;
                const endX = route.end.x * dimensions.width;
                const endY = route.end.y * dimensions.height;
                
                const curX = startX + (endX - startX) * progress;
                const curY = startY + (endY - startY) * progress;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(curX, curY);
                ctx.strokeStyle = routeColor;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(curX, curY, 3, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? '#FFF' : 'var(--accent, #007AFF)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(curX, curY, 8, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,122,255,0.15)';
                ctx.fill();
            });

            if (currentTime > 10) startTime = Date.now();
            animationFrameId = requestAnimationFrame(draw);
        }
        
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, isDark]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default DotMap;
