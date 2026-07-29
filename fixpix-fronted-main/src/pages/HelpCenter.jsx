import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    HelpCircle,
    ChevronDown,
    LifeBuoy,
    Mail,
    MessageCircle,
    FileText,
    Clock3,
    Send,
    CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        topic: 'general',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const supportChannels = [
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Fastest way to get help for active sessions and editor issues.',
            action: 'Start Chat',
            href: '/contact',
            eta: '< 5 min',
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Share detailed context and attachments for account or billing issues.',
            action: 'Send Email',
            href: '/contact',
            eta: '4-12 hrs',
        },
        {
            icon: FileText,
            title: 'Documentation',
            description: 'Step-by-step guides for restoration workflow, export, and plans.',
            action: 'Open Docs',
            href: '/docs',
            eta: 'Instant',
        },
    ];

    const faqs = [
        {
            q: 'How do I restore blurry or damaged images in the best quality?',
            a: 'Upload the highest-resolution source available, then run restoration first and upscaling second. For portraits, enable face enhancement before final export.',
            cat: 'Editing',
        },
        {
            q: 'Where can I manage billing, invoice, or cancel my plan?',
            a: 'Go to your profile and open Billing. You can upgrade, switch plans, or cancel from there. Cancellation applies at the end of the current billing cycle.',
            cat: 'Billing',
        },
        {
            q: 'My export looks different from the editor preview. Why?',
            a: 'This usually happens due to format compression or browser scaling. Use PNG for lossless output and keep your export size equal to or higher than editor canvas size.',
            cat: 'Export',
        },
        {
            q: 'How quickly does support respond?',
            a: 'Live chat requests are usually answered in minutes. Email support is typically answered within the same day depending on queue and issue complexity.',
            cat: 'Support',
        },
        {
            q: 'Is my uploaded content private and secure?',
            a: 'Yes. Processing is session-bound and access-controlled. You control project visibility and can delete projects from your workspace whenever needed.',
            cat: 'Security',
        },
    ];

    const filteredFaqs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return faqs;
        return faqs.filter((faq) => (
            faq.q.toLowerCase().includes(query)
            || faq.a.toLowerCase().includes(query)
            || faq.cat.toLowerCase().includes(query)
        ));
    }, [faqs, searchQuery]);

    const handleFormChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        setForm({
            name: '',
            email: '',
            topic: 'general',
            message: '',
        });
        window.setTimeout(() => setSubmitted(false), 3500);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] selection:bg-[var(--accent-transparent)] selection:text-[var(--accent)]">
            <Navbar />

            <div className="relative pt-40 pb-32 overflow-hidden border-b border-[var(--border-subtle)]">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-[var(--accent-soft)] blur-[140px] rounded-full opacity-10" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[120%] bg-[#34C759]/10 blur-[140px] rounded-full opacity-10" />
                </div>

                <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_PREMIUM}
                    >
                        <div className="flex justify-center mb-8">
                            <div className="p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent)] shadow-xl">
                                <HelpCircle size={32} strokeWidth={2.5} />
                            </div>
                        </div>

                        <h1 className="text-[42px] md:text-[62px] font-black text-[var(--text-primary)] tracking-tight leading-none mb-5" style={{ letterSpacing: '-0.03em' }}>
                            Help & Support Center
                        </h1>

                        <p className="text-[16px] md:text-[19px] text-[var(--text-secondary)] font-medium mb-10 max-w-[760px] mx-auto leading-relaxed">
                            Search answers, open support channels, or send a request to our team.
                            We are here to help you ship clean results faster.
                        </p>

                        <div className="relative max-w-[600px] mx-auto group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search help topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-16 pl-16 pr-8 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-soft)] focus:shadow-[0_0_40px_rgba(var(--accent-rgb),0.1)] outline-none text-[16px] font-medium transition-all"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <div className="px-3 py-1 rounded-lg bg-[var(--fill-tertiary)] text-[10px] font-black uppercase text-[var(--text-tertiary)] tracking-widest border border-[var(--border-subtle)]">FAQ</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-24 pb-40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {supportChannels.map((channel, i) => (
                        <motion.div
                            key={channel.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...SPRING_PREMIUM, delay: i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="p-8 rounded-[2.5rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] cursor-pointer group hover:border-[var(--accent-soft)] transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-110 bg-[var(--accent)]">
                                <channel.icon size={22} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[17px] font-black text-[var(--text-primary)] mb-2 tracking-tight">{channel.title}</h3>
                            <p className="text-[13px] font-medium text-[var(--text-tertiary)] leading-relaxed mb-5">{channel.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)]">ETA {channel.eta}</span>
                                <a href={channel.href} className="text-[12px] font-black uppercase tracking-[0.1em] text-[var(--accent)] hover:opacity-70 transition-opacity">
                                    {channel.action}
                                </a>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING_PREMIUM, delay: 0.4 }}
                        className="p-8 rounded-[2.5rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)]"
                    >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg bg-[#34C759]">
                            <Clock3 size={22} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-[17px] font-black text-[var(--text-primary)] mb-2 tracking-tight">Support Hours</h3>
                        <p className="text-[13px] font-medium text-[var(--text-tertiary)] leading-relaxed mb-5">
                            Mon-Sat: 9:00 AM - 9:00 PM IST. Urgent production issues are prioritized.
                        </p>
                        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#34C759]">Online Now</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
                    <div className="max-w-[800px] mx-auto w-full">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.32em] text-[var(--text-tertiary)]">Frequently Asked Questions</h2>
                            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                        </div>

                        <div className="space-y-4">
                            {filteredFaqs.map((faq, i) => (
                                <motion.div
                                    key={faq.q}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                                        expandedFaq === i
                                            ? 'bg-[var(--surface-elevated)] border-[var(--accent-soft)] shadow-xl'
                                            : 'bg-transparent border-[var(--border-subtle)] hover:border-[var(--text-tertiary)]'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                        className="w-full px-8 py-6 flex items-center justify-between text-left group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black transition-colors ${expandedFaq === i ? 'bg-[var(--accent)] text-white' : 'bg-[var(--fill-tertiary)] text-[var(--text-secondary)]'}`}>
                                                {i + 1}
                                            </div>
                                            <span className={`text-[15px] font-black transition-colors ${expandedFaq === i ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                                                {faq.q}
                                            </span>
                                        </div>
                                        <ChevronDown size={20} className={`text-[var(--text-tertiary)] transition-transform duration-500 ${expandedFaq === i ? 'rotate-180 text-[var(--accent)]' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {expandedFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-8 pb-8 pl-[64px] text-[15px] font-medium text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-6">
                                                    {faq.a}
                                                    <div className="mt-6 flex items-center gap-4">
                                                        <div className="px-3 py-1 rounded-lg bg-[var(--fill-tertiary)] text-[10px] font-black uppercase text-[var(--accent)] tracking-widest">{faq.cat}</div>
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-tertiary)] opacity-50 uppercase tracking-widest cursor-default">
                                                            <LifeBuoy size={12} /> Support Ready
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {filteredFaqs.length === 0 && (
                            <div className="py-20 text-center">
                                <HelpCircle size={40} className="mx-auto text-[var(--text-tertiary)] mb-4 opacity-20" />
                                <p className="text-[14px] font-bold text-[var(--text-secondary)]">No matching entries found.</p>
                            </div>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING_PREMIUM, delay: 0.2 }}
                        className="rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8 shadow-[var(--depth-1)] h-fit"
                    >
                        <h3 className="text-[28px] font-black text-[var(--text-primary)] leading-none mb-3" style={{ letterSpacing: '-0.02em' }}>
                            Contact Support
                        </h3>
                        <p className="text-[14px] text-[var(--text-secondary)] font-medium mb-7">
                            Share your issue and we will respond as soon as possible.
                        </p>

                        <AnimatePresence>
                            {submitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="mb-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-600 flex items-center gap-2 text-[13px] font-semibold"
                                >
                                    <CheckCircle2 size={16} /> Request submitted. Our team will contact you soon.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                                value={form.name}
                                onChange={(e) => handleFormChange('name', e.target.value)}
                                required
                                placeholder="Full name"
                                className="w-full h-12 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)] text-[14px] outline-none focus:border-[var(--accent)]"
                            />
                            <input
                                value={form.email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                                required
                                type="email"
                                placeholder="Work email"
                                className="w-full h-12 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)] text-[14px] outline-none focus:border-[var(--accent)]"
                            />
                            <select
                                value={form.topic}
                                onChange={(e) => handleFormChange('topic', e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)] text-[14px] outline-none focus:border-[var(--accent)]"
                            >
                                <option value="general">General question</option>
                                <option value="billing">Billing and subscription</option>
                                <option value="editor">Editor issue</option>
                                <option value="account">Account and security</option>
                            </select>
                            <textarea
                                value={form.message}
                                onChange={(e) => handleFormChange('message', e.target.value)}
                                required
                                rows={5}
                                placeholder="Describe your issue..."
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)] text-[14px] outline-none resize-y focus:border-[var(--accent)]"
                            />
                            <button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-[var(--accent)] text-white text-[12px] font-black uppercase tracking-[0.14em] shadow-lg shadow-[var(--accent-soft)] flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                            >
                                <Send size={14} /> Submit Request
                            </button>
                        </form>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 p-12 md:p-16 rounded-[4rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-2)] text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-transparent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <h2 className="text-[32px] font-black text-[var(--text-primary)] tracking-tighter mb-4">Need priority assistance?</h2>
                    <p className="text-[16px] font-medium text-[var(--text-secondary)] mb-10 max-w-sm mx-auto">Reach our team for account-critical or production issues.</p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-white rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-[var(--accent-soft)] hover:scale-105 active:scale-95 transition-all"
                    >
                        Talk to Support
                    </a>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default HelpCenter;
