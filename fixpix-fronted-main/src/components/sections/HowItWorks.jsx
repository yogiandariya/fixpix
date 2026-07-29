import React, { useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Sparkles, Download, ArrowRight, Check, Shield, Zap, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { cn } from '../../lib/utils';

/* ═══════════════════════════════════════════════════════
   Step Data — enriched with benefits for the new card style
 ═══════════════════════════════════════════════════════ */
const steps = [
    {
        icon: UploadCloud,
        step: '01',
        title: 'Upload Photo',
        description: 'Simply drag and drop or browse to select any image from your device. We support all major formats.',
        benefits: [
            'Supports JPEG, PNG, WebP & TIFF formats',
            'Drag & drop or click to browse',
            'Up to 50MB file size supported',
        ],
    },
    {
        icon: Sparkles,
        step: '02',
        title: 'AI Enhancement',
        description: 'Our advanced neural engine restores details, removes damage, and enhances quality in seconds.',
        benefits: [
            'Face restoration & detail recovery',
            'Scratch & damage removal',
            'Color correction & upscaling',
        ],
    },
    {
        icon: Download,
        step: '03',
        title: 'Download 4K',
        description: 'Get your beautifully restored, high-resolution result instantly — ready to print or share.',
        benefits: [
            'Up to 4K resolution output',
            'Lossless quality preservation',
            'One-click download & sharing',
        ],
    },
];

/* ═══════════════════════════════════════════════════════
   Animation Variants
 ═══════════════════════════════════════════════════════ */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 1, 0.5, 1],
        },
    },
};

/* ═══════════════════════════════════════════════════════
   Step Card — New premium glassmorphism style
 ═══════════════════════════════════════════════════════ */
const StepCard = ({ item, index }) => (
    <motion.div
        variants={cardVariants}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative flex flex-col flex-1 min-w-0"
    >
        <div
            className={cn(
                "relative h-full flex flex-col",
                "rounded-[20px] p-6 md:p-7",
                "bg-[var(--surface)] backdrop-blur-xl",
                "border border-[var(--border-subtle)]",
                "shadow-[var(--depth-1)]",
                "transition-all duration-300 ease-out",
                "hover:shadow-[var(--depth-2)]",
                "dark:hover:border-[var(--border-medium)]",
                "overflow-hidden cursor-default"
            )}
        >
            {/* Step Number + Icon Row */}
            <div className="mb-5 flex items-center gap-3">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold"
                    style={{
                        backgroundColor: 'var(--accent)',
                        boxShadow: '0 4px 14px var(--accent-soft)',
                    }}
                >
                    {index + 1}
                </div>
                <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--accent)',
                    }}
                >
                    <item.icon size={22} strokeWidth={1.75} />
                </div>
            </div>

            {/* Title */}
            <h3
                className="mb-2 text-lg md:text-xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
            >
                {item.title}
            </h3>

            {/* Description */}
            <p
                className="mb-5 text-sm leading-relaxed font-medium"
                style={{ color: 'var(--text-secondary)' }}
            >
                {item.description}
            </p>

            {/* Benefits List */}
            <ul className="space-y-2.5 mt-auto">
                {item.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                        <div
                            className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
                        >
                            <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: 'var(--success)' }}
                            />
                        </div>
                        <span
                            className="text-xs leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {benefit}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Large ghost step number — background watermark */}
            <div
                style={{
                    position: 'absolute',
                    top: -12,
                    right: -4,
                    fontSize: '140px',
                    fontWeight: 800,
                    lineHeight: 1,
                    color: 'var(--text-quaternary)',
                    opacity: 0.06,
                    letterSpacing: '-6px',
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
            >
                {item.step}
            </div>
        </div>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════
   Main Component
 ═══════════════════════════════════════════════════════ */
const HowItWorks = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleCTA = () => {
        if (user) {
            navigate('/app/restoration');
        } else {
            navigate('/login');
        }
    };

    return (
        <section
            id="how-it-works"
            style={{
                paddingTop: '72px',
                paddingBottom: '72px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-primary)'
            }}
        >

            <div className="max-w-[1200px] mx-auto px-4 md:px-6">
                {/* ── Section Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}>
                    <div>
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                color: 'var(--text-tertiary)',
                                marginBottom: '16px',
                                padding: '4px 12px',
                                borderRadius: '99px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'transparent',
                            }}
                        >
                            HOW IT WORKS
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[var(--text-primary)] leading-tight mb-4">
                        Three steps to a perfect photo
                    </h2>

                    <p className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] font-medium tracking-tight max-w-[480px] mx-auto leading-relaxed">
                        No technical skills needed. Upload your photo and let our AI handle the rest.
                    </p>
                </div>

                {/* ── Step Cards Grid ── */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
                >
                    {steps.map((item, index) => (
                        <StepCard key={index} item={item} index={index} />
                    ))}
                </motion.div>

                {/* ── Bottom CTA Block ── */}
                <div
                    style={{ textAlign: 'center', marginTop: 'clamp(48px, 7vw, 80px)' }}
                >
                    <p
                        style={{
                            fontSize: 'clamp(15px, 1.8vw, 16px)',
                            color: 'var(--text-secondary)',
                            marginBottom: '24px',
                            fontWeight: 500,
                        }}
                    >
                        Join 10,000+ users restoring history with FixPix AI.
                    </p>
                    <motion.button
                        onClick={handleCTA}
                        whileHover={{ y: -1, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 w-full sm:w-auto justify-center px-6 md:px-10 py-3.5 md:py-4 rounded-full bg-[var(--accent)] text-white font-bold text-[15px] tracking-tight border-none cursor-pointer transition-all duration-300 shadow-lg shadow-[var(--accent-soft)] hover:bg-[var(--accent-hover)]"
                    >
                        <UploadCloud size={18} strokeWidth={2} />
                        Upload Image
                    </motion.button>

                    {/* Trust micro badges */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'clamp(12px, 3vw, 28px)',
                            marginTop: '16px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { icon: '✔', label: '100% Private' },
                            { icon: '⚡', label: 'Under 10s' },
                            { icon: '📷', label: 'Up to 4K Output' },
                        ].map(({ icon, label }) => (
                            <span
                                key={label}
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}
                            >
                                {icon} {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(HowItWorks);
