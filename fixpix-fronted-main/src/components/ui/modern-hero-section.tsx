import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Define the props for the component
interface HeroCollageProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  subtitle: string;
  stats: { value: string; label: string }[];
  images: string[];
}

// Keyframes for the floating animation - enhanced for iOS feel
const animationStyle = `
  @keyframes surreal-glow {
    0% { filter: drop-shadow(0 0 5px rgba(var(--accent-rgb), 0.2)); }
    50% { filter: drop-shadow(0 0 20px rgba(var(--accent-rgb), 0.4)); }
    100% { filter: drop-shadow(0 0 5px rgba(var(--accent-rgb), 0.2)); }
  }
  .animate-surreal-glow {
    animation: surreal-glow 4s ease-in-out infinite;
  }
  @keyframes float-up {
    0% { transform: translateY(0px) translateZ(0); box-shadow: var(--depth-1); }
    50% { transform: translateY(-12px) translateZ(0); box-shadow: var(--depth-2); }
    100% { transform: translateY(0px) translateZ(0); box-shadow: var(--depth-1); }
  }
  .animate-float-up {
    animation: float-up 6s var(--ease-out) infinite;
    will-change: transform, box-shadow;
  }
`;

const HeroCollage = React.forwardRef<HTMLDivElement, HeroCollageProps>(
  ({ className, title, subtitle, stats, images, ...props }, ref) => {
    // We need exactly 10 images for this layout to feel full
    const displayImages = images.slice(0, 10);

    return (
      <>
        <style>{animationStyle}</style>
        <section
          ref={ref}
          className={cn(
            'relative w-full bg-[var(--bg-primary)] font-sans py-14 md:py-20 lg:py-32 overflow-x-hidden transition-colors duration-500',
            className
          )}
          {...props}
        >
          {/* Ambient Background Glows - iOS Style */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-[0.02] blur-[100px] rounded-full" />
          </div>

          {/* Main Content */}
          <div className="container relative z-20 mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-[var(--text-primary)] leading-[1.05]">
                {title}
              </h1>
              <p className="mx-auto mt-4 md:mt-6 max-w-2xl text-sm md:text-base lg:text-lg text-[var(--text-secondary)] font-medium leading-relaxed tracking-tight">
                {subtitle}
              </p>

              {/* CTA Buttons - Matching project style */}
              <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <button
                  className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-lg shadow-[var(--accent-soft)] hover:scale-[1.02] active:scale-[0.98] tracking-tight"
                  onClick={() => window.location.href = '/app/restoration'}
                >
                  Start Restoring Now
                </button>
                <button
                  className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-[var(--surface)] text-[var(--text-primary)] font-bold rounded-full border border-[var(--border-medium)] hover:bg-[var(--surface-secondary)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] glass-panel tracking-tight shadow-sm"
                >
                  Explore Features
                </button>
              </div>
            </motion.div>
          </div>

          {/* Image Collage - Updated Layout with Glassmorphism */}
          <div className="relative z-10 mt-12 md:mt-20 h-[360px] sm:h-[460px] md:h-[560px] lg:h-[650px] flex items-center justify-center px-3 sm:px-4 lg:px-20 overflow-hidden">
            <div className="relative h-full w-full max-w-7xl">
              {/* Central Image - Main Focus */}
              {displayImages[0] && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-float-up" style={{ animationDelay: '0s' }}>
                  <div className="relative group">
                    <img
                      src={displayImages[0]}
                      alt="Main feature"
                      loading="eager"
                      decoding="async"
                      className="h-auto w-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px] rounded-2xl shadow-2xl border-4 border-[var(--surface)] glass-panel object-cover aspect-[3/4]"
                      style={{ boxShadow: 'var(--depth-3)' }}
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Top-Left */}
              {displayImages[1] && (
                <div className="absolute left-[15%] top-[10%] z-10 animate-float-up" style={{ animationDelay: '-1.2s' }}>
                  <img
                    src={displayImages[1]}
                    alt="Feature 2"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full max-w-[120px] sm:max-w-[180px] md:max-w-[224px] rounded-xl shadow-xl border-2 border-[var(--surface)] glass-panel opacity-90 hover:opacity-100 transition-opacity duration-300 object-cover aspect-video"
                  />
                </div>
              )}

              {/* Top-Right */}
              {displayImages[2] && (
                <div className="absolute right-[18%] top-[5%] z-10 animate-float-up" style={{ animationDelay: '-2.5s' }}>
                  <img
                    src={displayImages[2]}
                    alt="Feature 3"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full max-w-[110px] sm:max-w-[160px] md:max-w-[208px] rounded-xl shadow-xl border-2 border-[var(--surface)] glass-panel opacity-90 hover:opacity-100 transition-opacity duration-300 object-cover aspect-square"
                  />
                </div>
              )}

              {/* Bottom-Right */}
              {displayImages[3] && (
                <div className="absolute right-[12%] bottom-[15%] z-20 animate-float-up" style={{ animationDelay: '-3.5s' }}>
                  <img
                    src={displayImages[3]}
                    alt="Feature 4"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full max-w-[130px] sm:max-w-[190px] md:max-w-[256px] rounded-xl shadow-2xl border-2 border-[var(--surface)] glass-panel object-cover aspect-[4/3]"
                  />
                </div>
              )}

              {/* Far-Right */}
              {displayImages[4] && (
                <div className="absolute right-[2%] top-1/2 -translate-y-[60%] z-10 animate-float-up" style={{ animationDelay: '-4.8s' }}>
                  <img
                    src={displayImages[4]}
                    alt="Feature 5"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full max-w-[105px] sm:max-w-[140px] md:max-w-[192px] rounded-xl shadow-lg border border-[var(--surface)] glass-panel opacity-80 hover:opacity-100 transition-opacity duration-300 object-cover aspect-square"
                  />
                </div>
              )}

              {/* Bottom-Left */}
              {displayImages[5] && (
                <div className="absolute left-[10%] bottom-[12%] z-20 animate-float-up" style={{ animationDelay: '-5.2s' }}>
                  <img
                    src={displayImages[5]}
                    alt="Feature 6"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full max-w-[120px] sm:max-w-[170px] md:max-w-[240px] rounded-xl shadow-2xl border-2 border-[var(--surface)] glass-panel object-cover aspect-square"
                  />
                </div>
              )}

              {/* Far-Left */}
              {displayImages[6] && (
                <div className="absolute left-[2%] top-[30%] z-10 animate-float-up" style={{ animationDelay: '-6s' }}>
                  <img
                    src={displayImages[6]}
                    alt="Feature 7"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full max-w-[95px] sm:max-w-[130px] md:max-w-[176px] rounded-xl shadow-lg border border-[var(--surface)] glass-panel opacity-80 hover:opacity-100 transition-opacity duration-300 object-cover aspect-[3/4]"
                  />
                </div>
              )}

              {/* 7. Surreal Portrait - Moved to Top-Center-Left for better visibility */}
              {displayImages[7] && (
                <div
                  className="absolute left-[28%] top-[40%] z-10 animate-float-up animate-surreal-glow"
                  style={{ animationDelay: '-1.8s', transform: 'rotate(-5deg)' }}
                >
                  <img
                    src={displayImages[7]}
                    alt="Feature 8"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-40 sm:w-52 rounded-2xl shadow-2xl border border-[var(--surface)] glass-panel opacity-90 hover:opacity-100 transition-all duration-500 hover:scale-110 object-cover aspect-video"
                  />
                </div>
              )}

              {/* 8. Abstract Chrome - Moved to Far-Right Center for balance */}
              {displayImages[8] && (
                <div
                  className="absolute right-[48%] top-[60%] z-20 animate-float-up animate-surreal-glow"
                  style={{ animationDelay: '-2.9s', transform: 'rotate(8deg)' }}
                >
                  <img
                    src={displayImages[8]}
                    alt="Feature 9"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-44 sm:w-60 rounded-2xl shadow-2xl border-2 border-[var(--surface)] glass-panel object-cover aspect-square hover:scale-105 transition-all duration-500"
                  />
                </div>
              )}

              {/* 9. Crystal Nature - Moved to Center-Right Gap */}
              {displayImages[9] && (
                <div
                  className="absolute right-[28%] top-[20%] z-10 animate-float-up animate-surreal-glow"
                  style={{ animationDelay: '-4.1s', transform: 'rotate(-3deg)' }}
                >
                  <img
                    src={displayImages[9]}
                    alt="Feature 10"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-40 sm:w-56 rounded-2xl shadow-2xl border border-[var(--surface)] glass-panel object-cover aspect-[4/3] hover:scale-105 transition-all duration-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats Section - Premium IOS Rounded Bar */}
          <div className="container relative z-20 mx-auto mt-6 md:mt-8 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-4xl mx-auto py-6 md:py-8 px-4 sm:px-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-xl glass-panel relative overflow-hidden"
            >
              {/* Background gradient for the stats bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-soft)] to-transparent opacity-[0.05] pointer-events-none" />

              <div className="relative flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-16 lg:gap-24">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-[var(--accent)] group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }
);

HeroCollage.displayName = 'HeroCollage';

export { HeroCollage };
