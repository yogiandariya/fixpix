import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, Moon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DotMap from './DotMap';
import Logo from '../ui/Logo';
import { Text } from '../ui/Text';

const AuthLayout = ({ children, title, subtitle, isDark, toggleTheme }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 md:p-8 overflow-hidden relative">
            {/* Action Buttons */}
            <div className="absolute top-6 left-6 z-50 flex gap-2">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--fill-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)]"
                >
                    <ArrowLeft size={18} />
                </motion.button>
            </div>

            <div className="absolute top-6 right-6 z-50">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--fill-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)]"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
            </div>

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl h-[min(800px,calc(100vh-64px))] flex rounded-[28px] overflow-hidden bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[0_20px_60px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] relative z-10 transition-all duration-[250ms] ease-in-out"
            >
                {/* Visual Column */}
                <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden border-r border-[var(--border-subtle)]">
                    <DotMap isDark={isDark} />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="w-20 h-20 rounded-[28px] bg-[var(--accent)] flex items-center justify-center shadow-2xl shadow-[var(--accent-soft)] mb-8"
                        >
                            <ArrowRight size={32} className="text-white" />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-center"
                        >
                            <Text as="h2" variant="largeTitle" tone="primary" className="mb-4 italic">
                                FixPix <span className="text-[var(--accent)]">AI</span>
                            </Text>
                            <Text variant="body" tone="secondary" className="font-semibold max-w-xs mx-auto">
                                Join the neural revolution. Restore memories, upscale realities, and generate the impossible.
                            </Text>
                        </motion.div>
                    </div>

                    {/* Atmospheric Glows */}
                    <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[var(--accent)] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500 opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
                </div>

                {/* Form Column */}
                <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto scrollbar-hide bg-[var(--surface-elevated)]">
                    <div className="w-full max-w-sm mx-auto my-auto py-8">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <Logo />
                        </div>

                        <div className="mb-10">
                            <Text as="h1" variant="title1" tone="primary" className="mb-2 transition-all">
                                {title}
                            </Text>
                            <Text variant="subhead" tone="tertiary" className="font-medium uppercase tracking-[0.2em] transition-all">
                                {subtitle}
                            </Text>
                        </div>

                        {children}
                    </div>
                </div>
            </motion.div>

            {/* Background Blobs for Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[var(--bg-primary)]">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-[0.05] blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500 opacity-[0.05] blur-[100px] rounded-full" />
            </div>
        </div>
    );
};

export default AuthLayout;
