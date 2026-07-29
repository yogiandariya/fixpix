import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import BeforeAfterSlider from '../features/BeforeAfterSlider';
import { cn } from '../../lib/utils';

export const BlogHero = ({ title, category, date, author, image }) => (
  <section className="relative w-full pt-32 pb-20 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src={image} alt="" className="w-full h-full object-cover opacity-20 blur-2xl scale-110" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)]" />
    </div>
    
    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest mb-6"
      >
        {category}
      </motion.span>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-8 leading-[1.1]"
      >
        {title}
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-6 text-[var(--text-tertiary)] text-sm font-medium"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center">
            <span className="text-[10px] text-[var(--accent)] font-bold">FP</span>
          </div>
          {author}
        </div>
        <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
        {date}
      </motion.div>
    </div>
  </section>
);

export const BeforeAfterSection = ({ original, processed, label }) => (
  <section className="my-16">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
        <Play size={18} className="text-white fill-current" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Interactive Comparison</h3>
        <p className="text-sm text-[var(--text-tertiary)]">{label}</p>
      </div>
    </div>
    
    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--surface)]">
      <BeforeAfterSlider before={original} after={processed} />
    </div>
    <p className="mt-4 text-center text-xs text-[var(--text-tertiary)] font-medium italic">
      Slide the handle to see the AI transformation in real-time.
    </p>
  </section>
);

export const HowToStep = ({ step, title, description }) => (
  <div className="flex gap-6 mb-10 group">
    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center text-xl font-black text-[var(--accent)] shadow-sm group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
      {step}
    </div>
    <div className="pt-1">
      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h4>
      <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  </div>
);

export const FAQAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={index}
          className={cn(
            "rounded-2xl border border-[var(--border-subtle)] overflow-hidden transition-all duration-300",
            openIndex === index ? "bg-[var(--surface)] shadow-md" : "bg-transparent"
          )}
        >
          <button 
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[var(--fill-tertiary)] transition-colors"
          >
            <span className="font-bold text-[var(--text-primary)]">{item.q}</span>
            <ChevronDown 
              size={18} 
              className={cn(
                "text-[var(--text-tertiary)] transition-transform duration-300",
                openIndex === index ? "rotate-180" : ""
              )}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-4">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export const CTASection = ({ toolId }) => (
  <section className="relative mt-24 p-8 md:p-12 rounded-[2.5rem] bg-[var(--accent)] overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
    
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Ready to transform your photos?
        </h2>
        <p className="text-white/80 text-lg font-medium mb-8 max-w-xl">
          Join 3M+ users who trust FixPix for professional AI photo restoration and editing.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Link 
            to={`/app/restoration?tool=${toolId}`}
            className="px-8 py-4 bg-white text-[var(--accent)] rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-transform shadow-xl shadow-black/10 flex items-center gap-2"
          >
            Try This Tool Now <Sparkles size={16} />
          </Link>
          <Link 
            to="/signup"
            className="px-8 py-4 bg-black/20 text-white border border-white/20 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black/30 transition-all flex items-center gap-2"
          >
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      
      <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rotate-3 shadow-2xl">
        <Sparkles size={64} className="text-white opacity-80" />
      </div>
    </div>
  </section>
);

export const BenefitCard = ({ text }) => (
  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-sm">
    <div className="mt-1">
      <CheckCircle2 size={18} className="text-[var(--accent)]" />
    </div>
    <span className="text-[var(--text-primary)] font-medium leading-tight">{text}</span>
  </div>
);
