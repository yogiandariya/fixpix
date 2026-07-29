"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Zap,
  Eraser,
  Sparkles,
  Image,
  Layers,
  Cloud,
  Code,
  Download,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- FixPix Website Content ---
const FEATURES = [
  {
    id: "restoration",
    label: "AI Restoration",
    icon: Palette,
    image: "/assets/features/restoration.png",
    description: "Neural colorization that brings black & white memories back to vivid life.",
  },
  {
    id: "face",
    label: "Face Enhance",
    icon: Zap,
    image: "/assets/features/face.png",
    description: "Recover lost facial details and sharpen features with pixel-perfect precision.",
  },
  {
    id: "repair",
    label: "Damage Repair",
    icon: Eraser,
    image: "/assets/features/repair.png",
    description: "Automatically remove scratches, tears, and dust from physical photo scans.",
  },
  {
    id: "upscale",
    label: "AI Upscaling",
    icon: Sparkles,
    image: "/assets/features/upscale.png",
    description: "Enlarge images up to 4K resolution while maintaining crisp texture and clarity.",
  },
  {
    id: "frames",
    label: "Smart Frames",
    icon: Image,
    image: "/assets/features/frames.png",
    description: "Generate context-aware frames that perfectly complement your restored photos.",
  },
  {
    id: "batch",
    label: "Batch Process",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop",
    description: "Process entire photo albums at once with our high-speed neural cluster.",
  },
  {
    id: "cloud",
    label: "Cloud Storage",
    icon: Cloud,
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop",
    description: "Keep your memories safe and accessible from any device, anywhere in the world.",
  },
  {
    id: "api",
    label: "Developer API",
    icon: Code,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    description: "Integrate our restoration engine into your own apps with our robust REST API.",
  },
  {
    id: "export",
    label: "Pro Export",
    icon: Download,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    description: "Download in webp, png, or high-fidelity tiff formats for museum-quality printing.",
  },
  {
    id: "privacy",
    label: "Privacy First",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    description: "Bank-grade encryption ensures your photos are for your eyes only.",
  },
];

const AUTO_PLAY_INTERVAL = 4000;
const ITEM_HEIGHT = 70;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    // Handle wrapping for the shortest path
    const shortestDiff = diff > FEATURES.length / 2 ? diff - FEATURES.length : diff;
    setStep((s) => s + shortestDiff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-0 md:p-8 overflow-x-hidden">
      <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[3rem] flex flex-col lg:flex-row min-h-[520px] md:min-h-[600px] lg:aspect-video border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-2xl">
        
        {/* Left Side: Feature Selector */}
        <div className="w-full lg:w-[42%] min-h-[320px] md:min-h-[430px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-4 sm:px-6 md:px-10 lg:pl-16 bg-[var(--accent)]">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--accent)] to-transparent z-40" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--accent)] to-transparent z-40" />
          
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance
              );

              return (
                <motion.div
                  key={feature.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: "100%",
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.35,
                    scale: isActive ? 1 : 0.9,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="absolute flex items-center justify-start pointer-events-none"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "pointer-events-auto relative flex items-center gap-3 md:gap-5 px-4 sm:px-6 md:px-8 lg:px-8 py-3.5 md:py-4 rounded-xl transition-all duration-500 text-left group",
                      isActive
                        ? "bg-white text-[var(--accent)] shadow-xl scale-105 z-10"
                        : "bg-transparent text-white/50 hover:text-white"
                    )}
                  >
                    <div className={cn(
                        "flex items-center justify-center transition-colors duration-300",
                        isActive ? "text-[var(--accent)]" : "text-white/30"
                      )}>
                      <feature.icon size={20} strokeWidth={2.5} />
                    </div>

                    <span className="font-bold text-sm md:text-base lg:text-lg tracking-tight whitespace-normal sm:whitespace-nowrap uppercase leading-tight">
                      {feature.label}
                    </span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                      />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Feature Preview */}
        <div className="flex-1 min-h-[360px] sm:min-h-[460px] md:min-h-[600px] lg:h-full relative bg-[var(--bg-secondary)] flex items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)]">
          
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-gradient-to-br from-[var(--accent)]/10 to-transparent rounded-full blur-3xl" />

          <div className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] aspect-[4/5] flex items-center justify-center z-10">
            <AnimatePresence mode="popLayout">
              {FEATURES.map((feature, index) => {
                const status = getCardStatus(index);
                const isActive = status === "active";
                const isPrev = status === "prev";
                const isNext = status === "next";

                if (status === "hidden") return null;

                return (
                  <motion.div
                    key={feature.id}
                    initial={false}
                    animate={{
                      x: isActive ? 0 : isPrev ? -120 : isNext ? 120 : 0,
                      scale: isActive ? 1 : 0.82,
                      opacity: isActive ? 1 : 0.3,
                      rotate: isPrev ? -5 : isNext ? 5 : 0,
                      zIndex: isActive ? 20 : 10,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                    }}
                    className="absolute inset-0 rounded-[2.5rem] overflow-hidden border-8 border-[var(--surface)] bg-[var(--surface)]"
                    style={{ boxShadow: 'var(--depth-3)' }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.label}
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        "w-full h-full object-cover transition-all duration-1000",
                        isActive ? "scale-100 grayscale-0" : "scale-110 grayscale"
                      )}
                    />

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-white text-[var(--accent)] px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest w-fit mb-4 shadow-sm">
                          {index + 1} &bull; {feature.label}
                        </div>
                          <p className="text-white font-semibold text-sm md:text-base lg:text-lg leading-tight tracking-tight drop-shadow-md">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}

                    <div className={isActive ? "opacity-100" : "opacity-0"}>
                      <div className="absolute top-8 left-8 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]">
                          Live Neural Preview
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
