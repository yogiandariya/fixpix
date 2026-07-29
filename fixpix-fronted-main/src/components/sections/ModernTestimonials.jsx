import React from 'react';
import { AnimatedTestimonials } from '../ui/testimonial';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Play } from 'lucide-react';

const STATS = [
    { display: '10K+', label: 'Photos Restored' },
    { display: '4.9', label: 'Average Rating' },
    { display: '50+', label: 'Countries' },
];

const ModernTestimonials = () => {
    const navigate = useNavigate();
    
    return (
        <section id="testimonials" className="relative py-14 md:py-24 overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--border-subtle)]">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.35] overflow-hidden">
                <div className="animated-grid absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-wider mb-4 border border-[var(--accent)]/20">
                        Wall of Love
                    </span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
                        Loved by Users Worldwide
                    </h2>
                    <p className="mt-4 text-[var(--text-secondary)] text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                        Photographers, designers, and families trust FixPix to restore their most precious memories.
                    </p>
                </div>

                {/* Main Animated Component */}
                <AnimatedTestimonials />

                {/* Social Proof Stats */}
                <div className="mt-14 md:mt-20 py-8 md:py-12 px-4 sm:px-6 md:px-8 rounded-[2.5rem] bg-[var(--surface)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-wrap justify-center items-center gap-12 md:gap-24">
                        {STATS.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
                                    {stat.display}
                                </p>
                                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mt-2">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mt-24">
                    <p className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] mb-8 font-medium">
                        Ready to see the magic yourself?
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <motion.button
                            onClick={() => navigate('/login')}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-6 md:px-8 py-3.5 md:py-4 rounded-full bg-[var(--accent)] text-white font-bold shadow-lg shadow-[var(--accent)]/20 transition-all"
                        >
                            <Upload size={20} />
                            Upload Your First Photo
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/login')}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-6 md:px-8 py-3.5 md:py-4 rounded-full border border-[var(--border-medium)] bg-[var(--surface)] text-[var(--text-primary)] font-bold transition-all"
                        >
                            <Play size={20} fill="currentColor" />
                            Watch AI in Action
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModernTestimonials;
