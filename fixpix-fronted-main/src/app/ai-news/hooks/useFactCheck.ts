import { useState } from "react";
import useToastStore from "../../../store/toastStore";


export const getBaseURL = () => {
  let envURL = import.meta.env.VITE_API_BASE_URL;
  
  if (!envURL) {
    console.warn("VITE_API_BASE_URL is not defined in environment");
    return "";
  }
  
  return envURL.trim().replace(/\/$/, "");
};

const API = getBaseURL();

export interface EvidenceSource {
  title: string;
  source: string;
  url: string;
  credibility: 'High' | 'Medium' | 'Low';
}

export interface FactCheckResult {
  query?: string;
  query_interpreted?: {
    original: string;
    cleaned: string;
    intent: string;
  };
  corrected_query?: string;
  verdict: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED' | 'PENDING' | 'REAL' | 'FAKE';
  confidence: number;
  confidence_label?: string;
  summary: string;
  why: string[];
  key_findings?: string[];
  truth_context: string[];
  real_context?: string[];
  misinformation_signals?: string[];
  related_real_news: string[];
  sources: {
    title: string;
    source: string;
    url: string;
    credibility: 'High' | 'Medium' | 'Low';
    snippet?: string;
  }[];
  final_explanation: string;
  // Article Intelligence specialized fields
  headline?: string;
  explanations?: {
    beginner: string;
    medium: string;
    expert: string;
  };
  key_points?: string[];
  sections?: {
    heading: string;
    content: string;
  }[];
  bias_analysis?: string;
  missing_info?: string;
  article_meta?: {
    title: string;
    author?: string;
    publish_date?: string;
    top_image?: string;
  };
  // Backward compatibility / Optional fields
  article_summary?: { heading: string; text: string }[];
  detailed_reasoning?: string[];
  evidence?: EvidenceSource[];
  contradictions?: string[];
  status?: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED' | 'PENDING' | 'REAL' | 'FAKE';
  explanation?: string;
  source_urls?: Record<string, string>;
  extractedText?: string;
  breakdown?: {
    entities: string[];
    intent: string;
    category: string;
    claim_type: string;
    keywords: string[];
  };
  confidence_breakdown?: {
    source_quality: string;
    evidence_count: number;
    contradictions: number;
    data_consistency: string;
  };
  confidence_explanation?: string;
  sources_map?: {
    name: string;
    url: string;
    domain: string;
    credibility: number;
    stance: 'support' | 'contradict' | 'neutral';
    title: string;
  }[];
  mode?: 'fast' | 'deep';
  processing_time?: string;
  trust_score?: number;
  trust_level?: 'HIGH' | 'MEDIUM' | 'LOW';
  trust_reason?: string[];
  impact?: {
    society: string[];
    politics: string[];
    economy: string[];
  };
  why_this_matters?: string[];
  reasoning_flow?: {
    type: "claim" | "evidence" | "conclusion";
    status?: "support" | "conflict";
    content: string;
  }[];
  misinformation_analysis?: string;
  real_world_context?: string;
  input_type?: 'FACTUAL CLAIM' | 'NEWS QUERY' | 'VAGUE' | 'ARTICLE / URL';
  type?: string;
  url?: string;
  article_metadata?: {
    title: string;
    url: string;
  };
}

export interface NormalizedNewsArticle {
  title: string;
  description: string;
  image?: string;
  source: string;
  publishedAt: string;
  published?: string;
  category?: string;
  factCheck: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED' | 'PENDING' | 'REAL' | 'FAKE' | 'VERIFIED';
  confidence?: number;
  summary?: string;
  url: string;
  explanation?: string;
  source_urls?: Record<string, string>;
  detailed_reasoning?: string[];
  evidence?: EvidenceSource[];
  trust_score?: number;
  trust_level?: 'HIGH' | 'MEDIUM' | 'LOW';
  trust_reason?: string[];
  impact?: {
    society: string[];
    politics: string[];
    economy: string[];
  };
  why_this_matters?: string[];
}

export function useFactCheck() {
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [news, setNews] = useState<NormalizedNewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'fast' | 'deep'>('deep');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [lastImage, setLastImage] = useState<FormData | null>(null);
  const toast = useToastStore();

  const handleFactCheckError = (e: any) => {
    console.error("Fact check error:", e);
    setError(e.message || "Something went wrong.");
    toast.error("Verification failed. Check connection");
    setResult({
      verdict: "UNVERIFIED",
      status: "UNVERIFIED",
      confidence: 0,
      summary: "We couldn't find enough reliable evidence to verify this claim.",
      why: ["No direct matches in trusted fact-check databases", "Search signals are too broad or ambiguous"],
      truth_context: ["Unable to establish reality baseline due to error."],
      related_real_news: ["No related news found during failure."],
      sources: [],
      final_explanation: e.message || "Connection error.",
      detailed_reasoning: ["The intelligence pipeline encountered a connection or processing error."],
      breakdown: {
        entities: [],
        intent: "Recovery mode active",
        category: "System",
        claim_type: "error",
        keywords: []
      }
    } as any);
  };

  const factCheck = async (text: string, selectedMode: 'fast' | 'deep' = mode) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setSuggestions([]); // Clear suggestions on search
    setLastQuery(text);
    setLastUrl(null);
    setLastImage(null);

    const loadingId = toast.loading("Searching sources...");

    try {
      const res = await fetch(`${API}/api/fact-check/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, mode: selectedMode }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `API Error: ${res.statusText}`);
      }
      
      const data = await res.json();
      setResult(data);
      
      toast.remove(loadingId);
      if (data.confidence < 40) {
        toast.warning("Low confidence result — limited sources found");
      } else {
        toast.success("Analysis complete — verdict ready");
      }
    } catch (e: any) {
      toast.remove(loadingId);
      handleFactCheckError(e);
    } finally {
      setLoading(false);
    }
  };

  const factCheckLink = async (url: string, selectedMode: 'fast' | 'deep' = mode) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setLastUrl(url);
    setLastQuery(null);
    setLastImage(null);

    const loadingId = toast.loading("Analyzing source link...");

    try {
      const res = await fetch(`${API}/api/fact-check/link/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, mode: selectedMode }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `API Error: ${res.statusText}`);
      }
      
      const data = await res.json();
      setResult(data);
      toast.remove(loadingId);
      toast.success("Analysis complete — verdict ready");
    } catch (e: any) {
      toast.remove(loadingId);
      handleFactCheckError(e);
    } finally {
      setLoading(false);
    }
  };

  const factCheckImage = async (formData: FormData, selectedMode: 'fast' | 'deep' = mode) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setLastImage(formData);
    setLastQuery(null);
    setLastUrl(null);

    const loadingId = toast.loading("Interrogating visual evidence...");

    try {
      formData.append("mode", selectedMode);
      const res = await fetch(`${API}/api/fact-check/image/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `API Error: ${res.statusText}`);
      }
      
      const data = await res.json();
      setResult(data);
      toast.remove(loadingId);
      toast.success("Visual analysis complete");
    } catch (e: any) {
      toast.remove(loadingId);
      handleFactCheckError(e);
    } finally {
      setLoading(false);
    }
  };


  const fetchSuggestions = async (q: string) => {
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`${API}/api/fact-check/suggestions/?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (e) {
      console.error("Failed to fetch suggestions:", e);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const fetchLiveNews = async (limit = 5, isRefresh = false, country = "global") => {
    setLoading(true);
    setNews([]); 
    setError(null);
    
    try {
      const randomId = Math.random().toString(36).substring(7);
      const fastRes = await fetch(`${API}/api/news/fast/?limit=${limit}&refresh=${isRefresh}&country=${country}&_=${randomId}`);
      if (!fastRes.ok) throw new Error("Failed to fetch fast news.");
      const fastData = await fastRes.json();
      setNews(fastData);
      setLoading(false); 

      setLoadingAI(true);
      const aiRes = await fetch(`${API}/api/news/fact-check-batch/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: fastData }),
      });
      
      if (aiRes.ok) {
        const verifiedData = await aiRes.json();
        setNews(verifiedData);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingAI(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
    setSuggestions([]);
  };

  return { 
    factCheck, 
    factCheckLink, 
    factCheckImage,
    fetchSuggestions,
    suggestions,
    loadingSuggestions,
    result, 
    isLoading: loading, 
    loadingAI, 
    news, 
    fetchLiveNews, 
    error, 
    clearResult, 
    mode, 
    setMode,
    lastQuery,
    lastUrl,
    lastImage
  };
}
