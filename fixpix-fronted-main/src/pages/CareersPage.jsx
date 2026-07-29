import React from 'react';
import { motion } from 'framer-motion';
import { 
    Cpu, Palette, Zap, Globe, Sparkles, Heart, 
    ArrowRight, Rocket, Users, Target, Code2, Brain
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── Spring Configs ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };

const CareersPage = () => {
    const values = [
        { icon: Brain, title: 'Neural Integrity', desc: 'We build at the edge of the possible, but never at the expense of user trust or data ethics.' },
        { icon: Palette, title: 'Design Density', desc: 'Performance is a feature, but beauty is a commitment. We obsess over the pixel.' },
        { icon: Zap, title: 'Extreme Velocity', desc: 'Moving from research to production in record time. We ship neural magic daily.' }
    ];

    const roles = [
        { 
            title: 'Lead Design Engineer', 
            dept: 'Product Architecture', 
            type: 'Full-time / Remote',
            desc: 'Bridging the gap between UI perfection and heavy technical computation. Expertise in React and Motion Design required.'
        },
        { 
            title: 'Neural Vision Researcher', 
            dept: 'AI Core', 
            type: 'Hybrid / Bangalore',
            desc: 'Optimizing high-fidelity restoration models (ESRGAN, CodeFormer) for 60FPS browser performance.'
        },
        { 
            title: 'Growth Architect', 
            dept: 'Operations', 
            type: 'Full-time / Remote',
            desc: 'Expanding the FixPix ecosystem across global territories and professional photographic communities.'
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] selection:bg-[var(--accent-transparent)] selection:text-[var(--accent)]">
            <Navbar />

            {/* Cinematic Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-soft)] blur-[140px] rounded-full opacity-10" />
                <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#AF52DE]/10 blur-[140px] rounded-full opacity-10" />
            </div>

            <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-40 pb-40">
                {/* Hero */}
                <section className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_PREMIUM}
                    >
                        <div className="flex justify-center mb-8">
                            <motion.div 
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="w-20 h-20 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]"
                            >
                                <Rocket size={32} strokeWidth={2.5} />
                            </motion.div>
                        </div>
                        <h1 className="text-[56px] md:text-[84px] font-black text-[var(--text-primary)] tracking-tight leading-[0.85] mb-8" style={{ letterSpacing: '-0.04em' }}>
                            BUILDING THE<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[#AF52DE] to-[#34C759]">NEXT GEN VISION.</span>
                        </h1>
                        <p className="text-[18px] md:text-[21px] font-medium text-[var(--text-secondary)] leading-relaxed max-w-[620px] mx-auto">
                            Join FixPix AI and help us redefine how the world interacts with history. We're looking for architects, researchers, and visionaries.
                        </p>
                    </motion.div>
                </section>

                {/* Culture Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
                    {values.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING_PREMIUM, delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-10 rounded-[3rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[var(--fill-tertiary)] flex items-center justify-center text-[var(--accent)] mb-8">
                                <v.icon size={28} />
                            </div>
                            <h3 className="text-[20px] font-black text-[var(--text-primary)] mb-4 tracking-tight">{v.title}</h3>
                            <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Open Roles */}
                <section className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-[4rem] p-10 md:p-20 shadow-[var(--depth-2)] overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Target size={300} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div>
                                <h2 className="text-[42px] font-black text-[var(--text-primary)] tracking-tighter leading-none mb-6">Neural Openings.</h2>
                                <p className="text-[16px] font-medium text-[var(--text-secondary)] max-w-md">Our workspace currently has 3 technical slots available for immediate deployment.</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)]">Last updated: 4h ago</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {roles.map((role, i) => (
                                <motion.div
                                    key={role.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ ...SPRING_PREMIUM, delay: i * 0.1 }}
                                    className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 rounded-[2.5rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-soft)] hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer"
                                    onClick={() => window.location.href = 'mailto:careers@fixpix.ai'}
                                >
                                    <div className="md:col-span-4">
                                        <h3 className="text-[18px] font-black text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">{role.title}</h3>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[var(--text-tertiary)]">
                                            <span>{role.dept}</span>
                                            <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                                            <span>{role.type}</span>
                                        </div>
                                    </div>
                                    <div className="md:col-span-6">
                                        <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed">{role.desc}</p>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--fill-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-inner">
                                            <ArrowRight size={20} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <p className="text-[14px] font-bold text-[var(--text-secondary)] mb-8">Don't see your neural match? We’re always open to wildcards.</p>
                            <motion.a
                                href="mailto:careers@fixpix.ai"
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                            >
                                Send Open Inquiry <ArrowRight size={16} strokeWidth={3} />
                            </motion.a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CareersPage;
