import React from 'react';
import { motion } from 'framer-motion';
import { Play, Check, Loader2, ListOrdered } from 'lucide-react';

const WorkflowCard = ({ workflow, currentStepIndex = -1, isProcessing = false, onRunAll }) => {
  if (!workflow || !workflow.steps) return null;

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 my-3 border transition-all"
        style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-soft)'
        }}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: 'var(--accent)' }}>
                    <ListOrdered size={16} strokeWidth={2.5} />
                </div>
                <div>
                    <h4 className="text-[12px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{workflow.title}</h4>
                    <p className="text-[9px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{workflow.description}</p>
                </div>
            </div>
            
            <button 
                onClick={onRunAll}
                disabled={isProcessing}
                className="px-3 py-1.5 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent)' }}
            >
                {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                Run
            </button>
        </div>

        <div className="space-y-2">
            {workflow.steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                    <div 
                        key={step.id} 
                        className="flex items-center gap-2 p-2 rounded-xl transition-all border"
                        style={{ 
                            backgroundColor: isCurrent ? 'var(--fill-tertiary)' : 'transparent',
                            borderColor: isCurrent ? 'var(--border-subtle)' : 'transparent'
                        }}
                    >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{ 
                                backgroundColor: isCompleted ? 'rgba(52, 199, 89, 0.12)' : isCurrent ? 'var(--accent)' : 'var(--fill-tertiary)',
                                color: isCompleted ? '#32D74B' : isCurrent ? 'white' : 'var(--text-tertiary)'
                            }}
                        >
                            {isCompleted ? <Check size={12} strokeWidth={3} /> : idx + 1}
                        </div>
                        <div className="flex-1">
                            <span className="text-[11px] font-semibold" style={{ color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                {step.label}
                            </span>
                        </div>
                        {isCurrent && <Loader2 size={12} className="animate-spin" style={{ color: 'var(--accent)' }} />}
                    </div>
                );
            })}
        </div>
    </motion.div>
  );
};

export default WorkflowCard;
