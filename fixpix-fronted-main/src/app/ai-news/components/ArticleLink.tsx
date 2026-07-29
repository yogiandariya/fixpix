import React, { useState, useEffect } from "react";
import { useFactCheck } from "../hooks/useFactCheck";
import { FactCheckBadge } from "./FactCheckBadge";
import { motion, AnimatePresence } from "framer-motion";
import ReasoningFlow from "./ReasoningFlow";
import SourceCard from "./SourceCard";
import ImpactCard from './ImpactCard';
import { ShieldAlert, ShieldCheck, Globe, ArrowRight, Brain, Activity, Zap, Link, AlertTriangle, BarChart3, CheckCircle, FileText, Info, Search, Share2 } from "lucide-react";
import ShareModal from './ShareModal';

// 🛡️ DATA NORMALIZER: Ensures unbreakable UI by providing safe defaults
function normalizeResponse(data: any) {
  if (!data) return null;
  return {
    verdict: data.verdict || data.status || "UNVERIFIED",
    confidence: data.confidence || 50,
    summary: data.summary || "No executive summary available for this article extraction.",
    headline: data.headline || data.article_metadata?.title || "Intelligence Report",
    key_findings: data.key_findings || data.key_points || [],
    reasoning: data.detailed_reasoning || "Deep analysis synthesis currently unavailable. Manual review of source text suggested.",
    context: data.real_world_context || "",
    misinformation: data.misinformation_analysis || "",
    sources: data.sources || [],
    url: data.url || data.article_metadata?.url || "",
    impact: data.impact || null,
    reasoning_flow: data.reasoning_flow || []
  };
}

// 🧱 UI Card Helper
const OSINTCard = ({ title, icon: Icon, children, className = "" }: { title?: string, icon?: any, children: React.ReactNode, className?: string }) => (
  <div style={{
    backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
    borderRadius: 24, padding: 24, transition: 'box-shadow 200ms ease',
  }} className={`hover:shadow-md ${className}`}>
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
        {Icon && <Icon size={15} style={{ color: 'var(--accent)' }} />}
        <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</h3>
      </div>
    )}
    {children}
  </div>
);

// 🛡️ CRASH PROTECTION: Component-level Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 bg-rose-50 border-2 border-dashed border-rose-200 rounded-[2rem] text-center max-w-2xl mx-auto">
          <AlertTriangle className="mx-auto text-rose-500 mb-4" size={48} />
          <h2 className="text-xl font-black text-rose-900 tracking-tighter italic mb-2">Interface Engine Stalled</h2>
          <p className="text-rose-700 font-medium opacity-80 max-w-md mx-auto text-sm leading-relaxed">
            A critical rendering error occurred. The backend returned valid data, but the UI failed to synthesize the intelligence report.
          </p>
          <button onClick={() => window.location.reload()} className="mt-6 px-10 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg text-[10px] uppercase tracking-widest">
            Reinitialize Engine
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ArticleLink() {
  const [url, setUrl] = useState("");
  const { factCheckLink, isLoading, result: rawResult, clearResult } = useFactCheck();
  const [showProgress, setShowProgress] = useState(false);
  const [step, setStep] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const result = normalizeResponse(rawResult);

  const steps = [
    "Crawling Target URL...",
    "Extracting Full-Text DNA...",
    "Identifying Media & Sources...",
    "Cross-Referencing Narratives...",
    "Building Intelligence Report..."
  ];

  useEffect(() => {
    if (url.startsWith("http") && (url.includes(".com") || url.includes(".org") || url.includes(".net") || url.includes(".edu"))) {
        const timer = setTimeout(() => {
            if (!isLoading && !rawResult) factCheckLink(url, 'deep');
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [url, isLoading, rawResult, factCheckLink]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setShowProgress(true);
      setStep(0);
      interval = setInterval(() => {
        setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setShowProgress(false);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleReset = () => {
    setUrl("");
    clearResult();
  };

  return (
    <div className="w-full">
      {!result ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 min-h-[400px] flex flex-col justify-center">
          <div className="text-center mb-4">
            <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>Article Intelligence</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Verify any article via URL. Deep OSINT extraction active by default.</p>
          </div>
          <div className="relative group">
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 28, color: 'var(--text-tertiary)', pointerEvents: 'none' }}><Globe className="w-5 h-5" /></div>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://news-outlet.com/article" style={{
              width: '100%', fontSize: 17, height: 80,
              backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 24, paddingLeft: 64, paddingRight: 32,
              color: 'var(--text-primary)', fontWeight: 600,
              outline: 'none', transition: 'all 200ms ease',
            }} disabled={isLoading} onKeyDown={(e) => e.key === 'Enter' && factCheckLink(url, 'deep')} />
          </div>
          <div className="text-center">
             <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
               <Zap size={14} style={{ color: 'var(--accent)' }} className="animate-pulse" />
               Paste URL and wait 800ms for auto-analysis
             </p>
          </div>
          <AnimatePresence>
              {showProgress && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                    <div className="px-5 py-3 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{steps[step]}</span>
                    </div>
                </motion.div>
              )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20">
          <ErrorBoundary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
               {/* LEFT: MAIN INTELLIGENCE (2 COLUMNS) */}
               <div className="lg:col-span-2 space-y-5">
                  <OSINTCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none"><ShieldCheck size={140} /></div>
                    <div className="flex justify-between items-center mb-6">
                       <FactCheckBadge status={result.verdict} />
                       {result.url && (
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg text-[10px] font-bold uppercase transition-colors">
                           <Link size={12} /> View Source
                        </a>
                       )}
                    </div>
                    <h2 className="text-[20px] sm:text-[24px] font-black text-slate-900 leading-tight italic tracking-tighter mb-4">
                      {result.headline}
                    </h2>
                    <p className="text-[14px] font-bold text-slate-600 leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-1">
                       {result.summary}
                    </p>
                  </OSINTCard>

                  {result.key_findings.length > 0 && (
                    <OSINTCard title="Extraction & Evidence Highlights" icon={Brain}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {result.key_findings.map((item: string, i: number) => (
                          <div key={i} className="flex gap-3 items-start group">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                            <p className="text-[13px] font-bold text-slate-700 leading-snug italic group-hover:text-indigo-600 transition-colors">"{item}"</p>
                          </div>
                        ))}
                      </div>
                    </OSINTCard>
                  )}

                  <OSINTCard title="In-Depth Analytical Synthesis" icon={FileText}>
                     <p className="text-[13px] text-slate-700 leading-relaxed font-medium opacity-95">{result.reasoning}</p>
                     {result.reasoning_flow.length > 0 && (
                       <div className="mt-6 pt-4 border-t border-slate-50 overflow-x-auto no-scrollbar">
                          <ReasoningFlow flow={result.reasoning_flow} />
                       </div>
                     )}
                  </OSINTCard>

                  {result.misinformation && (
                    <OSINTCard title="Propagandistic Risk Analysis" icon={ShieldAlert} className="bg-rose-50/30 border-rose-100">
                       <p className="text-[12px] font-bold text-rose-900 leading-relaxed italic opacity-80">{result.misinformation}</p>
                    </OSINTCard>
                  )}
               </div>

               {/* RIGHT: PANEL (1 COLUMN) */}
               <div className="space-y-5">
                  <OSINTCard title="Intelligence Context" icon={BarChart3}>
                     <div className="space-y-4">
                        <div className="flex items-end gap-2 mb-2">
                           <span className="text-[48px] font-black text-slate-900 leading-none italic">{result.confidence}<span className="text-indigo-500 opacity-40 text-xl">%</span></span>
                           <div className="flex-1 h-3 bg-slate-50 rounded-full mb-1 border border-slate-50 overflow-hidden p-0.5">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} className={`h-full rounded-full ${result.confidence > 70 ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                           </div>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 italic">Synthesized via triple-layer aggressive extraction engine.</p>
                     </div>
                  </OSINTCard>

                  {result.context && (
                    <OSINTCard title="Reality Baseline" icon={Globe} className="bg-[#111827] text-white border-slate-800">
                       <p className="text-[13px] font-bold leading-relaxed opacity-90 italic">
                          {result.context}
                       </p>
                    </OSINTCard>
                  )}

                  <OSINTCard title="Source Corpus" icon={Link}>
                     <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 no-scrollbar">
                        {result.sources?.length > 0 ? (
                          result.sources.map((s: any, idx: number) => (
                           <a key={idx} href={s.url || s.link} target="_blank" rel="noopener noreferrer" className="block group p-3 bg-slate-50/50 hover:bg-white border border-transparent hover:border-indigo-100 rounded-xl transition-all">
                              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1 truncate">{s.source || "External Reference"}</span>
                              <h4 className="text-[12px] font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{s.title || (s.url ? s.url.substring(0, 40) : "Reference Link")}</h4>
                           </a>
                          ))
                        ) : (
                          <div className="p-4 bg-slate-50/30 rounded-xl text-center border border-dashed border-slate-100">
                            <Info size={16} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 italic">No cross-referenced link pool found.</p>
                          </div>
                        )}
                     </div>
                  </OSINTCard>

                  {result.impact && (
                    <ImpactCard 
                      impact={result.impact} 
                      why_this_matters={rawResult.why_this_matters}
                      verdict={result.verdict} 
                    />
                  )}

                  <div className="flex flex-col gap-3">
                      <button onClick={handleReset} style={{
                        width: '100%', height: 48, backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
                        borderRadius: 999, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 200ms ease', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      }} className="active:scale-95">
                        <Search size={14} /> New Extraction
                      </button>
                      <button onClick={() => setIsShareModalOpen(true)} style={{
                        width: '100%', height: 48, backgroundColor: 'var(--surface)', color: 'var(--text-primary)',
                        borderRadius: 999, fontSize: 13, fontWeight: 700,
                        border: '1px solid var(--border-subtle)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 200ms ease',
                      }} className="active:scale-95">
                        <Share2 size={14} /> Intelligence Export
                      </button>
                  </div>
               </div>
            </div>
            
            <ShareModal 
              isOpen={isShareModalOpen} 
              onClose={() => setIsShareModalOpen(false)} 
              query={result.headline}
              result={rawResult}
            />
          </ErrorBoundary>
        </motion.div>
      )}
    </div>
  );
}
