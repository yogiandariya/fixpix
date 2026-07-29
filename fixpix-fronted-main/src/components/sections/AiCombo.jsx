import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Newspaper, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiCombo = () => {
    return (
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-100/30 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] translate-y-1/4 translate-x-1/4 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 16 }}
                    >
                        More Than Just Photo AI
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        style={{ color: 'var(--text-secondary)', fontSize: 'clamp(16px, 1.8vw, 18px)', maxWidth: 640, margin: '0 auto', fontWeight: 400, lineHeight: 1.6 }}
                    >
                        FixPix now understands images AND information. A unified platform for visual and factual intelligence.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Pillar 1: Photo AI */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative h-[420px] rounded-[32px] overflow-hidden transition-all duration-500"
                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-soft)' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] to-[#5856D6]" style={{ opacity: 0.03 }} />
                        <div className="relative h-full p-10 flex flex-col">
                            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: 32, boxShadow: '0 8px 16px rgba(0,122,255,0.2)' }}>
                                <Sparkles size={28} />
                            </div>
                            <h3 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-0.01em' }}>Photo AI Engine</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, marginBottom: 32, fontWeight: 400 }}>
                                Restore, colorize, and upscale your memories with our world-class neural engines. 100% private and instant.
                            </p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                <span style={{ px: 12, paddingBottom: 6, paddingTop: 6, paddingLeft: 12, paddingRight: 12, borderRadius: 999, backgroundColor: 'var(--fill-tertiary)', color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', border: '1px solid var(--border-subtle)', textTransform: 'uppercase' }}>Restoration</span>
                                <span style={{ px: 12, paddingBottom: 6, paddingTop: 6, paddingLeft: 12, paddingRight: 12, borderRadius: 999, backgroundColor: 'var(--fill-tertiary)', color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', border: '1px solid var(--border-subtle)', textTransform: 'uppercase' }}>Upscaling</span>
                                <span style={{ px: 12, paddingBottom: 6, paddingTop: 6, paddingLeft: 12, paddingRight: 12, borderRadius: 999, backgroundColor: 'var(--fill-tertiary)', color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', border: '1px solid var(--border-subtle)', textTransform: 'uppercase' }}>Colorize</span>
                            </div>
                            <Link to="/app" className="absolute bottom-10 right-10 w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-xl" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Pillar 2: News AI */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative h-[420px] rounded-[32px] overflow-hidden transition-all duration-500"
                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-soft)' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] to-[#34C759]" style={{ opacity: 0.03 }} />
                        <div className="relative h-full p-10 flex flex-col">
                            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', marginBottom: 32, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                                <Newspaper size={28} />
                            </div>
                            <h3 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-0.01em' }}>News Intelligence</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, marginBottom: 32, fontWeight: 400 }}>
                                Trust what you read. Our AI scans thousands of global sources to verify claims and expose misinformation.
                            </p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                <span style={{ px: 12, paddingBottom: 6, paddingTop: 6, paddingLeft: 12, paddingRight: 12, borderRadius: 999, backgroundColor: 'rgba(0,113,227,0.12)', color: '#007AFF', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', border: '1px solid rgba(0,113,227,0.2)', textTransform: 'uppercase' }}>Fact Check</span>
                                <span style={{ px: 12, paddingBottom: 6, paddingTop: 6, paddingLeft: 12, paddingRight: 12, borderRadius: 999, backgroundColor: 'rgba(0,113,227,0.12)', color: '#007AFF', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', border: '1px solid rgba(0,113,227,0.2)', textTransform: 'uppercase' }}>Bias Scan</span>
                                <span style={{ px: 12, paddingBottom: 6, paddingTop: 6, paddingLeft: 12, paddingRight: 12, borderRadius: 999, backgroundColor: 'rgba(0,113,227,0.12)', color: '#007AFF', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', border: '1px solid rgba(0,113,227,0.2)', textTransform: 'uppercase' }}>Live Feed</span>
                            </div>
                            <Link to="/ai-news" className="absolute bottom-10 right-10 w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-xl" style={{ backgroundColor: '#007AFF', color: 'white' }}>
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AiCombo;
