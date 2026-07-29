import React from 'react';
import { motion } from 'framer-motion';
import { useTrends, Trend } from '../hooks/useTrends';
import { Flame, TrendingUp, Zap, Globe, Shield } from 'lucide-react';

interface TrendingNowProps {
  onTrendClick: (topic: string) => void;
}

const TrendingNow: React.FC<TrendingNowProps> = React.memo(({ onTrendClick }) => {
  const { trends, loading } = useTrends();

  if (loading && trends.length === 0) {
    return (
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-6 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="min-w-[140px] h-10 bg-slate-100 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (trends.length === 0) return null;

  return (
    <div className="fixpix-container mb-12">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--border-subtle)' }}>
          <Flame size={14} style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <h2 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Intelligence Trends</h2>
        <div style={{ height: 1, flex: 1, backgroundColor: 'var(--border-subtle)', marginLeft: 8 }} />
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar touch-momentum pb-4 -mx-6 px-6">
        {trends.map((trend, idx) => (
          <motion.button
            key={idx}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTrendClick(trend.topic)}
            className={`
              flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-150 shrink-0 border
              ${trend.heat === 'HOT' 
                ? '' 
                : ''}
            `}
            style={{
              willChange: 'transform, opacity',
              ...(trend.heat === 'HOT'
                ? { backgroundColor: 'var(--text-primary)', borderColor: 'var(--text-primary)', color: 'var(--bg-primary)' }
                : { backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }
              ),
            }}
          >
            <div className={`
              flex items-center justify-center w-5 h-5 rounded-full 
              ${trend.heat === 'HOT' ? 'bg-white/10' : ''}
            `}
            style={trend.heat !== 'HOT' ? { backgroundColor: 'var(--fill-tertiary)' } : {}}
            >
              {trend.type === 'conflict' ? <Shield size={10} /> : 
               trend.type === 'tech' ? <Zap size={10} /> : 
               trend.type === 'economy' ? <TrendingUp size={10} /> : 
               <Globe size={10} />}
            </div>
            
            <div className="flex flex-col items-start">
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1, marginBottom: 2 }}>#{trend.topic}</span>
              <div className="flex items-center gap-1.5 opacity-60">
                <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{trend.heat}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

export default TrendingNow;
