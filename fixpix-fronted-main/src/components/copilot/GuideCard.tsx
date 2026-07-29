import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';

interface GuideStep {
  title: string;
  content: string;
}

interface GuideCardProps {
  steps: GuideStep[];
  proTip?: string;
}

export const GuideCard: React.FC<GuideCardProps> = ({ steps, proTip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="copilot-guide-card mt-4 p-5 rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-emerald-500" />
        <h5 className="text-[12px] font-black uppercase tracking-widest text-gray-400">Step-by-Step Guide</h5>
      </div>

      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-6 border-l border-gray-200 dark:border-white/10 last:border-0 pb-1">
            <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-emerald-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-600">{idx + 1}</span>
            </div>
            <h6 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">{step.title}</h6>
            <p className="text-[12px] text-gray-600 dark:text-gray-400 mb-2">{step.content}</p>
          </div>
        ))}
      </div>

      {proTip && (
        <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1 block">Pro Tip</span>
            <p className="text-[11.5px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed italic">
              {proTip}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
