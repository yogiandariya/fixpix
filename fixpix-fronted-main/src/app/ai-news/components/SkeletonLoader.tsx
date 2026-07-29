import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type: 'card' | 'text' | 'badge' | 'dashboard';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const Pulse = ({ className }: { className: string }) => (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`}
    />
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="ios-card w-full space-y-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl w-full" />
          </div>
        );
      case 'badge':
        return <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />;
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          </div>
        );
      case 'dashboard':
        return (
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
