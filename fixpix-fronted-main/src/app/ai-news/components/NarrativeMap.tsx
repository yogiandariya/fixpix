import React from 'react';
import { motion } from 'framer-motion';
import { Share2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Narrative {
  type: string;
  volume: number;
  sentiment: number;
}

interface NarrativeMapProps {
  narratives: Narrative[];
}

const NarrativeMap: React.FC<NarrativeMapProps> = ({ narratives }) => {
  if (!narratives || narratives.length === 0) return null;

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return '#34C759';
    if (sentiment < -0.2) return '#FF3B30';
    return 'var(--text-tertiary)';
  };

  return (
    <div className="space-y-4">
      {narratives.map((narr, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          style={{
            backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 16, padding: 16, transition: 'box-shadow 200ms ease',
          }}
          className="hover:shadow-md"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{narr.type}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {narr.sentiment > 0.2 ? (
                <TrendingUp size={12} style={{ color: '#34C759' }} />
              ) : narr.sentiment < -0.2 ? (
                <TrendingDown size={12} style={{ color: '#FF3B30' }} />
              ) : (
                <Minus size={12} style={{ color: 'var(--text-tertiary)' }} />
              )}
              <span style={{ fontSize: 10, fontWeight: 700, color: getSentimentColor(narr.sentiment) }}>
                {Math.abs(Math.round(narr.sentiment * 100))}% {narr.sentiment > 0 ? 'Positive' : narr.sentiment < 0 ? 'Negative' : 'Neutral'}
              </span>
            </div>
          </div>
          
          <div style={{ position: 'relative', height: 8, backgroundColor: 'var(--fill-tertiary)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${narr.volume}%` }}
              style={{ height: '100%', backgroundColor: getSentimentColor(narr.sentiment), borderRadius: 999 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-quaternary)', textTransform: 'uppercase' }}>Signal Volume</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{narr.volume}% Propagation</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NarrativeMap;
