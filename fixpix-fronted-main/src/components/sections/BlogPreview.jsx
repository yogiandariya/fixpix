import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../data/blogData';

const BlogPreview = () => {
    // Get the latest 3 posts
    const displayPosts = BLOG_POSTS.slice(0, 3);

    return (
        <section className="py-14 md:py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4" 
                            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                            <Sparkles size={12} />
                            Master FixPix AI
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-[var(--text-primary)] leading-tight mb-2">
                            Neural Intelligence Guides
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] font-medium tracking-tight">
                            Deep dives into the neural frameworks and professional workflows.
                        </p>
                    </div>
                    <div>
                        <Link to="/blog" 
                            className="group flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold transition-all duration-300 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--fill-tertiary)] hover:shadow-sm"
                        >
                            Explore Library
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                    {displayPosts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative rounded-3xl overflow-hidden transition-all duration-500 flex flex-col h-full bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 hover:shadow-2xl hover:shadow-[var(--accent)]/5"
                        >
                            {/* Card Header/Image */}
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img 
                                    src={post.heroImage} 
                                    alt={post.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-7 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-[var(--text-tertiary)]">
                                    <Clock size={12} />
                                    {post.date}
                                    <span className="w-1 h-1 rounded-full bg-[var(--border-medium)]" />
                                    <span>{post.author}</span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight leading-tight mb-3 group-hover:text-[var(--accent)] transition-colors">
                                    {post.title}
                                </h3>
                                
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-medium line-clamp-3">
                                    {post.metaDescription}
                                </p>
                                
                                <div className="mt-auto pt-6 flex items-center justify-between border-t border-[var(--border-subtle)]">
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 group/btn transition-colors text-[var(--accent)]"
                                    >
                                        Read Guide
                                        <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                    <BookOpen size={16} className="text-[var(--text-tertiary)] opacity-30" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogPreview;
