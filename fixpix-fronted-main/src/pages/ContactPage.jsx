import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Twitter, MessagesSquare, Send, CheckCircle2, Globe, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { apiEndpoints } from '../lib/api';
import { useToast } from '../components/ui/Toast';

/* ─── Spring Configs ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };

const ContactPage = () => {
    const toast = useToast();
    const [formState, setFormState] = useState('idle'); // idle, sending, success, error
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Technical Support',
        message: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormState('sending');
        
        try {
            const response = await fetch(apiEndpoints.contact, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormState('success');
                toast.success('Message Transmitted', { title: 'Success' });
            } else {
                throw new Error('Transmission fail');
            }
        } catch (err) {
            setFormState('error');
            toast.error('Neural Link Failure', { title: 'Transmission Error' });
            setTimeout(() => setFormState('idle'), 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const channels = [
        { 
            icon: Mail, 
            label: 'Neural Support', 
            contact: 'support@fixpix.ai', 
            desc: 'For technical inquiries & archival recovery.', 
            color: 'var(--accent)' 
        },
        { 
            icon: MessagesSquare, 
            label: 'FixPix Community', 
            contact: 'Join Discord', 
            desc: 'Connect with 10k+ AI restoration artists.', 
            color: '#5865F2' 
        },
        { 
            icon: Twitter, 
            label: 'Twitter / X', 
            contact: '@fixpix_ai', 
            desc: 'Daily neural insights & feature drops.', 
            color: '#000000' 
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden selection:bg-[var(--accent-transparent)] selection:text-[var(--accent)]">
            <Navbar />

            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-soft)] blur-[140px] rounded-full opacity-15" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#AF52DE]/10 blur-[140px] rounded-full opacity-15" />
            </div>

            <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-40 pb-40">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_PREMIUM}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-soft)] mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                            <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">Always Online</span>
                        </div>
                        <h1 className="text-[56px] md:text-[84px] font-black text-[var(--text-primary)] tracking-tight leading-[0.85] mb-8" style={{ letterSpacing: '-0.04em' }}>
                            STAY IN THE<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[#AF52DE] to-[#34C759]">NEURAL LOOP.</span>
                        </h1>
                        <p className="text-[18px] md:text-[21px] font-medium text-[var(--text-secondary)] leading-relaxed max-w-[580px] mx-auto mb-10">
                            Whether you're troubleshooting a pixel artifact or looking for Enterprise API access, our neural support leads are ready.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Contact Form Container */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...SPRING_PREMIUM, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="p-8 md:p-12 rounded-[3.5rem] bg-[var(--surface)] border border-[var(--border-subtle)] shadow-[var(--depth-2)] overflow-hidden relative">
                            {/* Form Header */}
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={20} className="text-[var(--accent)]" />
                                    <h2 className="text-[18px] font-black tracking-tight text-[var(--text-primary)]">Open a Thread</h2>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
                                    <Clock size={12} /> Avg Response: 12h
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {formState === 'success' ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-20 text-center"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] mx-auto mb-6">
                                            <CheckCircle2 size={40} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[28px] font-black text-[var(--text-primary)] mb-4 tracking-tighter">Transmission Successful</h3>
                                        <p className="text-[15px] font-medium text-[var(--text-secondary)] max-w-xs mx-auto mb-8">
                                            Your inquiry has been cached in our neural buffers. We'll be in touch shortly.
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setFormState('idle');
                                                setFormData({ name: '', email: '', category: 'Technical Support', message: '' });
                                            }}
                                            className="px-8 py-3 bg-[var(--fill-tertiary)] text-[var(--text-primary)] rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[var(--border-subtle)] transition-colors"
                                        >
                                            Send Another
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        key="form"
                                        id="contact-form"
                                        onSubmit={handleSubmit}
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)] ml-4">Full Name</label>
                                                <input 
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className={`w-full px-6 py-4 rounded-2xl bg-[var(--fill-tertiary)] border ${errors.name ? 'border-ios-red/50' : 'border-transparent'} focus:border-[var(--accent-soft)] focus:bg-[var(--bg-primary)] outline-none text-[15px] font-medium transition-all`} 
                                                    placeholder="Parth Bhanderi"
                                                />
                                                {errors.name && <p className="text-[10px] text-ios-red font-bold ml-4 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)] ml-4">Work Email</label>
                                                <input 
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className={`w-full px-6 py-4 rounded-2xl bg-[var(--fill-tertiary)] border ${errors.email ? 'border-ios-red/50' : 'border-transparent'} focus:border-[var(--accent-soft)] focus:bg-[var(--bg-primary)] outline-none text-[15px] font-medium transition-all`} 
                                                    placeholder="name@email.com"
                                                />
                                                {errors.email && <p className="text-[10px] text-ios-red font-bold ml-4 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)] ml-4">Inquiry Category</label>
                                            <select 
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-[var(--fill-tertiary)] border border-transparent focus:border-[var(--accent-soft)] outline-none text-[15px] font-medium transition-all appearance-none cursor-pointer"
                                            >
                                                <option>Technical Support</option>
                                                <option>Enterprise API</option>
                                                <option>Billing & Subscriptions</option>
                                                <option>Feature Request</option>
                                                <option>Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)] ml-4">Your Message</label>
                                            <textarea 
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required rows="5"
                                                className={`w-full px-6 py-4 rounded-3xl bg-[var(--fill-tertiary)] border ${errors.message ? 'border-ios-red/50' : 'border-transparent'} focus:border-[var(--accent-soft)] focus:bg-[var(--bg-primary)] outline-none text-[15px] font-medium transition-all resize-none`} 
                                                placeholder="Tell us how we can help..."
                                            />
                                            {errors.message && <p className="text-[10px] text-ios-red font-bold ml-4 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.message}</p>}
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={formState === 'sending'}
                                            className="w-full py-5 bg-[var(--accent)] text-white rounded-3xl text-[13px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--accent-soft)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale-[0.5]"
                                        >
                                            {formState === 'sending' ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '200ms' }} />
                                                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '400ms' }} />
                                                    <span className="ml-2">Transmitting...</span>
                                                </div>
                                            ) : (
                                                <>Transmit Message <Send size={18} strokeWidth={2.5} /></>
                                            )}
                                        </button>
                                        
                                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                                <ShieldCheck size={14} className="text-[var(--accent)]" /> Neural Privacy Active
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                                <Globe size={14} className="text-[var(--accent)]" /> Global Routing
                                            </div>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Channel Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        {channels.map((channel, i) => (
                            <motion.div
                                key={channel.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...SPRING_PREMIUM, delay: 0.4 + (i * 0.1) }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="group p-6 rounded-[2.5rem] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] flex gap-6 items-start transition-all"
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${channel.color}, ${channel.color}dd)` }}>
                                    <channel.icon size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-black text-[var(--text-primary)] mb-1 tracking-tight">{channel.label}</h3>
                                    <p className="text-[13px] font-medium text-[var(--text-tertiary)] mb-4">{channel.desc}</p>
                                    <span className="text-[14px] font-black text-[var(--accent)] pointer-events-none">{channel.contact}</span>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)] to-[#AF52DE] text-white overflow-hidden relative group">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                 <Globe size={120} strokeWidth={1} />
                             </div>
                             <h3 className="text-[20px] font-black mb-2 relative z-10">Neural Hub Live</h3>
                             <p className="text-[14px] font-medium opacity-80 mb-6 relative z-10">Real-time system status and restoration performance metrics across all nodes.</p>
                             <button className="px-6 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/30 transition-all relative z-10">
                                 Check Status
                             </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
