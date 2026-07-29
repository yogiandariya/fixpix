import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Share2, MessageSquare, Twitter, Facebook, Linkedin } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { BLOG_POSTS } from '../data/blogData';
import { 
  BlogHero, 
  BeforeAfterSection, 
  HowToStep, 
  FAQAccordion, 
  CTASection,
  BenefitCard
} from '../components/blog/BlogComponents';

const BlogPost = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (post) {
      document.title = post.seoTitle;
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent)] z-[100] origin-left"
        style={{ scaleX }}
      />
      
      <BlogHero 
        title={post.title}
        category={post.category}
        date={post.date}
        author={post.author}
        image={post.heroImage}
      />

      <main className="max-w-4xl mx-auto px-6 pb-32">
        {/* Intro */}
        <section className="prose prose-invert max-w-none pt-12">
          <p className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed italic border-l-4 border-[var(--accent)] pl-6 mb-12">
            {post.introduction.problem} {post.introduction.solution}
          </p>
          
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
             What is {post.title.split(':')[0]}?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm md:text-base lg:text-lg leading-relaxed mb-6">
            {post.whatIs.simple}
          </p>
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] mb-12">
            <h4 className="text-[10px] uppercase tracking-widest font-black text-[var(--accent)] mb-3">The AI Intelligence</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {post.whatIs.aiBased}
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="my-20">
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-10">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {post.benefits.map((benefit, i) => (
              <BenefitCard key={i} text={benefit} />
            ))}
          </div>
        </section>

        {/* Interactive Comparison */}
        <BeforeAfterSection 
          original={post.beforeAfter.original}
          processed={post.beforeAfter.processed}
          label={post.beforeAfter.label}
        />

        {/* How To Section */}
        <section className="my-24">
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-12">How to Use (Step-by-Step)</h2>
          <div className="max-w-2xl">
            {post.howTo.map((step) => (
              <HowToStep 
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </section>

        {/* Real Use Cases */}
        <section className="my-24">
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-10">Real-World Examples</h2>
          <div className="grid grid-cols-1 gap-6">
            {post.realUseCases.map((useCase, index) => (
              <div key={index} className="flex gap-6 p-6 rounded-2xl bg-[var(--surface)] border-l-4 border-[var(--accent)]">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] mb-1 uppercase text-xs tracking-widest">{useCase.area}</h4>
                  <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{useCase.case}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why FixPix */}
        <section className="my-24 p-8 rounded-3xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/5">
             <h2 className="text-3xl font-black text-[var(--text-primary)] mb-6">Why FixPix is Better</h2>
             <p className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed font-medium italic">
                "{post.whyBetter}"
             </p>
        </section>

        {/* Pro Tips */}
        <section className="my-24">
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-10">Tips for Best Results</h2>
          <ul className="space-y-4">
            {post.tips.map((tip, i) => (
              <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="my-24 pt-24 border-t border-[var(--border-subtle)]">
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={post.faqs} />
          </div>
        </section>

        {/* CTA */}
        <CTASection toolId={post.id} />

        {/* Share & Back */}
        <div className="mt-20 pt-10 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-10">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Learning Hub
          </Link>
          
          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Share this Guide</span>
            <div className="flex gap-3">
              {[Twitter, Facebook, Linkedin, Share2].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
