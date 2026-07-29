import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings2, Sparkles, ChevronRight, Zap } from 'lucide-react';
import clsx from 'clsx';

export interface ActionSuggestion {
  id: string;
  name: string;
  tool: string;
  description: string;
  params?: Record<string, any>;
  confidence?: number;
}

interface ActionCardProps {
  suggestion: ActionSuggestion;
  onRun: () => void;
  onRunInChat?: () => void;
  onCustomize: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ suggestion, onRun, onRunInChat, onCustomize }) => {
  const hasTwoRunModes = typeof onRunInChat === 'function';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onRun}
      className="copilot-action-card group cursor-pointer relative p-4 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-sm transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-white tracking-tight">
              {suggestion.name}
            </h4>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
        </div>

        <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {suggestion.description}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRun();
            }}
            className={clsx(
              "flex-1 h-9 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/10",
              hasTwoRunModes ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-500 group-hover:bg-blue-600 text-white"
            )}
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="text-[11px] font-bold">{hasTwoRunModes ? 'Run in Canvas' : 'Run Now'}</span>
          </button>

          {hasTwoRunModes && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRunInChat?.();
              }}
              className="flex-1 h-9 px-3 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200/50 dark:border-white/10"
            >
              <Sparkles className="w-3 h-3" />
              <span className="text-[11px] font-bold">Run in Chat</span>
            </button>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation(); // Don't trigger the card's onRun
              onCustomize();
            }}
            className="w-10 h-9 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl flex items-center justify-center transition-colors border border-gray-200/50 dark:border-white/5"
            title="Customize Parameters"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
