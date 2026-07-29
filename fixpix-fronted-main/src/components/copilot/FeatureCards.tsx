import React from 'react';
import { motion } from 'framer-motion';
import { ActionCard, ActionSuggestion } from './ActionCard';
import { Sparkles, Wand2, Palette } from 'lucide-react';

interface FeatureCardsProps {
  suggestions: ActionSuggestion[];
  onRun: (tool: string) => void;
  onRunInChat: (tool: string) => void;
  onCustomize: (tool: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ suggestions, onRun, onRunInChat, onCustomize }) => {
  // Limit to max 4 items as per UX rules
  const displayItems = suggestions.slice(0, 4);

  return (
    <div className="space-y-3 mt-4">
      {displayItems.map((item, idx) => (
        <ActionCard
          key={item.id || idx}
          suggestion={item}
          onRun={() => onRun(item.tool)}
          onRunInChat={() => onRunInChat(item.tool)}
          onCustomize={() => onCustomize(item.tool)}
        />
      ))}
    </div>
  );
};
