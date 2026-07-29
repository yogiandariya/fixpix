"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- Actual Website Content ---
const testimonials = [
  {
    quote: "I recovered photos from my grandmother's wedding that we thought were lost forever. The colorization is pure magic.",
    name: "Sarah Jenkins",
    designation: "Professional Photographer",
    src: "/assets/testimonials/sarah_jenkins.png",
  },
  {
    quote: "The level of detail FixPix recovers from old documents is simply unprecedented. A genuine game changer for our archive.",
    name: "Mark Thompson",
    designation: "Historical Archivist",
    src: "/assets/testimonials/mark_thompson.png",
  },
  {
    quote: "I use this tool daily to upscale low-res assets for clients. Saves hours of manual reconstruction work every single week.",
    name: "Jessica Chen",
    designation: "Senior Graphic Designer",
    src: "/assets/testimonials/jessica_chen.png",
  },
  {
    quote: "Finally an AI tool that respects the original grain while removing damage. The results are museum quality.",
    name: "David Wilson",
    designation: "Museum Curator",
    src: "/assets/testimonials/david_wilson.png",
  },
];

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

// --- Main Animated Testimonials Component ---
export const AnimatedTestimonials = ({
  testimonialsList = testimonials,
  autoplay = true,
}: {
  testimonialsList?: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonialsList.length);
  }, [testimonialsList.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  const isActive = (index: number) => index === active;

  // Fixed rotation for a cleaner iOS look, but subtle enough to feel dynamic
  const getRotation = (index: number) => {
    const diff = index - active;
    if (diff === 0) return 0;
    return diff * 5; // Simplified stable rotation
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 font-sans antialiased md:px-12">
      <div className="relative grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-24 items-center">
        
        {/* Featured Image Stack */}
        <div className="relative flex items-center justify-center lg:justify-start">
            <div className="relative h-[400px] w-full max-w-[400px] perspective-1000">
              <AnimatePresence mode="popLayout">
                {testimonialsList.map((testimonial, index) => (
                  isActive(index) && (
                    <motion.div
                        key={testimonial.src}
                        initial={{ 
                            opacity: 0, 
                            scale: 0.85, 
                            z: -100,
                            rotateY: 15,
                            x: 40
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            z: 0,
                            rotateY: 0,
                            x: 0,
                        }}
                        exit={{ 
                            opacity: 0, 
                            scale: 0.9, 
                            z: -50,
                            rotateY: -15,
                            x: -40
                        }}
                        transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                        }}
                        className="absolute inset-0"
                    >
                        <div className="group relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/20 shadow-[var(--depth-3)] dark:border-white/10">
                            <img
                                src={testimonial.src}
                                alt={testimonial.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Premium Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
              
              {/* Stack Decoration (iOS like depth) */}
              <div className="absolute -inset-4 -z-10 rounded-[3rem] border border-[var(--border-subtle)] bg-[var(--fill-secondary)] opacity-50 blur-sm" />
            </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] mb-6">
                <Quote size={24} fill="currentColor" className="opacity-80" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col"
            >
                <div className="space-y-4">
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-bold leading-relaxed text-[var(--text-primary)] md:text-4xl tracking-tighter"
                    >
                        &ldquo;{testimonialsList[active].quote}&rdquo;
                    </motion.p>
                    
                    <div className="pt-8">
                        <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                            {testimonialsList[active].name}
                        </h3>
                        <p className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest opacity-90">
                            {testimonialsList[active].designation}
                        </p>
                    </div>
                </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls with iOS Glassmorphism */}
          <div className="mt-12 flex items-center gap-6">
            <div className="flex gap-3">
                <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-medium)] bg-[var(--surface)] shadow-[var(--depth-1)] transition-all hover:bg-[var(--fill-secondary)] hover:shadow-[var(--depth-2)] active:scale-95"
                >
                <ArrowLeft className="h-6 w-6 text-[var(--text-primary)] transition-transform duration-300 group-hover:-translate-x-1" />
                </button>
                <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-medium)] bg-[var(--surface)] shadow-[var(--depth-1)] transition-all hover:bg-[var(--fill-secondary)] hover:shadow-[var(--depth-2)] active:scale-95"
                >
                <ArrowRight className="h-6 w-6 text-[var(--text-primary)] transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
            
            {/* Pagination Indicator */}
            <div className="flex gap-2">
                {testimonialsList.map((_, i) => (
                    <div 
                        key={i}
                        className={cn(
                            "h-1.5 transition-all duration-500 rounded-full",
                            i === active ? "w-8 bg-[var(--accent)]" : "w-1.5 bg-[var(--border-medium)]"
                        )}
                    />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
