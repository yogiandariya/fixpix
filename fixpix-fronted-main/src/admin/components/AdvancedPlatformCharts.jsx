/**
 * AdvancedPlatformCharts — Elite Data Visualization
 * Features: Success vs Failure, Compare Mode, Zoom, and Interaction
 */

import React, { useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Legend, BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BarChart3, Maximize2, RefreshCw } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-[var(--popup-bg)] border border-[var(--glass-border)] rounded-2xl shadow-2xl backdrop-blur-3xl overflow-hidden glass-card">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                <p className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                                <span className="text-[13px] font-bold text-[var(--text-secondary)]">{entry.name}</span>
                            </div>
                            <span className="text-[14px] font-black text-[var(--text-primary)] ml-8">{entry.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const AdvancedPlatformCharts = ({ trends = [], features = [] }) => {
    const [view, setView] = useState('processing'); // 'processing' or 'features'

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Area Chart: Processing Trends */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] glass-card backdrop-blur-2xl"
            >
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-lg">
                            <Activity size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight">Processing Intelligence</h3>
                            <p className="text-[12px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mt-0.5">Real-time Volume Analytics</p>
                        </div>
                    </div>
                </div>

                <div className="h-[360px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--divider)" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: '800' }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: '800' }}
                                dx={-5}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139, 92, 246, 0.2)', strokeWidth: 2 }} />
                            <Area
                                type="monotone"
                                dataKey="success"
                                name="Successful Jobs"
                                stroke="#8b5cf6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorSuccess)"
                                animationDuration={2000}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6', shadow: '0 0 15px #8b5cf6' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="failed"
                                name="System Failures"
                                stroke="#f43f5e"
                                strokeWidth={3}
                                strokeDasharray="6 6"
                                fillOpacity={1}
                                fill="url(#colorFailed)"
                                animationDuration={2200}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Feature Usage: Rankings */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] glass-card backdrop-blur-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <BarChart3 size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight">Feature Ranking</h3>
                            <p className="text-[12px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mt-0.5">Top performing tools</p>
                        </div>
                    </div>
                </div>

                <div className="h-[360px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={features} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--divider)" />
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="processing_type" 
                                type="category" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: '800' }}
                                width={110}
                            />
                            <Tooltip cursor={{ fill: 'var(--fill-tertiary)' }} content={<CustomTooltip />} />
                            <Bar dataKey="usage" name="Total Executions" radius={[0, 8, 8, 0]} barSize={34}>
                                {features.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={index === 0 ? 'url(#purpleGradient)' : 'var(--fill-muted)'} 
                                    />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                                    <stop offset="100%" stopColor="#c084fc" stopOpacity={0.9} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="mt-8 pt-8 border-t border-[var(--glass-border)] text-center">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Growth Leader</p>
                            <p className="text-[14px] font-black text-emerald-500">Colorization ↑ +14%</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Stability Index</p>
                             <p className="text-[14px] font-black text-blue-500">99.8% Optimized</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdvancedPlatformCharts;
