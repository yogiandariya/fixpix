import React from 'react';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, Palette, Globe, Sparkles, Heart, FileText, Share2, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── Spring Configs ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };

const PressPage = () => {
    const brandColors = [
        { name: 'FixPix Blue', hex: '#6366F1', hsl: '239, 84%, 67%' },
        { name: 'Neural Violet', hex: '#AF52DE', hsl: '280, 68%, 60%' },
        { name: 'Classic Dark', hex: '#000000', hsl: '0, 0%, 0%' }
    ];

    const assets = [
        { title: 'Primary Symbol', ext: 'SVG/PNG', desc: 'Our neural spark icon for profile and app identity.', icon: Sparkles },
        { title: 'Full Wordmark', ext: 'SVG/PNG', desc: 'FixPix AI logotype in light and dark variants.', icon: FileText },
        { title: 'UI Kit Preview', ext: 'PDF/FIG', desc: 'Visual guidelines for interface integration.', icon: Palette },
        { title: 'Press Release', ext: 'PDF', desc: 'FixPix 2.0 Genesis: The Neural Restoration era.', icon: ImageIcon }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] selection:bg-[var(--accent-transparent)] selection:text-[var(--accent)]">
            <Navbar />

            {/* Cinematic Header */}
            <div className="relative pt-40 pb-32 overflow-hidden border-b border-[var(--border-subtle)]">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-[var(--accent-soft)] blur-[140px] rounded-full opacity-10" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-[#AF52DE]/5 blur-[140px] rounded-full opacity-10" />
                </div>

                <div className="relative z-10 max-w-[1000px] mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_PREMIUM}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-soft)] mb-8">
                            <Share2 size={14} className="text-[var(--accent)]" />
                            <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">Press Center</span>
                        </div>
                        <h1 className="text-[56px] md:text-[84px] font-black text-[var(--text-primary)] tracking-tight leading-[0.85] mb-8" style={{ letterSpacing: '-0.04em' }}>
                            BRAND &<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[#AF52DE] to-[#34C759]">PIXEL ASSETS.</span>
                        </h1>
                        <p className="text-[18px] md:text-[21px] font-medium text-[var(--text-secondary)] leading-relaxed max-w-[620px] mx-auto">
                            The official FixPix media toolkit. Everything you need to showcase our neural restoration vision accurately.
                        </p>
                    </motion.div>
                </div>
            </div>

            <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-24 pb-40">
                {/* Visual Assets Grid */}
                <section className="mb-32">
                     <div className="flex items-center gap-4 mb-12">
                         <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                         <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-tertiary)]">Visual Identity</h2>
                         <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {assets.map((asset, i) => (
                            <motion.div
                                key={asset.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ ...SPRING_PREMIUM, delay: i * 0.1 }}
                                className="group p-8 rounded-[3rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] flex flex-col items-center text-center hover:border-[var(--accent-soft)] hover:shadow-xl transition-all"
                            >
                                <div className="w-16 h-16 rounded-[2rem] bg-[var(--fill-tertiary)] flex items-center justify-center text-[var(--accent)] mb-8 group-hover:scale-110 transition-transform">
                                    <asset.icon size={28} />
                                </div>
                                <h3 className="text-[17px] font-black text-[var(--text-primary)] mb-1 tracking-tight">{asset.title}</h3>
                                <p className="text-[12px] font-medium text-[var(--text-tertiary)] leading-relaxed mb-6">{asset.desc}</p>
                                <button className="w-full py-4 rounded-2xl bg-[var(--fill-tertiary)] text-[var(--text-primary)] text-[11px] font-black uppercase tracking-widest border border-[var(--border-subtle)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-transparent transition-all flex items-center justify-center gap-2">
                                    <Download size={14} /> {asset.ext}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Brand Colors */}
                <section className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-[4rem] p-10 md:p-20 shadow-[var(--depth-2)] overflow-hidden">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
                        <div>
                            <h2 className="text-[42px] font-black text-[var(--text-primary)] tracking-tighter leading-none mb-6">Neural Palette.</h2>
                            <p className="text-[16px] font-medium text-[var(--text-secondary)] max-w-sm">The specific luminance and saturation tokens that define the FixPix interface.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {brandColors.map((color, i) => (
                            <motion.div
                                key={color.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ ...SPRING_PREMIUM, delay: i * 0.1 }}
                                className="p-6 rounded-[2.5rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] group"
                            >
                                <div 
                                    className="w-full h-40 rounded-[2rem] mb-6 shadow-inner relative overflow-hidden" 
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 italic flex items-center justify-center font-black text-white text-[12px] uppercase tracking-widest transition-opacity">
                                        FixPix Token
                                    </div>
                                </div>
                                <h3 className="text-[17px] font-black text-[var(--text-primary)] mb-4 tracking-tight">{color.name}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                        <span>Hex</span>
                                        <span className="text-[var(--text-primary)]">{color.hex}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                        <span>HSL</span>
                                        <span className="text-[var(--text-primary)]">{color.hsl}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Inquiry CTA */}
                <div className="mt-32 text-center">
                    <p className="text-[15px] font-bold text-[var(--text-secondary)] mb-10">Looking for a specific neural manifestation or interview access?</p>
                    <motion.a
                        href="/contact"
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-[var(--accent-soft)]"
                    >
                        Press Connection <ArrowRight size={16} strokeWidth={3} />
                    </motion.a>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PressPage;
