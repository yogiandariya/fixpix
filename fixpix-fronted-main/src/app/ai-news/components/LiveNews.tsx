import React, { useEffect, useMemo } from "react";
import { NewsList } from "./NewsList";
import { useFactCheck } from "../hooks/useFactCheck";
import { RefreshCw, Radio, Activity, Globe, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveNews() {
  const { fetchLiveNews, news, isLoading, loadingAI, error } = useFactCheck();
  const [selectedCountry, setSelectedCountry] = React.useState("global");

  const countries = useMemo(() => [
    { id: "global", name: "World", flag: "🌐" },
    { id: "in", name: "India", flag: "🇮🇳" },
    { id: "us", name: "USA", flag: "🇺🇸" },
    { id: "economy", name: "Economy", flag: "📈" },
    { id: "conflict", name: "Conflict", flag: "⚔️" }
  ], []);

  useEffect(() => {
    fetchLiveNews(10, false, selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-6 w-full md:w-auto">
          <div className="space-y-1">
            <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Live Intelligence <span style={{ color: 'var(--accent)' }}>Feed</span>
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)' }} className="animate-pulse" />
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>OSINT Engine V4.0 • Real-Time Signal Processing</p>
            </div>
          </div>
          
          {/* iOS Style Country Selector */}
          <div style={{ display: 'inline-flex', padding: 6, backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 20, overflow: 'auto' }} className="w-full md:w-auto hide-scrollbar touch-momentum">
            <div className="flex gap-1.5">
              {countries.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountry(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                    borderRadius: 16, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' as const,
                    border: 'none', cursor: 'pointer', transition: 'all 200ms ease',
                    ...(selectedCountry === c.id
                      ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }
                      : { backgroundColor: 'transparent', color: 'var(--text-secondary)' }
                    ),
                  }}
                >
                  <span style={{ fontSize: 14 }}>{c.flag}</span>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => fetchLiveNews(10, true, selectedCountry)}
          disabled={isLoading}
          style={{
            height: 48, borderRadius: 999, padding: '0 28px',
            backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)', fontWeight: 700, fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer', transition: 'all 200ms ease',
          }}
          className="active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={`${isLoading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 32, padding: 48, display: 'flex', flexDirection: 'column' as const,
              alignItems: 'center', textAlign: 'center' as const, gap: 24,
            }}
          >
            <div style={{ height: 64, width: 64, backgroundColor: 'var(--accent-soft)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Radio className="w-8 h-8 animate-pulse" style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ maxWidth: 280 }}>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 8 }}>Signal Degraded</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{error}</p>
            </div>
            <button 
              onClick={() => fetchLiveNews(10, true, selectedCountry)}
              style={{
                padding: '12px 32px', backgroundColor: 'var(--accent)', color: 'white',
                borderRadius: 999, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              Retry Connection
            </button>
          </motion.div>
        ) : !isLoading && news.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center' as const, padding: '96px 0',
              backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--border-subtle)',
              borderRadius: 24,
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 8 }}>No Signals Detected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 280, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Searching for intelligence packets in {countries.find((c: any) => c.id === selectedCountry)?.name || selectedCountry}.
            </p>
            <button 
              onClick={() => fetchLiveNews(10, true, selectedCountry)} 
              style={{
                padding: '14px 40px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
                borderRadius: 999, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                transition: 'all 200ms ease', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
              className="active:scale-95"
            >
              Force Sync
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={selectedCountry}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, padding: '0 4px' }}>
              <div style={{ padding: '4px 12px', backgroundColor: 'var(--accent-soft)', borderRadius: 999, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={10} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                   {countries.find((c: any) => c.id === selectedCountry)?.name || selectedCountry} Intelligence Hub
                </span>
              </div>
              <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', flex: 1 }} />
            </div>
            <NewsList news={news} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
