import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain } from 'lucide-react';

interface ModeToggleProps {
  mode: 'fast' | 'deep';
  onChange: (mode: 'fast' | 'deep') => void;
  disabled?: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = React.memo(({ mode, onChange, disabled }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', ...(disabled ? { opacity: 0.5, pointerEvents: 'none' as const } : {}) }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', padding: 4,
        backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--border-subtle)',
        borderRadius: 999, transition: 'all 200ms ease',
      }}>
        <button 
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999, transition: 'all 200ms ease',
            fontWeight: 700, border: 'none', cursor: 'pointer',
            ...(mode === 'fast' 
              ? { backgroundColor: 'var(--surface)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: 'var(--accent)' }
              : { backgroundColor: 'transparent', color: 'var(--text-tertiary)' }
            ),
          }}
          onClick={() => onChange('fast')}
          disabled={disabled}
        >
          <Zap size={16} className={mode === 'fast' ? "animate-pulse" : ""} />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
            <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fast Mode</span>
            <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.8 }}>~3 seconds</span>
          </div>
        </button>
        <button 
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999, transition: 'all 200ms ease',
            fontWeight: 700, border: 'none', cursor: 'pointer', marginLeft: 4,
            ...(mode === 'deep' 
              ? { backgroundColor: 'var(--surface)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: 'var(--accent)' }
              : { backgroundColor: 'transparent', color: 'var(--text-tertiary)' }
            ),
          }}
          onClick={() => onChange('deep')}
          disabled={disabled}
        >
          <Brain size={16} className={mode === 'deep' ? "animate-pulse" : ""} />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
            <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Deep Mode</span>
            <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.8 }}>~15 seconds</span>
          </div>
        </button>
      </div>
    </div>
  );
});

export default ModeToggle;
