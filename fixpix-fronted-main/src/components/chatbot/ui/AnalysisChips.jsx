import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Image, Sparkles } from 'lucide-react';

const TAG_ICONS = {
  portrait: <User size={12} />,
  landscape: <Image size={12} />,
  outdoor: <Camera size={12} />,
  blurry: <Sparkles size={12} className="text-amber-500" />,
  low_quality: <Sparkles size={12} className="text-red-400" />,
};

const AnalysisChips = ({ tags = [] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-2 px-1">
      {tags.map((tag) => (
        <motion.span
          key={tag.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors"
          style={{ 
            backgroundColor: 'var(--fill-tertiary)', 
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <span style={{ color: 'var(--accent)' }}>
            {TAG_ICONS[tag.type] || <Sparkles size={10} />}
          </span>
          {tag.label}
        </motion.span>
      ))}
    </div>
  );
};

export default AnalysisChips;
