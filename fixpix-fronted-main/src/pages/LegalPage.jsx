import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, Lock, Eye, CheckCircle2, ChevronRight, Scale, ShieldAlert, Cpu, Database, Fingerprint } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── Spring Configs ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };

const sections = {
    privacy: {
        title: 'Privacy Policy',
        icon: Eye,
        lastUpdated: 'April 15, 2026',
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-[28px] font-black text-[var(--text-primary)] mb-6 tracking-tight">1. Neural Data Integrity</h2>
                    <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed mb-8">
                        At FixPix AI, we operate on a "Pixel-Volatile" architecture. This means that your media assets are processed in isolated memory buffers and are purged from our primary compute nodes immediately after the restoration session ends.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="p-6 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                            <h4 className="text-[14px] font-black text-[var(--text-primary)] mb-3 uppercase tracking-tight">What We Collect</h4>
                            <ul className="space-y-3">
                                {['Encrypted account metadata', 'Session-specific pixel buffers', 'Restoration parameter history', 'Hashed IP for security'].map(item => (
                                    <li key={item} className="flex gap-2 text-[13px] text-[var(--text-secondary)] font-medium">
                                        <CheckCircle2 size={14} className="text-[var(--accent)] shrink-0 mt-0.5" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                            <h4 className="text-[14px] font-black text-[var(--text-primary)] mb-3 uppercase tracking-tight">What We Never See</h4>
                            <ul className="space-y-3">
                                {['Original unencrypted files', 'Biometric facial identities', 'Unmasked payment credentials', 'Pixel-level training data'].map(item => (
                                    <li key={item} className="flex gap-2 text-[13px] text-[var(--text-secondary)] font-medium">
                                        <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-[24px] font-black text-[var(--text-primary)] mb-6 tracking-tight">2. The "Private-First" Pledge</h2>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed mb-6">
                        Unlike traditional AI platforms, FixPix does not use customer-uploaded imagery to train global vision models. Our "Differential Privacy" system ensures that the neural engine learns general restoration patterns (like removing grain) without ever "remembering" the specific content of your photos.
                    </p>
                    <div className="p-6 rounded-[2rem] bg-gradient-to-tr from-[var(--accent-soft)]/20 to-transparent border border-[var(--accent-soft)]/30">
                         <p className="text-[14px] italic text-[var(--text-secondary)]">"Your memories belong to you. Our technology is simply the lens that brings them back into focus."</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-[24px] font-black text-[var(--text-primary)] mb-6 tracking-tight">3. Regional Compliance (GDPR/CCPA)</h2>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed">
                        We respect global privacy standards. Users in the EEA and California have specific rights including the right to data portability, the right to erasure ("Right to be Forgotten"), and the right to object to automated individual decision-making. All requests are processed within 48 hours of neural verification.
                    </p>
                </section>
            </div>
        )
    },
    terms: {
        title: 'Terms of Service',
        icon: FileText,
        lastUpdated: 'April 15, 2026',
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-[28px] font-black text-[var(--text-primary)] mb-6 tracking-tight">1. Intellectual Property & Ownership</h2>
                    <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed mb-6">
                        This is the core of our agreement: **You retain 100% ownership of your original and restored media.** FixPix AI acts solely as a technical processor. We claim no copyrights, licensing rights, or commercial permissions over the artifacts produced within your workspace.
                    </p>
                    <div className="bg-[var(--fill-tertiary)] p-8 rounded-[2.5rem] border border-[var(--border-subtle)] border-l-4 border-l-[var(--accent)]">
                         <h4 className="text-[14px] font-black text-[var(--text-primary)] mb-2 uppercase tracking-tight">Permitted Use</h4>
                         <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-medium">You are free to use restored images for personal archiving, commercial printing, broadcasting, and social media without attribution to FixPix AI.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-[24px] font-black text-[var(--text-primary)] mb-6 tracking-tight">2. Neural Usage Limits</h2>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed mb-6">
                        To maintain node stability for all users, we implement fair-use caps on concurrent neural streams. "Automated scraping" or using the interface as a back-end for third-party services without an Enterprise License is strictly prohibited and will result in permanent neural-lock of your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-[24px] font-black text-[var(--text-primary)] mb-6 tracking-tight">3. Anti-Deepfake Policy</h2>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed">
                        FixPix AI is a restoration platform for historical and damaged media. Any use of the platform to generate non-consensual synthetic media ("Deepfakes") or to intentionally manipulate modern identity documents is a violation of our core ethics and will be reported to relevant authorities.
                    </p>
                </section>
            </div>
        )
    },
    cookies: {
        title: 'Cookie Policy',
        icon: Shield,
        lastUpdated: 'April 15, 2026',
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-[28px] font-black text-[var(--text-primary)] mb-6 tracking-tight">1. Why We Use Cookies</h2>
                    <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed mb-10">
                        We use standard browser tokens and local storage to maintain your neural session. These allow us to remember your restoration preferences and keep your workspace secure as you navigate between tools.
                    </p>
                    <div className="space-y-4">
                         {[
                             { type: 'Essential', desc: 'Required for session authentication and account security. Cannot be disabled.', life: 'Session' },
                             { type: 'Neural Analytics', desc: 'Anonymized metrics on tool performance and processing load.', life: '30 Days' },
                             { type: 'Preferences', desc: 'Saves your sidebar configuration and UI theme (Dark/Light).', life: '1 Year' }
                         ].map(item => (
                             <div key={item.type} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] gap-4">
                                 <div>
                                     <h4 className="text-[15px] font-black text-[var(--text-primary)]">{item.type}</h4>
                                     <p className="text-[13px] text-[var(--text-tertiary)] font-medium">{item.desc}</p>
                                 </div>
                                 <div className="px-4 py-1.5 rounded-full bg-[var(--fill-tertiary)] text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest border border-[var(--border-subtle)]">
                                     {item.life}
                                 </div>
                             </div>
                         ))}
                    </div>
                </section>
            </div>
        )
    },
    'data-processing': {
        title: 'Data Processing Hub',
        icon: Database,
        lastUpdated: 'April 15, 2026',
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-[28px] font-black text-[var(--text-primary)] mb-6 tracking-tight">1. Technical Infrastructure</h2>
                    <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed mb-8">
                        Data processing at FixPix AI occurs across a globally distributed GPU grid. All data in transit is encrypted via TLS 1.3, and data at rest (stored media in your workspace) is secured using AES-256 military-grade encryption.
                    </p>
                    <div className="p-8 rounded-[3rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex gap-8 items-start">
                         <Cpu size={32} className="text-[var(--accent)] shrink-0" />
                         <div>
                             <h4 className="text-[16px] font-black text-[var(--text-primary)] mb-2">Neural Sub-Processors</h4>
                             <p className="text-[14px] text-[var(--text-tertiary)] leading-relaxed font-medium">We partner with Amazon Web Services (AWS) and Lambda Labs for our core compute capacities. These partners are compliant with SOC 2 Type II and ISO 27001 standards.</p>
                         </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-[24px] font-black text-[var(--text-primary)] mb-6 tracking-tight">2. Zero-Knowledge Processing</h2>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed mb-6">
                        We are moving towards a Zero-Knowledge architecture. Our ultimate goal is for the FixPix team to have no technical means to view your unencrypted media at any point during the restoration lifecycle.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {[
                             { icon: Fingerprint, label: 'Pixel Hashing' },
                             { icon: Lock, label: 'Identity Isolation' },
                             { icon: Database, label: 'Compute Purge' }
                         ].map(item => (
                             <div key={item.label} className="p-5 rounded-2xl bg-[var(--fill-secondary)] border border-[var(--border-subtle)] flex flex-col items-center text-center gap-3">
                                 <item.icon size={20} className="text-[var(--accent)]" />
                                 <span className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)]">{item.label}</span>
                             </div>
                         ))}
                    </div>
                </section>
            </div>
        )
    }
};

const LegalPage = () => {
    const { section: currentSection = 'privacy' } = useParams();
    const activeData = sections[currentSection] || sections.privacy;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] selection:bg-[var(--accent-transparent)] selection:text-[var(--accent)]">
            <Navbar />

            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[var(--accent-soft)] blur-[120px] rounded-full opacity-10" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#AF52DE]/10 blur-[120px] rounded-full opacity-10" />
            </div>

            <main className="relative z-10 max-w-[1400px] mx-auto px-6 pt-40 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Sidebar Nav */}
                    <aside className="lg:col-span-3 space-y-2">
                        <div className="mb-10 lg:sticky lg:top-40">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                                    <Scale size={20} />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] opacity-60">Legal Center</h3>
                            </div>
                            
                            <nav className="flex flex-col gap-1">
                                {Object.entries(sections).map(([id, data]) => (
                                    <Link
                                        key={id}
                                        to={`/legal/${id}`}
                                        className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                                            currentSection === id 
                                                ? 'bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[0_10px_30px_rgba(0,0,0,0.05)]' 
                                                : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tertiary)]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <data.icon size={18} className={currentSection === id ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                                            <span className={`text-[14px] font-black ${currentSection === id ? 'text-[var(--text-primary)]' : ''}`}>
                                                {data.title}
                                            </span>
                                        </div>
                                        <ChevronRight size={14} className={`transition-transform duration-300 ${currentSection === id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-12 p-6 rounded-3xl bg-[var(--fill-secondary)] border border-dashed border-[var(--border-subtle)]">
                                <h4 className="text-[12px] font-black text-[var(--text-primary)] mb-2 uppercase tracking-tight">Need Clarity?</h4>
                                <p className="text-[11px] font-bold text-[var(--text-tertiary)] leading-relaxed mb-4">Our legal team is available for specific inquiries regarding data privacy.</p>
                                <Link to="/contact" className="text-[11px] font-black text-[var(--accent)] uppercase tracking-wider hover:underline">Support Hub →</Link>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={SPRING_PREMIUM}
                            >
                                <header className="mb-16">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-8 h-px bg-[var(--accent)]" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">FixPix Compliance</span>
                                    </div>
                                    <h1 className="text-[48px] md:text-[64px] font-black text-[var(--text-primary)] tracking-tighter leading-none mb-6">
                                        {activeData.title}
                                    </h1>
                                    <div className="flex items-center gap-3 text-[12px] font-bold text-[var(--text-tertiary)]">
                                        <span>Version 2.0</span>
                                        <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                                        <span>Last Revised: {activeData.lastUpdated}</span>
                                    </div>
                                </header>

                                <div className="p-8 md:p-16 rounded-[4rem] bg-[var(--surface)] border border-[var(--border-subtle)] shadow-[var(--depth-2)]">
                                    {activeData.content}
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

export default LegalPage;
