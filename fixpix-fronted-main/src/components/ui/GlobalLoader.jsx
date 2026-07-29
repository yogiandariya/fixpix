import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const GlobalLoader = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-primary, rgba(17, 17, 17, 0.4))',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 260, 
                    damping: 20, 
                    delay: 0.1 
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                }}
            >
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'var(--surface-elevated, #222)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Soft glowing ambient orb behind the logo */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                            opacity: 0.4,
                            filter: 'blur(10px)'
                        }}
                    />
                    
                    {/* The primary logo icon */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{ position: 'relative', zIndex: 10 }}
                    >
                        <Sparkles size={28} style={{ color: 'var(--text-main, #FFF)' }} fill="currentColor" />
                    </motion.div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary, #888)',
                    }}
                >
                    FixPix
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default GlobalLoader;
