import React from 'react';
import { NewsCard } from './NewsCard';
import { NormalizedNewsArticle } from '../hooks/useFactCheck';
import SkeletonLoader from './SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

interface NewsListProps {
  news: NormalizedNewsArticle[];
  isLoading?: boolean;
}

export const NewsList: React.FC<NewsListProps> = ({ news, isLoading = false }) => {
  if (isLoading && news.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-subtle)' }}>
        {[...Array(8)].map((_, i) => (
           <div key={i} style={{ height: 96, width: '100%', borderBottom: '1px solid var(--border-subtle)' }} className="animate-pulse" />
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return null; // Handled by LiveNews empty state
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 24, overflow: 'hidden',
    }}>
      <AnimatePresence mode="popLayout">
        {news.map((item, idx) => (
          <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ 
              duration: 0.3, 
              delay: idx * 0.03,
              ease: "easeOut"
            }}
            key={item.url || item.title || idx}
          >
            <NewsCard data={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
