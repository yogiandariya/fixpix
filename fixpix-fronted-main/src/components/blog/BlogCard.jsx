import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const CATEGORY_COLORS = {
  'Restoration': {
    primary: '#F59E0B',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200/50',
    hover: 'group-hover:border-amber-400/30'
  },
  'Creative AI': {
    primary: '#D946EF',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-600',
    border: 'border-fuchsia-200/50',
    hover: 'group-hover:border-fuchsia-400/30'
  },
  'Creative Tools': {
    primary: '#D946EF',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200/50',
    hover: 'group-hover:border-pink-400/30'
  },
  'Enhancement': {
    primary: '#06B6D4',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-200/50',
    hover: 'group-hover:border-cyan-400/30'
  },
  'Workflows': {
    primary: '#6366F1',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200/50',
    hover: 'group-hover:border-indigo-400/30'
  },
  'Platform': {
    primary: '#10B981',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200/50',
    hover: 'group-hover:border-emerald-400/30'
  },
  'default': {
    primary: '#64748B',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200/50',
    hover: 'group-hover:border-slate-400/30'
  }
};

const BlogCard = ({ post, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.default;
  const isList = viewMode === 'list';

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-[var(--surface)] border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden transition-all duration-500",
        "hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-2",
        colors.hover,
        isList ? "flex flex-col md:flex-row h-auto" : "flex flex-col h-full"
      )}
    >
      <Link to={`/blog/${post.slug}`} className="absolute inset-0 z-20" />

      {/* Visual Proof Section */}
      <div className={cn(
        "relative overflow-hidden bg-[var(--fill-tertiary)]",
        isList ? "w-full md:w-80 h-64 md:h-auto" : "aspect-[16/10] w-full"
      )}>
        <AnimatePresence mode="wait">
          {!isHovered || !post.beforeAfter ? (
            <motion.img
              key="original"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
              exit={{ opacity: 0 }}
              src={post.beforeAfter?.original || post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700"
            />
          ) : (
            <motion.div
              key="processed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <img
                src={post.beforeAfter.processed}
                alt="After Transformation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--accent)] shadow-sm">
                After AI
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Comparison Indicator */}
        {post.beforeAfter && !isHovered && (
             <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Hover to see After
             </div>
        )}
      </div>

      <div className="flex-1 p-8 flex flex-col">
        {/* Tag & Time */}
        <div className="flex items-center justify-between mb-5">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
            colors.bg, colors.text, colors.border
          )}>
            {post.category}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
            <Clock size={12} strokeWidth={2.5} /> 5 MIN READ
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1">
          <h3 className="text-[20px] font-black text-[var(--text-primary)] leading-[1.3] mb-3 group-hover:text-[var(--accent)] transition-colors tracking-tight line-clamp-2">
            {post.title}
          </h3>
          <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed line-clamp-2 opacity-70 mb-6">
            {post.metaDescription}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-[var(--border-subtle)]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--fill-tertiary)] flex items-center justify-center text-[var(--accent)] border border-[var(--border-subtle)]">
               <ShieldCheck size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Verified Hub</span>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--accent)] group/btn transition-all group-hover:gap-3">
             Read Guide 
             <ArrowRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      {/* Decorative Accent */}
      <div className={cn(
        "absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-current to-transparent opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none",
        colors.text
      )} />
    </motion.div>
  );
};

export default BlogCard;
