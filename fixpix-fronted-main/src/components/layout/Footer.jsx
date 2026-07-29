import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin, Mail, Heart, Sparkles } from 'lucide-react';

const SOCIAL_LINKS = [
    { icon: Github, href: 'https://github.com/theparthbhanderi', label: 'GitHub' },
    { icon: Instagram, href: 'https://www.instagram.com/parthbhanderi/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/parth-bhanderi-366433330', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:theparthbhanderi@gmail.com', label: 'Email' },
];

const FOOTER_SECTIONS = [
    {
        title: 'Platform',
        links: [
            { label: 'AI Workspace', to: '/app' },
            { label: 'Photo Restoration', to: '/app/restoration' },
            { label: 'Batch Processing', to: '/app/batch' },
            { label: 'Projects', to: '/app/projects' },
            { label: 'History', to: '/app/history' },
        ]
    },
    {
        title: 'Resources',
        links: [
            { label: 'AI News', to: '/ai-news' },
            { label: 'FixPix Blog', to: '/blog' },
            { label: 'AI Assistant', to: '/app/copilot-history' },
            { label: 'Documentation', to: '/docs' },
            { label: 'Help Center', to: '/help' },
        ]
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', to: '/about' },
            { label: 'Pricing', to: '/app/pricing' },
            { label: 'Careers', to: '/careers' },
            { label: 'Press Kit', to: '/press' },
            { label: 'Contact', to: '/contact' },
        ]
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', to: '/legal/privacy' },
            { label: 'Terms of Service', to: '/legal/terms' },
            { label: 'Cookie Policy', to: '/legal/cookies' },
            { label: 'Data Processing', to: '/legal/data-processing' },
        ]
    }
];

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const socialLinks = useMemo(() => SOCIAL_LINKS, []);
    const footerSections = useMemo(() => FOOTER_SECTIONS, []);

    return (
        <footer
            className="px-4 sm:px-6 md:px-12 lg:px-20 mt-20 md:mt-32 overflow-x-hidden"
            style={{
                paddingTop: 'clamp(80px, 8vw, 120px)',
                paddingBottom: 'clamp(32px, 4vw, 48px)',
                borderTop: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-primary)'
            }}
        >
            <div className="w-full max-w-[1600px] mx-auto">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-8 md:gap-10 lg:gap-8 mb-12 md:mb-20">
                    
                    {/* Brand Section */}
                    <div className="xl:col-span-4 min-w-0">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent)]/20"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                                FixPix <span className="text-[var(--accent)]">AI</span>
                            </span>
                        </div>
                        <p
                            className="text-sm md:text-base lg:text-lg"
                            style={{
                                lineHeight: 1.6,
                                color: 'var(--text-secondary)',
                                maxWidth: '320px',
                                marginBottom: '32px',
                                fontWeight: 500
                            }}
                        >
                            The professional standard for AI-powered photo restoration. Bring historical and damaged memories back to cinematic life.
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -4, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center transition-all duration-300 bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm hover:shadow-xl hover:shadow-black/5"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '16px',
                                    }}
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="xl:col-span-2 min-w-0">
                            <h4
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 900,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-tertiary)',
                                    marginBottom: '24px',
                                    opacity: 0.9
                                }}
                            >
                                {section.title}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {section.links.map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        className="hover:text-[var(--accent)] hover:translate-x-1 transition-all duration-300 group inline-flex items-center text-sm md:text-base"
                                        style={{
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    className="pt-8 md:pt-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <p className="text-sm md:text-base" style={{ fontWeight: 600, color: 'var(--text-tertiary)' }}>
                            © {currentYear} FixPix AI. All rights reserved.
                        </p>
                        <div className="flex flex-wrap gap-4 md:gap-6 items-center justify-center">
                           <Link to="/legal/privacy" className="text-sm md:text-base font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Security</Link>
                           <Link to="/legal/privacy" className="text-sm md:text-base font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
                           <Link to="/contact" className="text-sm md:text-base font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Status</Link>
                        </div>
                    </div>
                    
                    <p
                        className="flex items-center gap-2 group cursor-default text-sm md:text-base"
                        style={{ fontWeight: 600, color: 'var(--text-tertiary)' }}
                    >
                        Built with
                        <Heart size={14} className="text-[#FF2D55] fill-[#FF2D55] group-hover:scale-125 transition-transform" />
                        by <span className="text-[var(--text-primary)] font-black">Parth Bhanderi</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
