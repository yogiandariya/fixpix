import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const BlogSkeleton = ({ viewMode = 'grid' }) => {
  const isList = viewMode === 'list';

  return (
    <div className={cn(
      "bg-[var(--surface)] border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden",
      isList ? "flex flex-col md:flex-row h-auto" : "flex flex-col h-full"
    )}>
      {/* Image Skeleton */}
      <div className={cn(
        "relative overflow-hidden bg-[var(--fill-tertiary)] animate-pulse",
        isList ? "w-full md:w-80 h-64 md:h-auto" : "aspect-[16/10] w-full"
      )} />

      <div className="flex-1 p-8 flex flex-col space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-[var(--fill-tertiary)] rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-[var(--fill-tertiary)] rounded-md animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-3 flex-1">
          <div className="h-8 w-full bg-[var(--fill-tertiary)] rounded-xl animate-pulse" />
          <div className="h-8 w-3/4 bg-[var(--fill-tertiary)] rounded-xl animate-pulse" />
          <div className="pt-2 space-y-2">
            <div className="h-4 w-full bg-[var(--fill-tertiary)] rounded-md animate-pulse opacity-60" />
            <div className="h-4 w-4/5 bg-[var(--fill-tertiary)] rounded-md animate-pulse opacity-60" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="pt-6 border-t border-[var(--border-subtle)]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--fill-tertiary)] animate-pulse" />
            <div className="h-4 w-20 bg-[var(--fill-tertiary)] rounded-md animate-pulse" />
          </div>
          <div className="h-4 w-20 bg-[var(--fill-tertiary)] rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const BlogSkeletonGrid = ({ count = 6, viewMode = 'grid' }) => (
  <div className={cn(
    "grid gap-6",
    viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
  )}>
    {Array.from({ length: count }).map((_, i) => (
      <BlogSkeleton key={i} viewMode={viewMode} />
    ))}
  </div>
);

export default BlogSkeleton;
