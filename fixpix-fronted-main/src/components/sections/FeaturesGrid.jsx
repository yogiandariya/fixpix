import React, { useContext, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Palette, Zap, Eraser } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        id: 'colorization',
        title: 'Auto Colorization',
        short: 'Bring old photos to life',
        icon: Palette,
    },
    {
        id: 'face',
        title: 'Face Enhancement',
        short: 'Sharpen faces instantly',
        icon: Zap,
    },
    {
        id: 'scratch',
        title: 'Scratch Removal',
        short: 'Remove damage automatically',
        icon: Eraser,
    },
];

const FeaturesGrid = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (!user) {
            navigate('/login', { state: { from: '/app/restoration' } });
        } else {
            navigate('/app/restoration');
        }
    };

    return (
        <section id="features" className="py-20 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div>
                        <span style={{ 
                            display: 'inline-block',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: 'var(--text-tertiary)',
                            marginBottom: '16px',
                            padding: '6px 14px',
                            borderRadius: '999px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'transparent'
                        }}>
                            Features
                        </span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 36px)',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: '16px'
                    }}>
                        Tools for your history.
                    </h2>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar -mx-6 px-6 snap-x" style={{ scrollSnapType: 'x mandatory' }}>
                    {features.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -4, scale: 1.01 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={handleCardClick}
                            className="min-w-[280px] md:flex-1 p-10 rounded-[32px] cursor-pointer snap-center group transition-all duration-300 gpu-accelerated"
                            style={{ 
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: 'var(--shadow-soft)',
                                willChange: 'transform, box-shadow' 
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                            }}
                        >
                            <div 
                                className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-6 transition-colors duration-200"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    color: 'var(--accent)'
                                }}
                            >
                                <item.icon size={22} strokeWidth={1.75} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                                {item.title}
                            </h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {item.short}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(FeaturesGrid);
