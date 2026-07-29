'use client';

import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useState,
  useMemo,
} from 'react';
import { cn } from '@/lib/utils';

type TreeContextType = {
  expandedIds: Set<string>;
  selectedIds: string[];
  toggleExpanded: (nodeId: string) => void;
  handleSelection: (nodeId: string, ctrlKey: boolean) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  indent?: number;
  animateExpand?: boolean;
};

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const useTreeContext = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('Tree components must be used within a TreeProvider');
  }
  return context;
};

type TreeNodeContextType = {
  nodeId: string;
  level: number;
  isLast: boolean;
  parentPath: boolean[];
};

const TreeNodeContext = createContext<TreeNodeContextType | undefined>(
  undefined
);

const useTreeNode = () => {
  const context = useContext(TreeNodeContext);
  if (!context) {
    throw new Error('TreeNode components must be used within a TreeNode');
  }
  return context;
};

export type TreeProviderProps = {
  children: ReactNode;
  defaultExpandedIds?: string[];
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
  className?: string;
};

export const TreeProvider = ({
  children,
  defaultExpandedIds = [],
  showLines = false, // iOS style: remove lines by default for a cleaner look
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds,
  onSelectionChange,
  indent = 24, // Increased for better hierarchy without lines
  animateExpand = true,
  className,
}: TreeProviderProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  );
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    selectedIds ?? []
  );

  const isControlled =
    selectedIds !== undefined && onSelectionChange !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleSelection = useCallback(
    (nodeId: string, ctrlKey = false) => {
      if (!selectable) {
        return;
      }

      let newSelection: string[];

      if (multiSelect && ctrlKey) {
        newSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedIds(newSelection);
      }
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isControlled,
      onSelectionChange,
    ]
  );

  return (
    <TreeContext.Provider
      value={{
        expandedIds,
        selectedIds: currentSelectedIds,
        toggleExpanded,
        handleSelection,
        showLines,
        showIcons,
        selectable,
        multiSelect,
        indent,
        animateExpand,
      }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={cn('w-full', className)}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </TreeContext.Provider>
  );
};

export type TreeViewProps = HTMLAttributes<HTMLDivElement>;

export const TreeView = React.memo(({ className, children, ...props }: TreeViewProps) => (
  <div className={cn('py-1 flex flex-col gap-0.5', className)} {...props}>
    {children}
  </div>
));
TreeView.displayName = 'TreeView';

export type TreeNodeProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string;
  level?: number;
  isLast?: boolean;
  parentPath?: boolean[];
  children?: ReactNode;
};

export const TreeNode = React.memo(({
  nodeId: providedNodeId,
  level = 0,
  isLast = false,
  parentPath = [],
  children,
  className,
  onClick,
  ...props
}: TreeNodeProps) => {
  const generatedId = useId();
  const nodeId = providedNodeId ?? generatedId;

  const currentPath = useMemo(() => {
    const path = level === 0 ? [] : [...parentPath];
    if (level > 0 && parentPath.length < level - 1) {
      while (path.length < level - 1) {
        path.push(false);
      }
    }
    if (level > 0) {
      path[level - 1] = isLast;
    }
    return path;
  }, [level, isLast, parentPath]);

  return (
    <TreeNodeContext.Provider
      value={{
        nodeId,
        level,
        isLast,
        parentPath: currentPath,
      }}
    >
      <div className={cn('select-none overflow-hidden h-auto', className)} {...props}>
        {children}
      </div>
    </TreeNodeContext.Provider>
  );
});
TreeNode.displayName = 'TreeNode';

export type TreeNodeTriggerProps = ComponentProps<typeof motion.div>;

export const TreeNodeTrigger = React.memo(({
  children,
  className,
  onClick,
  ...props
}: TreeNodeTriggerProps) => {
  const { selectedIds, toggleExpanded, handleSelection, indent } = useTreeContext();
  const { nodeId, level } = useTreeNode();
  const isSelected = selectedIds.includes(nodeId);

  return (
    <motion.div
      className={cn(
        'group relative flex cursor-pointer items-center rounded-2xl p-2.5 mx-1 transition-colors duration-300',
        'hover:bg-[var(--fill-tertiary)]/50',
        className
      )}
      onClick={(e) => {
        toggleExpanded(nodeId);
        handleSelection(nodeId, e.ctrlKey || e.metaKey);
        onClick?.(e);
      }}
      style={{ paddingLeft: level * (indent ?? 0) + 12 }}
      whileTap={{ scale: 0.985, transition: { duration: 0.1 } }}
      {...props}
    >
      {/* iOS Floating Active Pill Indicator */}
      {isSelected && (
        <motion.div
          layoutId="selection-pill"
          className="absolute inset-0 z-0 rounded-2xl bg-[var(--accent)] shadow-lg shadow-[var(--accent-soft)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      
      <TreeLines />
      <div className="relative z-10 flex items-center w-full">
        {children as ReactNode}
      </div>
    </motion.div>
  );
});
TreeNodeTrigger.displayName = 'TreeNodeTrigger';

export const TreeLines = React.memo(() => {
  const { showLines, indent } = useTreeContext();
  const { level, isLast, parentPath } = useTreeNode();

  if (!showLines || level === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-0 opacity-20">
      {Array.from({ length: level }, (_, index) => {
        const shouldHideLine = parentPath[index] === true;
        if (shouldHideLine && index === level - 1) {
          return null;
        }

        return (
          <div
            className="absolute top-0 bottom-0 border-[var(--border-subtle)] border-l"
            key={index.toString()}
            style={{
              left: index * (indent ?? 0) + 16,
              display: shouldHideLine ? 'none' : 'block',
            }}
          />
        );
      })}

      <div
        className="absolute top-1/2 border-[var(--border-subtle)] border-t"
        style={{
          left: (level - 1) * (indent ?? 0) + 16,
          width: (indent ?? 0) - 8,
          transform: 'translateY(-1px)',
        }}
      />

      {isLast && (
        <div
          className="absolute top-0 border-[var(--border-subtle)] border-l"
          style={{
            left: (level - 1) * (indent ?? 0) + 16,
            height: '50%',
          }}
        />
      )}
    </div>
  );
});
TreeLines.displayName = 'TreeLines';

export type TreeNodeContentProps = ComponentProps<typeof motion.div> & {
  hasChildren?: boolean;
};

export const TreeNodeContent = ({
  children,
  hasChildren = false,
  className,
  ...props
}: TreeNodeContentProps) => {
  const { animateExpand, expandedIds } = useTreeContext();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  return (
    <AnimatePresence initial={false}>
      {hasChildren && isExpanded && (
        <motion.div
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden"
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
            opacity: { duration: 0.2, delay: 0.1 }
          }}
        >
          <motion.div
            animate={{ y: 0 }}
            className={cn("pt-0.5 pb-1", className)}
            exit={{ y: -8 }}
            initial={{ y: -8 }}
            transition={{
              duration: 0.25,
              ease: 'easeOut'
            }}
            {...props}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export type TreeExpanderProps = ComponentProps<typeof motion.div> & {
  hasChildren?: boolean;
};

export const TreeExpander = React.memo(({
  hasChildren = false,
  className,
  onClick,
  ...props
}: TreeExpanderProps) => {
  const { expandedIds, toggleExpanded, selectedIds } = useTreeContext();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);
  const isSelected = selectedIds.includes(nodeId);

  if (!hasChildren) {
    return <div className="mr-2 h-4 w-4" />;
  }

  return (
    <motion.div
      animate={{ rotate: isExpanded ? 90 : 0 }}
      className={cn(
        'mr-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg hover:bg-[var(--fill-tertiary)] transition-colors',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        toggleExpanded(nodeId);
        onClick?.(e);
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      {...props}
    >
      <ChevronRight className={cn(
        "h-4 w-4 transition-colors",
        isSelected ? "text-white" : "text-[var(--text-tertiary)]"
      )} />
    </motion.div>
  );
});
TreeExpander.displayName = 'TreeExpander';

export type TreeIconProps = ComponentProps<typeof motion.div> & {
  icon?: ReactNode;
  hasChildren?: boolean;
};

export const TreeIcon = React.memo(({
  icon,
  hasChildren = false,
  className,
  ...props
}: TreeIconProps) => {
  const { showIcons, expandedIds, selectedIds } = useTreeContext();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);
  const isSelected = selectedIds.includes(nodeId);

  if (!showIcons) {
    return null;
  }

  const getDefaultIcon = () =>
    hasChildren ? (
      isExpanded ? (
        <FolderOpen className="h-4 w-4" />
      ) : (
        <Folder className="h-4 w-4" />
      )
    ) : (
      <File className="h-4 w-4" />
    );

  return (
    <motion.div
      className={cn(
        'mr-2.5 flex h-4 w-4 items-center justify-center transition-colors',
        isSelected ? "text-white/90" : "text-[var(--text-tertiary)]",
        className
      )}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.2 }}
      {...props}
    >
      {React.isValidElement(icon) 
        ? React.cloneElement(icon as React.ReactElement, { 
            className: cn((icon as React.ReactElement).props.className, isSelected ? "text-white" : "") 
          }) 
        : icon || getDefaultIcon()}
    </motion.div>
  );
});
TreeIcon.displayName = 'TreeIcon';

export type TreeLabelProps = HTMLAttributes<HTMLSpanElement>;

export const TreeLabel = React.memo(({ className, ...props }: TreeLabelProps) => {
  const { selectedIds } = useTreeContext();
  const { nodeId } = useTreeNode();
  const isSelected = selectedIds.includes(nodeId);
  
  return (
    <span className={cn(
      'flex-1 truncate text-sm font-bold tracking-tight transition-colors', 
      isSelected ? "text-white" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]",
      className
    )} {...props} />
  );
});
TreeLabel.displayName = 'TreeLabel';
