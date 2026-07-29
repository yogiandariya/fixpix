import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Scale } from 'lucide-react';

interface BiasGaugeProps {
  score: number;
  leaning?: string;
}

const BiasGauge: React.FC<BiasGaugeProps> = ({ score, leaning }) => {
  const isBiased = score <= 30;
  const isMixed = score > 30 && score <= 70;
  const isObjective = score > 70;

  const barColor = isBiased ? '#FF3B30' : isMixed ? '#FF9500' : '#34C759';

  return (
    <div style={{
      backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 24, padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isBiased ? <ShieldAlert size={15} style={{ color: '#FF3B30' }} /> : isObjective ? <ShieldCheck size={15} style={{ color: '#34C759' }} /> : <Scale size={15} style={{ color: '#FF9500' }} />}
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bias Audit</span>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
          padding: '3px 10px', borderRadius: 999,
          backgroundColor: isBiased ? 'rgba(255,59,48,0.1)' : isMixed ? 'rgba(255,149,0,0.1)' : 'rgba(52,199,89,0.1)',
          color: barColor,
        }}>
          {isBiased ? 'High Lean' : isMixed ? 'Mixed Signals' : 'Neutral'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: barColor, lineHeight: 1 }}>{score}%</span>
        <div style={{ flex: 1, paddingBottom: 6 }}>
          <div style={{ height: 8, backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${score}%` }}
               style={{ height: '100%', backgroundColor: barColor, borderRadius: 999 }}
            />
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-tertiary)' }}>Leaning</span>
          <span style={{ color: 'var(--text-primary)' }}>{leaning || 'Detecting...'}</span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
          Audit identifies propaganda patterns and narrative consistency across intelligence sources.
        </p>
      </div>
    </div>
  );
};

export default BiasGauge;
