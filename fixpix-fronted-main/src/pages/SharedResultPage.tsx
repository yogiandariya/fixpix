import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, Activity, Brain, Clock, 
  MapPin, Share2, Globe, ExternalLink,
  ChevronRight, AlertCircle, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FactCheckBadge } from '@/app/ai-news/components/FactCheckBadge';
import { TrustScoreCard } from '@/app/ai-news/components/TrustScoreCard';
import ImpactCard from '@/app/ai-news/components/ImpactCard';

export default function SharedResultPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        if (!apiBase) console.warn('VITE_API_BASE_URL is not defined');
        const response = await fetch(`${apiBase}/api/fact-check/share/${id}/`);
        if (!response.ok) throw new Error('Share link invalid or expired');
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSharedData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100">
             <ShieldCheck size={32} className="text-indigo-600" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Decrypting Intelligence...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-rose-50 rounded-[2rem] mx-auto flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Share Link Expired</h1>
          <p className="text-slate-500 font-medium">The requested intelligence snapshot could not be retrieved from the FIE database.</p>
          <Link to="/ai-news" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Go to Intelligence Engine
          </Link>
        </div>
      </div>
    );
  }

  const { query, result, created_at } = data;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-indigo-100 py-12 px-4 sm:px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Public Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-5">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-14 h-14 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center border border-slate-100"
            >
               <ShieldCheck size={28} className="text-indigo-600" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1 shadow-glow italic">
                FixPix Intelligence Engine
              </h1>
              <div className="flex items-center gap-2">
                <Globe size={12} className="text-indigo-500" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Public verification snapshot</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm glass-premium">
            <Clock size={14} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              SNAPSHOT: {new Date(created_at).toLocaleDateString()}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* The Claim */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <TrendingUp size={200} strokeWidth={1} />
              </div>
              
              <div className="flex items-center gap-5 mb-10">
                <FactCheckBadge status={result.verdict} />
                <div className="h-8 w-px bg-slate-100" />
                <div className="flex items-center gap-2">
                   <Activity size={12} className="text-indigo-500 animate-pulse" />
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Verified Intelligence</p>
                </div>
              </div>

              <div className="space-y-8 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100 italic">
                    FIE Analysis
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight italic">
                  "{query}"
                </h2>
                <div className="pt-8 border-t border-slate-50">
                  <p className="text-lg font-black text-slate-900 leading-[1.3] text-left">
                    <span className="text-indigo-600 uppercase tracking-tighter text-sm mr-2 opacity-50 font-black not-italic">Analysis:</span>
                    {result.summary || result.explanation || result.final_explanation}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Why This Matters Impact Analysis (Feature 17) */}
            {(result.impact || (result.why_this_matters && result.why_this_matters.length > 0)) && (
              <div className="mt-8">
                <ImpactCard 
                 impact={result.impact} 
                 why_this_matters={result.why_this_matters}
                 verdict={result.verdict || ''} 
                />
              </div>
            )}

            {/* Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 h-full text-left">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      <Brain size={18} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Executive Summary</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-bold opacity-80">
                    {result.explanations?.medium || result.summary || result.explanation}
                  </p>
               </div>

               <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group text-left">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none rotate-12 text-indigo-400">
                    <ShieldCheck size={120} strokeWidth={1} />
                  </div>
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 italic">Reality Context</h3>
                  <p className="text-sm font-bold leading-relaxed text-white opacity-90 relative">
                    {result.truth_context?.[0] || result.summary || result.explanation}
                  </p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Trust Score */}
            <TrustScoreCard 
              score={result.trust_score || result.confidence || 0}
              level={result.trust_level || (result.confidence > 70 ? 'HIGH' : result.confidence > 40 ? 'MEDIUM' : 'LOW')}
              reasons={result.trust_reasons || result.trust_reason || ["AI-driven reliability verification"]}
            />

            {/* Growth Footer */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-10 rounded-[2.5rem] text-white shadow-xl text-left">
               <h3 className="text-sm font-black uppercase tracking-widest mb-4 italic">Verify Anything</h3>
               <p className="text-xs text-indigo-100 font-medium mb-8 leading-relaxed">
                 Use FixPix Intelligence Engine to verify global geopolitical claims with high-fidelity OSINT signals.
               </p>
               <Link to="/ai-news" className="group flex items-center justify-between w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all font-black text-[10px] uppercase tracking-widest">
                 Start Verification
                 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
