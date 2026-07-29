import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Globe, Landmark, 
  TrendingDown, TrendingUp, AlertCircle,
  ShieldAlert, Users, Coins
} from 'lucide-react';

interface ImpactCardProps {
  impact?: {
    society: string[];
    politics: string[];
    economy: string[];
  };
  why_this_matters?: string[];
  verdict: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ impact, why_this_matters, verdict }) => {
  const isFake = verdict?.toUpperCase() === 'FALSE' || verdict?.toUpperCase() === 'FAKE';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  if (!impact && (!why_this_matters || why_this_matters.length === 0)) {
    return null;
  }

  const sections = [
    { id: 'society', title: 'Society', icon: <Users size={18} style={{ color: 'var(--accent)' }} />, items: impact?.society || [] },
    { id: 'politics', title: 'Politics', icon: <Landmark size={18} style={{ color: 'var(--accent)' }} />, items: impact?.politics || [] },
    { id: 'economy', title: 'Economy', icon: <Coins size={18} style={{ color: 'var(--accent)' }} />, items: impact?.economy || [] },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          padding: 10, borderRadius: 16,
          backgroundColor: isFake ? 'rgba(255,59,48,0.1)' : 'var(--accent-soft)',
          color: isFake ? '#FF3B30' : 'var(--accent)',
        }}>
          <ShieldAlert size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Why This Matters</h3>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>Real-World Intelligence Report</p>
        </div>
      </div>

      {why_this_matters && why_this_matters.length > 0 && (
        <div style={{
          padding: 20, backgroundColor: 'var(--fill-tertiary)',
          borderRadius: 20, border: '1px solid var(--border-subtle)',
        }}>
           <ul className="space-y-3">
             {why_this_matters.map((item, i) => (
               <motion.li 
                key={i}
                variants={itemVariants}
                style={{ display: 'flex', gap: 12, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}
               >
                 <span style={{ color: 'var(--text-tertiary)', marginTop: 2 }}>•</span>
                 <span style={{ fontWeight: 500 }}>{item}</span>
               </motion.li>
             ))}
           </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            variants={itemVariants}
            style={{
              padding: 20, borderRadius: 24,
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface)',
              display: 'flex', flexDirection: 'column', gap: 16,
              transition: 'all 200ms ease',
            }}
            className="group hover:shadow-md"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                padding: 8, backgroundColor: 'var(--fill-tertiary)',
                borderRadius: 14, border: '1px solid var(--border-subtle)',
                transition: 'transform 200ms ease',
              }}>
                {section.icon}
              </div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {section.title}
              </h4>
            </div>

            <ul className="space-y-3">
              {section.items.length > 0 ? section.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <span>→</span>
                  <span>{item}</span>
                </li>
              )) : (
                <li style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Limited immediate impact detected.</li>
              )}
            </ul>
          </motion.div>
        ))}
      </div>

      {isFake && (
        <div style={{
          marginTop: 16, padding: 16,
          backgroundColor: 'rgba(255,59,48,0.06)', borderRadius: 20,
          border: '1px solid rgba(255,59,48,0.1)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <AlertCircle size={16} style={{ color: '#FF3B30', flexShrink: 0 }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: '#FF3B30', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Misinformation Defense: High Risk Detected
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ImpactCard;
