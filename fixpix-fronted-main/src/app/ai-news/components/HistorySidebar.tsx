import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, ShieldCheck, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'fact_check' | 'intelligence';
  claim: string;
  verdict: string;
  confidence: number;
  timestamp: string;
  explanation?: string;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (claim: string) => void;
  isLoading: boolean;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect, isLoading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', zIndex: 100, cursor: 'pointer' }}
          />
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, height: '100%', width: '100%', maxWidth: 400,
              backgroundColor: 'var(--surface)', zIndex: 101,
              display: 'flex', flexDirection: 'column',
              borderLeft: '1px solid var(--border-subtle)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header */}
            <div style={{ padding: 24, borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Forensic Archive</h3>
              </div>
              <button 
                onClick={onClose}
                style={{ padding: 8, borderRadius: 10, border: 'none', cursor: 'pointer', backgroundColor: 'var(--fill-tertiary)', color: 'var(--text-tertiary)', transition: 'all 200ms ease' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }} className="space-y-3">
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 12, opacity: 0.5 }}>
                  <div style={{ width: 24, height: 24, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Retrieving Archive...</span>
                </div>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                        onSelect(item.claim);
                        onClose();
                    }}
                    style={{
                      width: '100%', textAlign: 'left', padding: 16,
                      backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
                      borderRadius: 20, cursor: 'pointer', position: 'relative',
                      overflow: 'hidden', transition: 'all 200ms ease',
                    }}
                    className="group hover:shadow-md"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                        backgroundColor: 'var(--accent-soft)', color: 'var(--accent)',
                      }}>
                        {item.type === 'intelligence' ? 'Deep OSINT' : 'Fast Verify'}
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-quaternary)' }}>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 8 }}>
                      {item.claim}
                    </h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                           <ShieldCheck size={10} style={{ color: item.verdict === 'VERIFIED' ? '#34C759' : 'var(--text-tertiary)' }} />
                           <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)' }}>{item.confidence}%</span>
                        </div>
                        <div style={{ height: 4, width: 4, borderRadius: '50%', backgroundColor: 'var(--border-subtle)' }} />
                        <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
                           {item.explanation || 'Archived intelligence briefing.'}
                        </span>
                    </div>
                  </button>
                ))
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, opacity: 0.3 }}>
                   <Clock size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 16 }} />
                   <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>No intelligence reports archived yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: 24, backgroundColor: 'var(--fill-tertiary)', borderTop: '1px solid var(--border-subtle)' }}>
               <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                 The Forensic Archive stores all deep investigations for historical narrative tracking and bias detection.
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistorySidebar;
