/**
 * SmartMetricCard — Elite Analytics Card
 * Features: Glassmorphism, Animated Counters, Sparklines, and Status Indicators
 */

import React from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.2,
            ease: [0.23, 1, 0.32, 1],
            onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
        });
        return controls.stop;
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};

const SmartMetricCard = ({ title, value, subtitle, change, pct, sparkline = [], icon: Icon, color = 'blue' }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    const themeColors = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', line: '#3b82f6' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', line: '#10b981' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', line: '#f59e0b' },
        rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', line: '#f43f5e' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', line: '#a855f7' },
    };

    const c = themeColors[color] || themeColors.blue;

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className={`relative p-6 rounded-[24px] border border-[var(--glass-border)] glass-card overflow-hidden transition-all duration-300`}
            style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                boxShadow: 'var(--card-shadow)',
            }}
        >
            {/* Background Glow */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-20 ${c.bg}`} />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[13px] font-bold tracking-tight text-[var(--text-tertiary)] uppercase">{title}</p>
                    <h2 className="text-3xl font-black text-[var(--text-primary)] mt-1">
                        <AnimatedNumber value={value} />
                    </h2>
                </div>
                <div className={`p-3 rounded-[16px] ${c.bg} ${c.text} border ${c.border}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            </div>

            <div className="flex items-end justify-between gap-4">
                <div className="space-y-1.5 min-w-[120px]">
                    <div className="flex items-center gap-1.5 font-bold text-[14px]">
                        {isPositive && (
                            <span className="flex items-center gap-0.5 text-emerald-400">
                                <TrendingUp size={14} strokeWidth={3} />
                                +{pct}%
                            </span>
                        )}
                        {isNegative && (
                            <span className="flex items-center gap-0.5 text-rose-400">
                                <TrendingDown size={14} strokeWidth={3} />
                                {pct}%
                            </span>
                        )}
                        {!isPositive && !isNegative && (
                            <span className="flex items-center gap-0.5 text-white/40">
                                <Minus size={14} strokeWidth={3} />
                                0%
                            </span>
                        )}
                        <span className="text-white/30 font-medium">vs yest</span>
                    </div>
                    {subtitle && <p className="text-[12px] font-semibold text-white/40 leading-tight">{subtitle}</p>}
                </div>

                {/* Mini Sparkline */}
                {sparkline.length > 0 && (
                    <div className="h-10 w-24 opacity-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sparkline}>
                                <defs>
                                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={c.line} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={c.line} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={c.line}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${color})`}
                                    isAnimationActive={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SmartMetricCard;
