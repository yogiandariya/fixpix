import React, { useContext, useRef, memo, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';
import { Sparkles, Upload, ArrowRight, Shield, Zap, Image } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import BeforeAfterSlider from '../features/BeforeAfterSlider';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────
   Trust badge data
───────────────────────────────────────────────────── */
const TRUST_BADGES = [
    { icon: '✔', label: '100% Private' },
    { icon: '⚡', label: 'Under 10s' },
    { icon: '📷', label: 'Up to 4K' },
];

/* ─────────────────────────────────────────────────────
   Framer-Motion Variants
───────────────────────────────────────────────────── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.15, ease: "easeOut" },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.18, ease: "easeOut" },
    },
};

const sliderFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, delay: 0.1, ease: "easeOut" },
    },
};

/* ─────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────── */
const Hero = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    // Subtle parallax for the demo card
    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 400], [0, -28]);

    const handleUploadClick = useCallback(() => {
        if (!user) {
            navigate('/login', { state: { from: '/app/restoration' } });
            return;
        }
        navigate('/app/restoration');
    }, [user, navigate]);

    const handleDemoClick = useCallback(() => {
        const el = document.getElementById('features');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/app');
        }
    }, [navigate]);

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="relative w-full overflow-hidden"
            style={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: 'clamp(120px, 14vw, 160px)',
                paddingBottom: 'clamp(64px, 8vw, 96px)',
            }}
        >
            {/* ── Ambient gradient background (minimal 5%) ── */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 60% 50% at 20% 30%, rgba(0,113,227,0.03), transparent 65%),
                        radial-gradient(ellipse 50% 40% at 80% 70%, rgba(0,113,227,0.02), transparent 60%)
                    `,
                }}
            />

            {/* ── Subtle dot grid ── */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--border-subtle) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.3,
                }}
            />

            {/* ── Main container ── */}
            <div
                className="relative z-10 w-full mx-auto px-5 md:px-8"
                style={{ maxWidth: '1200px' }}
            >
                {/* ── 2-col grid: text LEFT | slider RIGHT ── */}
                <div
                    className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
                    style={{ alignItems: 'center' }}
                >
                    {/* ═══════════════════════════════
                        LEFT — Text Block
                    ═══════════════════════════════ */}
                        <motion.div
                        className="flex-1 text-center lg:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ maxWidth: 540 }}
                    >
                        {/* AI News Tag */}
                        <motion.div variants={fadeUp}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-subtle text-[11px] font-bold tracking-tight mb-4" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--accent)' }}>
                                <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}/>
                                ⚡ AI + NEWS INTELLIGENCE POWERED
                            </div>
                        </motion.div>

                        {/* Badge */}
                        <motion.div variants={fadeUp}>
                            <span
                                className="inline-flex items-center gap-2 mb-6"
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: 999,
                                    fontSize: '12px',
                                    fontWeight: 650,
                                    letterSpacing: '0.02em',
                                    color: 'var(--text-secondary)',
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--border-medium)',
                                }}
                            >
                                <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                                AI-Powered Photo Restoration
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeUp}
                            style={{
                                fontSize: 'clamp(42px, 5.5vw, 64px)',
                                fontWeight: 600,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
                                lineHeight: 1.08,
                                letterSpacing: '-0.02em',
                                color: 'var(--text-primary)',
                                marginBottom: 'clamp(14px, 2vw, 20px)',
                            }}
                        >
                            Restore. Enhance.
                            <br />
                            Relive Your Memories.
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeUp}
                            style={{
                                fontSize: 'clamp(16px, 1.8vw, 18px)',
                                lineHeight: 1.6,
                                color: 'var(--text-secondary)',
                                marginBottom: 'clamp(32px, 4vw, 48px)',
                                maxWidth: 460,
                                margin: '0 auto clamp(32px, 4vw, 48px)',
                                fontWeight: 400,
                            }}
                            className="lg:mx-0"
                        >
                            Restore your old or damaged photos with our advanced AI engine — instantly and beautifully.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={scaleIn}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
                            style={{ marginBottom: 'clamp(20px, 2.5vw, 28px)' }}
                        >
                            <motion.button
                                id="hero-upload-btn"
                                onClick={handleUploadClick}
                                whileHover={{ opacity: 0.9, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="ios-press-scale gpu-accelerated"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    padding: '14px 34px',
                                    borderRadius: '999px',
                                    background: 'var(--btn-primary)',
                                    color: 'white',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Get Started
                            </motion.button>

                            <motion.button
                                id="hero-demo-btn"
                                onClick={handleDemoClick}
                                whileHover={{ scale: 1.02, backgroundColor: 'var(--surface-secondary)' }}
                                whileTap={{ scale: 0.98 }}
                                className="ios-press gpu-accelerated"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    padding: '14px 34px',
                                    borderRadius: '999px',
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-primary)',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    border: '1px solid var(--border-medium)',
                                    cursor: 'pointer',
                                    transition: 'background-color 150ms ease, border-color 150ms ease',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Explore Demo
                                <ArrowRight size={16} strokeWidth={1.5} />
                            </motion.button>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={fadeUp}
                            className="flex items-center justify-center lg:justify-start gap-5 flex-wrap"
                        >
                            {TRUST_BADGES.map((badge, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2"
                                    style={{
                                        color: 'var(--text-tertiary)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                    }}
                                >
                                    <span style={{ fontSize: '14px' }}>{badge.icon}</span>
                                    <span>{badge.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ═══════════════════════════════
                        RIGHT — Before/After Demo Card
                    ═══════════════════════════════ */}
                    <motion.div
                        className="flex-1 w-full lg:w-auto"
                        variants={sliderFadeIn}
                        initial="hidden"
                        animate="visible"
                        style={{
                            maxWidth: 580,
                            width: '100%',
                            y: parallaxY,
                        }}
                    >
                        {/* Floating glow behind card (<10% opacity) */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                translate: '-50% -50%',
                                width: '80%',
                                height: '80%',
                                background: 'radial-gradient(ellipse, rgba(0,113,227,0.06), transparent 70%)',
                                filter: 'blur(50px)',
                                pointerEvents: 'none',
                                zIndex: 0,
                            }}
                        />

                        {/* Labels row */}
                        <div
                            className="flex items-center justify-between px-1 mb-3 relative z-10"
                        >
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    backgroundColor: 'var(--text-tertiary)',
                                    display: 'inline-block',
                                }} />
                                Original
                            </span>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                Enhanced
                                <span style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    backgroundColor: 'var(--accent)',
                                    display: 'inline-block',
                                }} />
                            </span>
                        </div>

                        {/* Demo Card */}
                        <div
                            id="demo-card"
                            style={{
                                position: 'relative',
                                zIndex: 10,
                                borderRadius: '16px',
                                padding: '8px',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                                overflow: 'hidden',
                                transition: 'box-shadow 400ms ease, transform 400ms ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 30px 70px rgba(0,0,0,0.18)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Inner clip */}
                            <div
                                className="aspect-[4/3] relative"
                                style={{
                                    borderRadius: 'calc(var(--radius-2xl) - 4px)',
                                    overflow: 'hidden',
                                }}
                            >
                                <BeforeAfterSlider
                                    before="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop&sat=-100"
                                    after="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
                                />
                            </div>
                        </div>

                        {/* Caption */}
                        <div
                            className="flex items-center justify-center gap-2 mt-3"
                            style={{
                                fontSize: '12px',
                                color: 'var(--text-tertiary)',
                                opacity: 0.75,
                            }}
                        >
                            <Sparkles size={11} style={{ color: 'var(--accent)' }} />
                            <span>Drag the slider to compare</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default memo(Hero);
