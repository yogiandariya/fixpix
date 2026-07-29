import React, { useState, useMemo, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Menu as MenuIcon, 
  X, 
  BookOpen, 
  Grid, 
  List,
  Sparkles,
  ChevronRight,
  Clock,
  ArrowRight,
  Database,
  Zap,
  Palette,
  Layers,
  Shield,
  FileText
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { apiEndpoints } from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Input } from '../components/ui/input';
import { 
  TreeProvider, 
  TreeView, 
  TreeNode, 
  TreeNodeTrigger, 
  TreeNodeContent, 
  TreeExpander, 
  TreeIcon, 
  TreeLabel 
} from '../components/ui/tree';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogData';
import BlogCard from '../components/blog/BlogCard';
import { BlogSkeletonGrid } from '../components/blog/BlogSkeleton';
import { cn } from '../lib/utils';

const FILTER_CHIPS = [
  { id: 'root', name: 'All Topics', icon: Grid },
  { id: 'restoration', name: 'Restoration', icon: Database },
  { id: 'enhancement', name: 'Enhancement', icon: Zap },
  { id: 'creative', name: 'Creative AI', icon: Palette },
  { id: 'workflows', name: 'Pro Workflows', icon: Layers },
  { id: 'platform', name: 'Platform', icon: Shield },
];

const BlogIndex = () => {
  const { user, isElite, isPro, plan, isSubscribed, isLoadingAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('root');
  const [viewMode, setViewMode] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
    
    // Set loading to false as data is static
    setIsLoading(false);

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSubscribed]);

  // Filter posts based on search and tree selection
  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS;
    
    // Category Filter
    if (selectedCategory !== 'root') {
      posts = posts.filter(p => p.id === selectedCategory || p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Search Query
    if (searchQuery) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.metaDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return posts;
  }, [searchQuery, selectedCategory]);

  // Recursive Category Node Component
  const CategoryNode = useMemo(() => {
    const Node = ({ categoryId, level = 0, isLast = false }) => {
      const category = BLOG_CATEGORIES[categoryId];
      if (!category) return null;
      
      const hasChildren = category.children && category.children.length > 0;
      
      // Icon mapping
      const getIcon = (id) => {
        switch(id) {
          case 'root': return <Grid className="h-4 w-4" />;
          case 'restoration': return <Database className="h-4 w-4 text-orange-500" />;
          case 'enhancement': return <Zap className="h-4 w-4 text-yellow-500" />;
          case 'creative': return <Palette className="h-4 w-4 text-pink-500" />;
          case 'workflows': return <Layers className="h-4 w-4 text-indigo-500" />;
          case 'platform': return <Shield className="h-4 w-4 text-emerald-500" />;
          default: return <FileText className="h-4 w-4 text-[var(--text-tertiary)]" />;
        }
      };

      return (
        <TreeNode nodeId={categoryId} level={level} isLast={isLast}>
          <TreeNodeTrigger className={cn(
            "rounded-xl mx-0 my-0.5 relative transition-all duration-300",
            selectedCategory === categoryId 
              ? "bg-[var(--accent-soft)]/50 text-[var(--accent)]" 
              : "hover:bg-[var(--fill-tertiary)]/50"
          )}>
            {selectedCategory === categoryId && (
              <motion.div 
                layoutId="sidebar-indicator"
                className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--accent)] rounded-r-full"
              />
            )}
            <TreeExpander hasChildren={hasChildren} />
            <TreeIcon icon={getIcon(categoryId)} hasChildren={hasChildren} />
            <TreeLabel className="font-bold text-sm">
              {category.name}
            </TreeLabel>
          </TreeNodeTrigger>
          {hasChildren && (
            <TreeNodeContent hasChildren={hasChildren}>
              {category.children.map((childId, index) => (
                <Node 
                  key={childId} 
                  categoryId={childId} 
                  level={level + 1} 
                  isLast={index === category.children.length - 1} 
                />
              ))}
            </TreeNodeContent>
          )}
        </TreeNode>
      );
    };
    Node.displayName = 'CategoryNode';
    return Node;
  }, [selectedCategory]);

  // Calculate items that should be expanded during search
  const searchExpandedIds = useMemo(() => {
    if (!searchQuery) return ["root", "restoration", "creative"];
    
    const expanded = new Set(["root"]);
    const query = searchQuery.toLowerCase();

    // Helper to find path to items matching search
    const findMatches = (catId, currentPath = []) => {
      const cat = BLOG_CATEGORIES[catId];
      if (!cat) return;

      const isMatch = cat.name.toLowerCase().includes(query) || 
                     catId.toLowerCase().includes(query);
      
      if (isMatch) {
        currentPath.forEach(pathId => expanded.add(pathId));
      }

      if (cat.children) {
        cat.children.forEach(childId => findMatches(childId, [...currentPath, catId]));
      }
    };

    findMatches("root");
    return Array.from(expanded);
  }, [searchQuery]);

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col selection:bg-[var(--accent)] selection:text-white">
      <Navbar />
      
      <motion.div 
        initial="hidden"
        animate="show"
        className="flex-1 flex pt-32 lg:pt-40 max-w-[1800px] mx-auto w-full px-6 md:px-12 lg:px-20 gap-16"
      >
        
        {/* iOS Sidebar */}
        <motion.aside 
          variants={itemVariants}
          initial={false}
          animate={{ width: isSidebarOpen ? 340 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className="hidden lg:flex flex-col h-[calc(100vh-160px)] sticky top-32 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-[3rem] overflow-hidden shadow-sm shadow-black/5"
        >
          <div className="p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-3">
                <BookOpen size={24} strokeWidth={2.5} className="text-[var(--accent)]" /> Library
              </h2>
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} 
                className="p-3 rounded-2xl bg-[var(--fill-tertiary)]/50 text-[var(--text-secondary)] hover:bg-[var(--fill-tertiary)] hover:text-[var(--text-primary)] transition-all"
              >
                {viewMode === 'grid' ? <List size={20} strokeWidth={2.5} /> : <Grid size={20} strokeWidth={2.5} />}
              </button>
            </div>
            
            <div className="relative mb-10 group">
              <Search size={18} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
              <Input 
                placeholder="Search resources..." 
                className="pl-12 h-12 bg-transparent border-[var(--border-subtle)] focus-visible:ring-[var(--accent-soft)] rounded-2xl placeholder:text-[var(--text-secondary)]/50 font-bold text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar -mx-3 px-3">
              <TreeProvider 
                key={searchExpandedIds.join(',')}
                defaultExpandedIds={searchExpandedIds}
                selectedIds={[selectedCategory]}
                onSelectionChange={(ids) => {
                  if (ids.length > 0) setSelectedCategory(ids[0]);
                }}
                showLines={false}
                indent={20}
              >
                <TreeView>
                   <CategoryNode categoryId="root" />
                </TreeView>
              </TreeProvider>
            </div>
            
            {!isElite && (
                <div className="mt-10 pt-8 border-t border-[var(--border-subtle)]">
                    <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-white shadow-xl shadow-[var(--accent)]/20">
                        <h4 className="text-[14px] font-black mb-1.5 uppercase tracking-tighter">Pro Assets</h4>
                        <p className="text-[11px] opacity-90 mb-5 font-bold leading-relaxed">Unlock 50+ premium AI models and priority processing.</p>
                        <Link to="/app/pricing" className="text-[11px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-5 py-3 rounded-full hover:bg-white/30 transition-all inline-block w-full text-center">Upgrade Now</Link>
                    </div>
                </div>
            )}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 pb-40 overflow-hidden">
          <motion.header variants={itemVariants} className="mb-16">
            <div className="flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.5em] text-[var(--accent)] mb-8 opacity-90 drop-shadow-sm">
              <Sparkles size={18} strokeWidth={2.5} className="animate-pulse" /> MASTER FIXPIX AI
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[var(--text-primary)] tracking-tighter mb-10 leading-[0.95]">
              {selectedCategory === 'root' ? 'All Guides' : BLOG_CATEGORIES[selectedCategory]?.name}
            </h1>
            <p className="text-[var(--text-secondary)] text-xl md:text-2xl font-medium max-w-3xl leading-relaxed opacity-80 mb-12">
              Comprehensive step-by-step tutorials and technical deep-dives into the professional neural frameworks powering the FixPix ecosystem.
            </p>

            <div className="flex items-center gap-3 overflow-x-auto pb-6 hide-scrollbar -mx-2 px-2">
              {FILTER_CHIPS.map((chip) => (
                <motion.button
                  key={chip.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCategory(chip.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border",
                    selectedCategory === chip.id
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]/40 -translate-y-1"
                      : "bg-[var(--surface)] border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--accent)]/30 hover:text-[var(--text-primary)]"
                  )}
                >
                  <chip.icon size={14} strokeWidth={2.5} />
                  {chip.name}
                </motion.button>
              ))}
            </div>
          </motion.header>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BlogSkeletonGrid viewMode={viewMode} />
              </motion.div>
            ) : filteredPosts.length > 0 ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "grid gap-6",
                      viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}
                  >
                   {filteredPosts.map((post) => (
                      <BlogCard key={post.id} post={post} viewMode={viewMode} />
                   ))}
                  </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 text-center bg-[var(--surface)] border border-dashed border-[var(--border-subtle)] rounded-[4rem]"
              >
                 <div className="w-24 h-24 rounded-[2.5rem] bg-[var(--fill-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] mb-8">
                    <Search size={40} strokeWidth={2.5} />
                 </div>
                 <h2 className="text-3xl font-black text-[var(--text-primary)] mb-3">No matching guides found</h2>
                 <p className="text-[var(--text-secondary)] text-sm md:text-base lg:text-lg font-medium opacity-60">Try broadening your search or selecting a different category.</p>
                 <button onClick={() => {setSearchQuery(''); setSelectedCategory('root');}} className="mt-10 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-[var(--accent-soft)]">
                    Clear All Filters <X size={20} strokeWidth={2.5} />
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>

      <Footer />
    </div>
  );
};

export default BlogIndex;
