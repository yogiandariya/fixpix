import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Code, Layers, Zap, Cpu, Terminal, ArrowRight, CheckCircle2, Info, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── Spring Configs ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };

const Sections = {
    overview: {
        title: 'Neural Overview',
        icon: Info,
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-[32px] font-black text-[var(--text-primary)] mb-6 tracking-tight leading-none">The FixPix Engine.</h2>
                    <p className="text-[18px] text-[var(--text-secondary)] leading-relaxed font-medium mb-8">
                        FixPix AI leverages state-of-the-art Generative Adversarial Networks (GANs) and Vision Transformers to reconstruct historical media. Unlike standard upscaling, our engine understands context—distinguishing between intentional film grain and destructive mold artifacts.
                    </p>
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-tr from-[var(--accent-soft)]/20 to-transparent border border-[var(--accent-soft)]">
                         <div className="flex items-center gap-3 mb-4">
                             <Zap size={20} className="text-[var(--accent)]" />
                             <span className="text-[14px] font-black text-[var(--text-primary)] uppercase tracking-tight">Core Competency</span>
                         </div>
                         <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                             Our models are trained on over 500,000 pairs of high-resolution digital scans and their analog "damaged" counterparts, including water damage, sun-bleaching, and physical tears.
                         </p>
                    </div>
                </section>
                
                <section>
                    <h2 className="text-[24px] font-black text-[var(--text-primary)] mb-6 tracking-tight">Technical Pipeline</h2>
                    <div className="space-y-4">
                        {[
                            { step: 'Denoising', desc: 'Phase 1: Removing sensor noise and analog grit without losing texture.' },
                            { step: 'De-blurring', desc: 'Phase 2: Calculating lens trajectory and restoring focal clarity.' },
                            { step: 'Semantic Repair', desc: 'Phase 3: Deep-inpainting based on surrounding architectural and biological data.' },
                            { step: 'Neural Grading', desc: 'Phase 4: Final color correction and luminance balancing.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 p-6 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:translate-x-2 transition-transform">
                                <div className="w-10 h-10 rounded-xl bg-[var(--fill-tertiary)] flex items-center justify-center text-[var(--accent)] text-[12px] font-black">{i+1}</div>
                                <div>
                                    <h4 className="font-black text-[var(--text-primary)] mb-1">{item.step}</h4>
                                    <p className="text-[13px] font-medium text-[var(--text-tertiary)]">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )
    },
    workflow: {
        title: 'Batch Workflow',
        icon: Layers,
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-[32px] font-black text-[var(--text-primary)] mb-6 tracking-tight">Processing at Scale.</h2>
                    <p className="text-[18px] text-[var(--text-secondary)] leading-relaxed font-medium mb-8">
                        For studios and professional archivists, FixPix Batch mode allows for concurrent restoration of entire libraries.
                    </p>
                    <div className="relative p-6 rounded-3xl bg-[#000] border border-white/10 font-mono text-[13px] text-green-400 overflow-hidden shadow-2xl">
                         <div className="flex gap-2 mb-4 opacity-50">
                             <div className="w-2 h-2 rounded-full bg-red-500" />
                             <div className="w-2 h-2 rounded-full bg-yellow-500" />
                             <div className="w-2 h-2 rounded-full bg-green-500" />
                         </div>
                         <code>
                             $ fixpix-cli batch --source ./archive/1922_vintage<br />
                             [SYSTEM] Initializing Neural Grid...<br />
                             [SYSTEM] Deploying 8 concurrent workers...<br />
                             [Worker 1] Restoring: image_001.png (Success: 124ms)<br />
                             [Worker 2] Restoring: image_002.png (Success: 131ms)<br />
                             ...<br />
                             [BATCH] Complete. 442 artifacts restored.
                         </code>
                    </div>
                </section>

                <section>
                    <h2 className="text-[24px] font-black text-[var(--text-primary)] mb-6 tracking-tight">Best Practices</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Upload 300DPI+ scans for optimal results.',
                            'Avoid pre-filtering images before upload.',
                            'Use PNG for preserving restoration transparency.',
                            'Leverage Batch mode for consistent color grading.'
                        ].map(item => (
                            <li key={item} className="flex gap-3 items-start p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                                <CheckCircle2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                                <span className="text-[14px] font-bold text-[var(--text-secondary)]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        )
    },
    api: {
        title: 'Developer API',
        icon: Code,
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-[32px] font-black text-[var(--text-primary)] mb-6 tracking-tight">Programmatic Repair.</h2>
                    <p className="text-[18px] text-[var(--text-secondary)] leading-relaxed font-medium mb-10">
                        Integrate FixPix restoration directly into your DAM (Digital Asset Management) or E-commerce platform.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Terminal size={18} className="text-[var(--accent)]" />
                            <span className="text-[12px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">REST Endpoint</span>
                        </div>
                        <div className="p-5 rounded-2xl bg-[var(--fill-tertiary)] border border-[var(--border-subtle)] flex items-center justify-between">
                            <code className="text-[14px] font-mono text-[var(--text-primary)] font-black">POST https://api.fixpix.ai/v1/restore</code>
                            <div className="px-3 py-1 bg-[var(--accent-soft)] rounded text-[10px] font-black text-[var(--accent)]">JSON</div>
                        </div>
                        
                        <div className="p-8 rounded-[2.5rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-inner">
                            <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed">
                                Requires a <span className="text-[var(--accent)] font-bold">FixPix Enterprise Key</span>. Standard tier requests are limited to 2 concurrent streams. Enterprise accounts feature unlimited horizontal scaling across our global neural points of presence.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="p-10 rounded-[3rem] bg-amber-500/5 border border-amber-500/20 flex gap-6 items-start">
                     <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                     <div>
                         <h4 className="text-[16px] font-black text-amber-500 mb-2">Rate Limiting</h4>
                         <p className="text-[14px] font-medium text-amber-600 leading-relaxed">Ensure you implement exponential backoff on 429 errors. High-fidelity neural reconstruction is computationally expensive; please respect our node capacities.</p>
                     </div>
                </div>
            </div>
        )
    }
}

const DocsPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const data = Sections[activeSection];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] selection:bg-[var(--accent-transparent)] selection:text-[var(--accent)]">
            <Navbar />

            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[var(--accent-soft)] blur-[120px] rounded-full opacity-10" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#AF52DE]/5 blur-[120px] rounded-full opacity-10" />
            </div>

            <main className="relative z-10 max-w-[1400px] mx-auto px-6 pt-40 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Navigation Sidebar */}
                    <aside className="lg:col-span-3">
                         <div className="lg:sticky lg:top-40">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shadow-lg shadow-[var(--accent-soft)]/20">
                                    <Book size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Neural Docs</h3>
                            </div>
                            
                            <nav className="space-y-2">
                                {Object.entries(Sections).map(([id, section]) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveSection(id)}
                                        className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-500 ${
                                            activeSection === id 
                                                ? 'bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[0_10px_30px_rgba(0,0,0,0.05)]' 
                                                : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tertiary)]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <section.icon size={18} className={activeSection === id ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'} />
                                            <span className={`text-[14px] font-black ${activeSection === id ? 'text-[var(--text-primary)]' : ''}`}>
                                                {section.title}
                                            </span>
                                        </div>
                                        <ChevronRight size={14} className={`transition-all duration-500 ${activeSection === id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--surface-elevated)] to-transparent border border-[var(--border-subtle)]">
                                 <FileText size={24} className="text-[var(--accent)] mb-4" />
                                 <h4 className="text-[13px] font-black text-[var(--text-primary)] mb-2 uppercase tracking-tight">SDK Downloads</h4>
                                 <p className="text-[11px] font-bold text-[var(--text-tertiary)] leading-relaxed mb-6">Access our official wrappers for Node.js, Python, and Swift.</p>
                                 <button className="text-[11px] font-black text-[var(--accent)] uppercase tracking-wider hover:underline flex items-center gap-2">Explore Git <ArrowRight size={12} /></button>
                            </div>
                         </div>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={SPRING_PREMIUM}
                            >
                                <div className="mb-12">
                                     <div className="inline-flex items-center gap-3 mb-6 px-4 py-1 rounded-full bg-[var(--fill-tertiary)] border border-[var(--border-subtle)]">
                                         <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                         <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Reference v2.4</span>
                                     </div>
                                     <h1 className="text-[48px] md:text-[64px] font-black text-[var(--text-primary)] tracking-tighter leading-none mb-4">
                                         {data.title}
                                     </h1>
                                </div>

                                <div className="p-8 md:p-16 rounded-[4rem] bg-[var(--surface)] border border-[var(--border-subtle)] shadow-[var(--depth-2)]">
                                    {data.content}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DocsPage;
