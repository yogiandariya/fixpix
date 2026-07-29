import React, { useRef, useState } from "react";
import { UploadCloud, FileImage, CheckCircle, AlertCircle, ShieldCheck, Globe, ArrowRight, Brain, Newspaper, Activity, Sparkles, Zap, Search, ShieldAlert, BarChart3, TrendingUp, Info, FileText, Share2, Link } from "lucide-react";
import { useFactCheck } from "../hooks/useFactCheck";
import { FactCheckBadge } from "./FactCheckBadge";
import { motion, AnimatePresence } from "framer-motion";
import ModeToggle from "./ModeToggle";
import ClaimBreakdown from "./ClaimBreakdown";
import ConfidenceExplainer from "./ConfidenceExplainer";
import VisualTrustMap from "./VisualTrustMap";
import { TrustScoreCard } from "./TrustScoreCard";
import ImpactCard from './ImpactCard';
import ReasoningFlow from "./ReasoningFlow";
import SourceCard from "./SourceCard";
import ShareModal from './ShareModal';

// 🛡️ DATA NORMALIZER: Ensures unbreakable UI by providing safe defaults
function normalizeResponse(data: any) {
  if (!data) return null;
  return {
    verdict: data.verdict || data.status || "UNVERIFIED",
    confidence: data.confidence || 50,
    summary: data.summary || "No executive summary available for this visual intelligence scan.",
    headline: data.headline || data.summary || "Visual Intelligence Report",
    key_findings: data.key_findings || data.key_points || [],
    reasoning: data.detailed_reasoning || "OCR synthesis and deep analysis flow currently unavailable.",
    context: data.real_world_context || "",
    misinformation: data.misinformation_analysis || "",
    sources: data.sources || [],
    extractedText: data.extractedText || "",
    mode: data.mode || 'fast',
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

export default function ScreenshotUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { factCheckImage, isLoading, result: rawResult, mode, setMode, clearResult } = useFactCheck();
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const result = normalizeResponse(rawResult);

  const handleFile = (file: File) => {
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp")) {
      const form = new FormData();
      form.append("image", file);
      factCheckImage(form, mode);
    } else {
      setError("Please upload a valid image file (PNG, JPG, or WEBP).");
    }
  };
  
  const handleReset = () => {
    clearResult();
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20 space-y-5">
            
            {/* OCR DNA Card */}
            {result.extractedText && (
                <div className="px-6 py-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Visual DNA Extraction:</span>
                    </div>
                    <p className="text-[13px] font-bold text-indigo-900 italic leading-relaxed truncate-2-lines">
                        "{result.extractedText}"
                    </p>
                </div>
            )}

            {/* 🧱 3-COLUMN OSINT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
               {/* LEFT: MAIN INTELLIGENCE (2 COLUMNS) */}
               <div className="lg:col-span-2 space-y-5">
                  <OSINTCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none"><ShieldCheck size={140} /></div>
                    <div className="flex justify-between items-center mb-6">
                       <FactCheckBadge status={result.verdict} />
                       <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</span>
                        <span className="text-sm font-black text-slate-900">{result.confidence}%</span>
                      </div>
                    </div>
                    <h2 className="text-[20px] sm:text-[24px] font-black text-slate-900 leading-tight italic tracking-tighter mb-4">
                      {result.headline}
                    </h2>
                    <p className="text-[14px] font-bold text-slate-600 leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-1">
                       {result.summary}
                    </p>
                  </OSINTCard>

                  {result.key_findings.length > 0 && (
                    <OSINTCard title="Signal Highlights" icon={Brain}>
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

                  <OSINTCard title="OCR Synthesis & Investigation" icon={FileText}>
                     <p className="text-[13px] text-slate-700 leading-relaxed font-medium opacity-95">{result.reasoning}</p>
                     {result.reasoning_flow.length > 0 && (
                       <div className="mt-6 pt-4 border-t border-slate-50 overflow-x-auto no-scrollbar">
                          <ReasoningFlow flow={result.reasoning_flow} />
                       </div>
                     )}
                  </OSINTCard>

                  {result.misinformation && (
                    <OSINTCard title="Propagation Risk" icon={ShieldAlert} className="bg-rose-50/30 border-rose-100">
                       <p className="text-[12px] font-bold text-rose-900 leading-relaxed italic opacity-80">{result.misinformation}</p>
                    </OSINTCard>
                  )}
               </div>

               {/* RIGHT: PANEL (1 COLUMN) */}
               <div className="space-y-5">
                  <OSINTCard title="Final Consensus" icon={BarChart3}>
                     <div className="space-y-4">
                        <div className="flex items-end gap-2 mb-2">
                           <span className="text-[48px] font-black text-slate-900 leading-none italic">{result.confidence}<span className="text-indigo-500 opacity-40 text-xl">%</span></span>
                           <div className="flex-1 h-3 bg-slate-50 rounded-full mb-1 border border-slate-50 overflow-hidden p-0.5">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} className={`h-full rounded-full ${result.confidence > 70 ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                           </div>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 italic">Extracted via OCR vision and mapped to global evidence pools.</p>
                     </div>
                  </OSINTCard>

                  {result.context && (
                    <OSINTCard title="Reality Baseline" icon={Globe} className="bg-[#111827] text-white">
                       <p className="text-[13px] font-bold leading-relaxed opacity-90 italic">{result.context}</p>
                    </OSINTCard>
                  )}

                  <OSINTCard title="Reference Pool" icon={Link}>
                     <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
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
                            <p className="text-[11px] font-bold text-slate-400 italic">No cross-referenced visual evidence links found.</p>
                          </div>
                        )}
                     </div>
                  </OSINTCard>

                  <div className="flex flex-col gap-3 pt-2">
                      <button onClick={handleReset} style={{
                        width: '100%', height: 48, backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
                        borderRadius: 999, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 200ms ease', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      }} className="active:scale-95">
                        <Search size={14} /> New Visual Scan
                      </button>
                      <button onClick={() => setIsShareModalOpen(true)} style={{
                        width: '100%', height: 48, backgroundColor: 'var(--surface)', color: 'var(--text-primary)',
                        borderRadius: 999, fontSize: 13, fontWeight: 700,
                        border: '1px solid var(--border-subtle)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 200ms ease',
                      }} className="active:scale-95">
                        <Share2 size={14} /> Share Intelligence
                      </button>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 min-h-[400px] flex flex-col justify-center">
            <div className="text-center mb-4">
              <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>Visual Intelligence</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Extract and verify intelligence from screenshots via OCR bypass.</p>
            </div>
            <div onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop} style={{
              width: '100%', minHeight: 300, border: '2px dashed', borderRadius: 24, padding: 48,
              display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
              textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden', transition: 'all 300ms ease',
              borderColor: dragActive ? 'var(--accent)' : 'var(--border-subtle)',
              backgroundColor: dragActive ? 'var(--accent-soft)' : 'var(--surface)',
            }}>
              <div style={{ height: 64, width: 64, backgroundColor: 'var(--accent)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><UploadCloud className="w-8 h-8 text-white" /></div>
              <div className="max-w-sm space-y-4">
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Upload Screenshot</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Drag and drop news posts or article snippets for instant OSINT verification.</p>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} style={{
                  width: '100%', height: 52, backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
                  borderRadius: 999, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                  transition: 'all 200ms ease',
                }} className="disabled:opacity-50">
                  {isLoading ? "Analyzing Visual DNA..." : "Select Image File"}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 italic">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
               <ModeToggle mode={mode} onChange={setMode} disabled={isLoading} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        query={result?.headline || "Visual Intelligence"}
        result={rawResult}
      />
    </div>
  );
}
