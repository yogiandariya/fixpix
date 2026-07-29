import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EnterClaim from './components/EnterClaim';
import ScreenshotUpload from './components/ScreenshotUpload';
import ArticleLink from './components/ArticleLink';
import LiveNews from './components/LiveNews';
import History from './components/History';
import TrendingNow from './components/TrendingNow';

const tabs = ["Enter Claim", "Screenshot", "Article Link", "Live News"];

// 🚀 Memoized Hero for performance
const NewsHero = React.memo(() => (
  <section style={{ paddingTop: '100px', paddingBottom: '8px' }}>
    <div className="fixpix-container text-center">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 999,
          backgroundColor: 'var(--accent-soft)', border: '1px solid var(--border-subtle)',
          color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          marginBottom: 24,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent)' }} className="animate-pulse" />
        Live Intelligence Grid
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.03em',
          marginBottom: 24, lineHeight: 1.1,
        }}
      >
        Global News Intelligence
      </motion.h1>
    </div>
  </section>
));

const AiNewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Enter Claim");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleTrendClick = (topic: string) => {
    setActiveTab("Enter Claim");
    localStorage.setItem('pending_claim', topic);
    window.dispatchEvent(new Event('claim_updated'));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', fontFamily: 'inherit', display: 'flex', flexDirection: 'column' as const, paddingTop: 'env(safe-area-inset-top)' }}>
      <Navbar />
      
      <main className="flex-1 w-full pb-24 overflow-x-hidden">
        
        <NewsHero />

        {/* --- 🚀 REAL-TIME TREND DETECTOR --- */}
        <section className="mb-12">
          <div className="fixpix-container">
            <TrendingNow onTrendClick={handleTrendClick} />
          </div>
        </section>

        {/* --- Segmented Tab Control (iOS Style) --- */}
        <section className="flex justify-center mb-10 px-4 relative z-30 overflow-x-hidden">
          <div className="fixpix-container flex justify-center">
            <div style={{
              display: 'flex', padding: 4, borderRadius: 999,
              backgroundColor: 'var(--fill-secondary)', border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}>
              <div className="flex gap-1 min-w-max overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '10px 24px', fontSize: 14, fontWeight: 600, borderRadius: 999,
                      whiteSpace: 'nowrap' as const, border: 'none', cursor: 'pointer',
                      transition: 'all 200ms ease',
                      ...(activeTab === tab
                        ? { backgroundColor: 'var(--surface)', color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
                        : { backgroundColor: 'transparent', color: 'var(--text-tertiary)' }
                      ),
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="fixpix-container min-h-[420px] md:min-h-[600px] relative z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full gpu-accelerated"
            >
              {activeTab === 'Enter Claim' && <EnterClaim />}
              {activeTab === 'Screenshot' && <ScreenshotUpload />}
              {activeTab === 'Article Link' && <ArticleLink />}
              {activeTab === 'Live News' && <LiveNews />}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default AiNewsPage;
