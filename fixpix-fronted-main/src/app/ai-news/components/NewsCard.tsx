import React from 'react';
import { NormalizedNewsArticle } from '../hooks/useFactCheck';
import { FactCheckBadge } from './FactCheckBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Clock, ArrowRight } from 'lucide-react';

interface NewsCardProps {
  data: NormalizedNewsArticle;
  isTrending?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        position: 'relative',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        transition: 'background-color 150ms ease',
        cursor: 'default',
      }}
      className="group hover:bg-[var(--fill-tertiary)]"
    >
      {/* Metadata Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            padding: '2px 8px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
            fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', borderRadius: 4,
          }}>
            {data.source || 'INTEL'}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            {data.category || 'WORLD'}
          </span>
        </div>
        
        <span style={{ color: 'var(--text-quaternary)', fontWeight: 700, fontSize: 10 }}>•</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', flexShrink: 0 }}>
          <Clock style={{ width: 12, height: 12 }} />
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {data.published || 'RECENT'}
          </span>
        </div>

        {data.factCheck === 'VERIFIED' && (
          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              padding: '3px 10px', backgroundColor: 'var(--accent-soft)', color: 'var(--accent)',
              fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', borderRadius: 999,
              border: '1px solid var(--border-subtle)',
            }}>
              VERIFIED
            </span>
          </div>
        )}
      </div>

      {/* Content Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{
          fontSize: 16, fontWeight: 600, color: 'var(--text-primary)',
          lineHeight: 1.4, letterSpacing: '-0.01em', transition: 'color 150ms ease',
        }}>
          {data.title}
        </h3>
        
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
          {data.summary || data.description}
        </p>
      </div>

      {/* Action Row */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a 
          href={data.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => e.stopPropagation()}
          style={{
            color: 'var(--accent)', fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
            textDecoration: 'none', transition: 'opacity 150ms ease',
          }}
        >
          Analyze Claim <ArrowRight style={{ width: 12, height: 12 }} />
        </a>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-quaternary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Signal Strength: {data.confidence || 50}%
            </span>
        </div>
      </div>
    </motion.div>
  );
};
