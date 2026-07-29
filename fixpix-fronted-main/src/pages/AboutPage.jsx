import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Github, Linkedin, Mail, Globe, Instagram, ArrowRight, 
    Sparkles, Code2, Palette, Brain, Layers, Zap, Heart, 
    ExternalLink, Command, Terminal, Cpu
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import profileImg from '../assets/profile.jpg';

/* ─── Spring Configs ─── */
const SPRING_PREMIUM = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 450, damping: 32 };

/* ─── Data ─── */
const developerInfo = {
    name: 'Parth Bhanderi',
    title: 'Lead UI/UX Engineer & AI Architect',
    bio: 'Pioneering the intersection of design engineering and neural intelligence. Creator of FixPix 2.0 — making state-of-the-art vision models accessible through a premium, human-centric interface.',
    socials: [
        { icon: Github, link: 'https://github.com/theparthbhanderi', label: 'GitHub', color: '#FFF' },
        { icon: Linkedin, link: 'https://www.linkedin.com/in/parth-bhanderi-366433330', label: 'LinkedIn', color: '#0A66C2' },
        { icon: Instagram, link: 'https://www.instagram.com/parthbhanderi/', label: 'Instagram', color: '#E4405F' },
        { icon: Mail, link: 'mailto:theparthbhanderi@gmail.com', label: 'Email', color: 'var(--accent)' },
        { icon: Globe, link: 'https://parthbhanderi.in', label: 'Portfolio', color: '#34C759' },
    ],
    skills: [
        { label: 'React.js', icon: Code2, accent: 'var(--accent)' },
        { label: 'Neural Vision', icon: Brain, accent: '#AF52DE' },
        { label: 'Architecture', icon: Layers, accent: '#FF9500' },
        { label: 'UX Engineering', icon: Palette, accent: '#FF2D55' },
        { label: 'Full Stack', icon: Terminal, accent: '#34C759' },
        { label: 'Deep Learning', icon: Cpu, accent: '#5AC8FA' },
    ],
    story: [
        {
            title: 'The Neural Genesis',
            text: 'Witnessing family memories fade into analog static was the catalyst. I envisioned a world where AI could bridge the gap between "lost history" and "vivid digital reality."',
            accent: '#AF52DE',
            icon: <Sparkles size={18} />
        },
        {
            title: 'Architecting FixPix 2.0',
            text: 'I rebuilt the entire restorative pipeline from the ground up, merging high-fidelity vision models with a design system that feels as premium as the results it produces.',
            accent: 'var(--accent)',
            icon: <Layers size={18} />
        },
        {
            title: 'The Design-Engine Philosophy',
            text: 'I believe the most powerful technology should feel invisible. My mission is to hide infinite complexity behind an interface that feels like magic.',
            accent: '#34C759',
            icon: <Zap size={18} />
        },
    ],
};

/* ─── Components ─── */

const SkillChip = ({ skill, index }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, scale: 0.9, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0 }
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        transition={SPRING_PREMIUM}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] cursor-default"
    >
        <skill.icon size={14} style={{ color: skill.accent }} />
        <span className="text-[13px] font-black tracking-tight text-[var(--text-primary)]">{skill.label}</span>
    </motion.div>
);

const StoryCard = ({ item, index }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
        }}
        transition={{ ...SPRING_PREMIUM, delay: index * 0.1 }}
        whileHover={{ scale: 1.02, x: 5 }}
        className="group relative flex gap-6 p-7 rounded-[var(--radius-2xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-1)] overflow-hidden"
    >
        <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
            style={{ backgroundColor: item.accent }}
        />
        
        <div className="relative w-12 h-12 shrink-0 rounded-[var(--radius-lg)] flex items-center justify-center text-white shadow-lg"
             style={{ background: `linear-gradient(135deg, ${item.accent}, ${item.accent}dd)` }}>
            {item.icon}
        </div>

        <div className="relative flex-1">
            <h3 className="text-[18px] font-black text-[var(--text-primary)] tracking-tighter mb-2" style={{ letterSpacing: 'var(--tracking-tighter)' }}>
                {item.title}
            </h3>
            <p className="text-[15px] font-medium text-[var(--text-secondary)] leading-relaxed">
                {item.text}
            </p>
        </div>
    </motion.div>
);

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden selection:bg-[var(--accent-transparent)] selection:text-[var(--accent)]">
            <Navbar />

            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-soft)] blur-[120px] rounded-full opacity-20" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#AF52DE]/10 blur-[120px] rounded-full opacity-20" />
            </div>

            <main className="relative z-10 max-w-[1000px] mx-auto px-6 pt-32 pb-40">
                {/* ═════ HERO SECTION ═════ */}
                <section className="mb-24">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ ...SPRING_PREMIUM, duration: 0.8 }}
                            className="relative mb-10"
                        >
                            <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full p-2 bg-gradient-to-tr from-[var(--accent)] via-[#AF52DE] to-[#34C759] shadow-2xl relative z-10">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--bg-primary)]">
                                    <img src={profileImg} alt={developerInfo.name} loading="lazy" decoding="async" className="w-full h-auto min-h-full object-cover" />
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-[var(--accent)] blur-[40px] opacity-20 animate-pulse" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, ...SPRING_PREMIUM }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-transparent)] border border-[var(--accent-soft)] mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                                <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">Open for Collaboration</span>
                            </div>

                            <h1 className="text-[56px] md:text-[84px] font-black text-[var(--text-primary)] tracking-tight leading-[0.85] mb-8" style={{ letterSpacing: '-0.04em' }}>
                                CREATING THE<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[#AF52DE] to-[#34C759]">FUTURE VISION.</span>
                            </h1>

                            <p className="text-[18px] md:text-[21px] font-medium text-[var(--text-secondary)] leading-relaxed max-w-[620px] mx-auto mb-10" style={{ letterSpacing: 'var(--tracking-tight)' }}>
                                {developerInfo.bio}
                            </p>

                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                {developerInfo.socials.map((social, i) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent-soft)] shadow-sm transition-all"
                                        style={{ width: 52, height: 52 }}
                                    >
                                        <social.icon size={20} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═════ CORE PHILOSOPHY ═════ */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-32"
                >
                    <div className="md:col-span-5">
                        <div className="px-4 py-1 rounded-full bg-[var(--accent-soft)] text-[11px] font-black text-[var(--accent)] uppercase tracking-widest w-fit mb-6">Vision</div>
                        <h2 className="text-[42px] font-black text-[var(--text-primary)] tracking-tighter leading-none mb-6">Built at the edge of Pixel & Logic.</h2>
                        <p className="text-[16px] font-medium text-[var(--text-secondary)] leading-relaxed mb-8">
                            I don't just build apps; I architect neural ecosystems. Every interaction in FixPix is purposefully designed to bridge the gap between heavy technical computation and a smooth, effortless user journey.
                        </p>
                        <div className="flex flex-wrap gap-2">
                             {developerInfo.skills.map((skill, i) => (
                                 <SkillChip key={skill.label} skill={skill} index={i} />
                             ))}
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <div className="relative p-1 rounded-[var(--radius-3xl)] bg-gradient-to-tr from-[var(--border-subtle)] to-transparent">
                            <div className="rounded-[var(--radius-2xl)] overflow-hidden bg-[var(--surface-elevated)] p-8 md:p-12 border border-[var(--border-subtle)] shadow-[var(--depth-2)]">
                                <div className="space-y-4">
                                     <div className="flex items-center gap-3 mb-6">
                                         <div className="w-3 h-3 rounded-full bg-red-500" />
                                         <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                         <div className="w-3 h-3 rounded-full bg-green-500" />
                                         <div className="ml-4 text-[11px] font-mono text-[var(--text-tertiary)] opacity-30 uppercase tracking-[0.2em]">Neural_Console.v2</div>
                                     </div>
                                     <p className="font-mono text-[14px] leading-relaxed text-[var(--text-secondary)]">
                                         <span className="text-[var(--accent)]">parth@fixpix</span><span className="text-[var(--text-tertiary)] opacity-50">:</span><span className="text-[#AF52DE]">~</span><span className="text-[var(--text-tertiary)] opacity-50">$</span> run mission --target "future"<br />
                                         <br />
                                         <span className="text-[var(--text-tertiary)] opacity-40">INITIALIZING NEURAL ENGINE...</span><br />
                                         <span className="text-[var(--text-tertiary)] opacity-40">CALIBRATING DESIGN TOKENS...</span><br />
                                         <span className="text-[#34C759]">MISSION STATUS: ACTIVE</span><br />
                                         <br />
                                         FixPix is more than a tool. It's my commitment to visual immortality. We take what was lost to time and render it timeless.
                                     </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ═════ THE STORY ═════ */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                        <h2 className="text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.5em] shrink-0">The Neural Journey</h2>
                        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                    </div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 gap-6"
                    >
                        {developerInfo.story.map((item, i) => (
                            <StoryCard key={item.title} item={item} index={i} />
                        ))}
                    </motion.div>
                </section>

                {/* ═════ FINAL CTA ═════ */}
                <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative p-12 md:p-20 rounded-[var(--radius-3xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--depth-3)] text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-transparent)] to-transparent pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] mx-auto mb-8 shadow-inner">
                            <Heart size={32} strokeWidth={2.5} />
                        </div>
                        
                        <h2 className="text-[42px] font-black text-[var(--text-primary)] tracking-tighter leading-none mb-6">Let's build the extraordinary.</h2>
                        <p className="text-[17px] font-medium text-[var(--text-secondary)] leading-relaxed max-w-[450px] mx-auto mb-10">
                            Whether it's a revolutionary AI integration or a pixel-perfect design system, I'm ready for the challenge.
                        </p>

                        <motion.a
                            href="mailto:theparthbhanderi@gmail.com"
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-white rounded-[var(--radius-xl)] font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-[var(--accent-soft)]"
                        >
                            Open Connection <ArrowRight size={16} strokeWidth={3} />
                        </motion.a>
                    </div>
                </motion.section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
