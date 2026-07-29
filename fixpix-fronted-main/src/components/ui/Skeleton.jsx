import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Skeleton - Loading placeholder component
 * 
 * Use for content loading states to improve perceived performance.
 */

// Base skeleton with high-fidelity shimmer animation
const Skeleton = ({ className, ...props }) => (
    <div
        className={cn(
            "relative overflow-hidden rounded-lg bg-[var(--surface-elevated)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.05] before:to-transparent",
            className
        )}
        {...props}
    />
);

// Text line skeleton
const SkeletonText = ({ lines = 1, className }) => (
    <div className={cn("space-y-2", className)}>
        {[...Array(lines)].map((_, i) => (
            <Skeleton
                key={i}
                className={cn(
                    "h-4",
                    i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
                )}
            />
        ))}
    </div>
);

// Avatar/circular skeleton
const SkeletonAvatar = ({ size = "md", className }) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    return (
        <Skeleton className={cn("rounded-full", sizes[size], className)} />
    );
};

// Image/card skeleton
const SkeletonCard = ({ className }) => (
    <div className={cn("rounded-2xl overflow-hidden", className)}>
        <Skeleton className="aspect-video w-full" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    </div>
);

// Project card skeleton (for Projects page)
const SkeletonProjectCard = () => (
    <div className="glass-panel rounded-2xl overflow-hidden">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
                <SkeletonAvatar size="sm" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    </div>
);

// Button skeleton
const SkeletonButton = ({ className }) => (
    <Skeleton className={cn("h-10 w-24 rounded-xl", className)} />
);

// Projects page loading skeleton
const ProjectsPageSkeleton = () => (
    <div className="p-6 md:p-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-40" />
            <SkeletonButton className="w-32" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <SkeletonProjectCard key={i} />
            ))}
        </div>
    </div>
);

// Dashboard stats skeleton
const DashboardSkeleton = () => (
    <div className="p-6 md:p-8 w-full animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-64" />
            </div>
            <Skeleton className="h-14 w-40 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-panel p-8 rounded-3xl border border-white/10">
                    <div className="flex justify-between mb-6">
                        <Skeleton className="w-12 h-12 rounded-2xl" />
                        <Skeleton className="w-4 h-4" />
                    </div>
                    <Skeleton className="h-10 w-20 mb-3" />
                    <Skeleton className="h-4 w-28" />
                </div>
            ))}
        </div>

        <div className="mb-14">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="glass-panel p-6 rounded-3xl border border-white/10 h-40">
                        <Skeleton className="w-14 h-14 rounded-2xl mb-6" />
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// History item skeleton
const HistorySkeleton = () => (
    <div className="p-6 md:p-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-12">
            <div className="space-y-4">
                <Skeleton className="h-16 w-64 mb-4" />
                <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-18 w-72 rounded-2xl" />
        </div>
        <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-panel p-5 rounded-2xl flex gap-6">
                    <Skeleton className="w-32 h-32 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-4 py-2">
                        <div className="flex gap-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export {
    Skeleton,
    SkeletonText,
    SkeletonAvatar,
    SkeletonCard,
    SkeletonButton,
    SkeletonProjectCard,
    ProjectsPageSkeleton,
    DashboardSkeleton,
    HistorySkeleton
};

export default Skeleton;
