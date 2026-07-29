import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle, Globe } from 'lucide-react';

interface FactCheckBadgeProps {
  status: 'REAL' | 'FAKE' | 'MISLEADING' | 'UNVERIFIED' | 'TRUE' | 'FALSE' | 'PENDING' | 'NEWS_SUMMARY';
  className?: string;
}

const statusConfig: Record<string, { bg: string; color: string; icon: any; label: string }> = {
  REAL: { bg: 'rgba(52,199,89,0.12)', color: '#34C759', icon: ShieldCheck, label: 'Verified Real' },
  TRUE: { bg: 'rgba(52,199,89,0.12)', color: '#34C759', icon: ShieldCheck, label: 'Verified True' },
  FAKE: { bg: 'rgba(255,59,48,0.12)', color: '#FF3B30', icon: ShieldAlert, label: 'False Claim' },
  FALSE: { bg: 'rgba(255,59,48,0.12)', color: '#FF3B30', icon: ShieldAlert, label: 'Verified False' },
  MISLEADING: { bg: 'rgba(255,149,0,0.12)', color: '#FF9500', icon: AlertTriangle, label: 'Misleading' },
  UNVERIFIED: { bg: 'rgba(255,204,0,0.12)', color: '#FFCC00', icon: ShieldQuestion, label: 'Unverified' },
  PENDING: { bg: 'var(--accent-soft)', color: 'var(--accent)', icon: ShieldQuestion, label: 'Verifying...' },
  NEWS_SUMMARY: { bg: 'var(--accent-soft)', color: 'var(--accent)', icon: Globe, label: 'News Briefing' },
};

export const FactCheckBadge: React.FC<FactCheckBadgeProps> = React.memo(({ status, className }) => {
  const config = statusConfig[status] || statusConfig.UNVERIFIED;
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 14px', borderRadius: 999,
        fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700,
        backgroundColor: config.bg, color: config.color,
        border: `1px solid ${config.color}22`,
        cursor: 'default',
      }}
      className={className}
    >
      <Icon style={{ width: 14, height: 14 }} strokeWidth={2.5} />
      <span>{config.label}</span>
    </motion.div>
  );
});
