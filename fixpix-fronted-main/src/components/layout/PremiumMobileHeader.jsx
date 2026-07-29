import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatbot } from '../chatbot/useChatbot';

const PremiumMobileHeader = ({ title, showBack = true, rightElement = null }) => {
    const navigate = useNavigate();
    const { toggleChat } = useChatbot();

    return (
        <div className="sticky top-0 z-[60] md:hidden w-full px-4 pt-[max(10px,env(safe-area-inset-top))] pb-2 mobile-glass backdrop-blur-[50px] shadow-sm" style={{ backgroundColor: 'transparent' }}>
            <div className="flex items-center justify-between h-[44px] w-full bg-white/40 dark:bg-black/20 rounded-full px-3 border border-white/30 dark:border-white/5 shadow-inner overflow-hidden">
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    {showBack ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(-1)}
                            className="w-8.5 h-8.5 rounded-full flex items-center justify-center bg-gray-100/50 dark:bg-white/10 text-gray-800 dark:text-white touch-scale"
                        >
                            <ChevronLeft size={20} strokeWidth={3} />
                        </motion.button>
                    ) : (
                        <Link to="/app" className="flex items-center h-8.5 shrink-0 no-underline">
                            <div className="w-8.5 h-8.5 rounded-xl bg-accent flex items-center justify-center text-white shadow-xl shadow-accent/20 relative overflow-hidden">
                                <Sparkles size={16} fill="currentColor" className="relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                            </div>
                        </Link>
                    )}

                    <Link to="/app" className="flex flex-col min-w-0 no-underline">
                        <h1 className="text-[15px] font-[900] tracking-[-0.04em] text-gray-900 dark:text-white truncate m-0 leading-tight">
                            {title || 'FixPix'}
                        </h1>
                        <span className="text-[8px] font-[950] text-accent/80 tracking-[0.08em] uppercase leading-none">
                            PRO STUDIO
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {rightElement}
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={toggleChat}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-accent/5 dark:bg-accent/15 text-accent border border-accent/10 touch-scale relative ml-1"
                        aria-label="Toggle Assistant"
                    >
                        <Brain size={18} strokeWidth={2.8} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default PremiumMobileHeader;
