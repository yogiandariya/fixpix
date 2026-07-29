import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Check, Share2, Download, 
  MessageCircle, Twitter, Send, Globe,
  ShieldCheck, Activity, Brain
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  result: any;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, query, result }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateShareLink = async () => {
    if (shareUrl) return shareUrl;
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBase}/api/fact-check/share/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, result }),
      });
      const data = await response.json();
      const fullUrl = `${window.location.origin}/share/${data.share_id}`;
      setShareUrl(fullUrl);
      return fullUrl;
    } catch (error) {
      console.error('Error generating share link:', error);
      return '';
    }
  };

  const handleCopy = async () => {
    const url = await generateShareLink();
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = async (platform: 'whatsapp' | 'twitter' | 'telegram') => {
    const url = await generateShareLink();
    if (!url) return;
    const text = encodeURIComponent(`🔍 Fact Check: ${query}\nVerdict: ${result.verdict}\n\nVerified by FixPix Intelligence Engine:\n`);
    const links = {
      whatsapp: `https://wa.me/?text=${text}${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };
    window.open(links[platform], '_blank');
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `fixpix-fact-check-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{
              position: 'relative', width: '100%', maxWidth: 480,
              backgroundColor: 'var(--surface)', borderRadius: 28,
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
              overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
            }}
            className="hide-scrollbar"
          >
            {/* Header */}
            <div style={{ padding: 24, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 8, backgroundColor: 'var(--accent-soft)', borderRadius: 12 }}>
                  <Share2 size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Share Intelligence</h2>
              </div>
              <button 
                onClick={onClose}
                style={{ padding: 8, borderRadius: 10, border: 'none', cursor: 'pointer', backgroundColor: 'var(--fill-tertiary)', color: 'var(--text-tertiary)', transition: 'all 200ms ease' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 32 }} className="space-y-8">
              {/* Share Card Preview */}
              <div 
                ref={cardRef}
                style={{
                  background: 'linear-gradient(135deg, var(--accent), #1D1D1F)',
                  padding: 32, borderRadius: 20, color: 'white',
                  minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <ShieldCheck size={22} style={{ opacity: 0.6 }} />
                     <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>FixPix Engine</span>
                  </div>
                  <div style={{ padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{result.verdict}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>
                    "{query}"
                  </h3>
                  <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
                    {result.summary || result.final_explanation}
                  </p>
                </div>

                <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Brain size={14} style={{ opacity: 0.5 }} />
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Analysis</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Activity size={12} style={{ color: '#34C759' }} className="animate-pulse" />
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.7 }}>{result.confidence}% Confidence</span>
                  </div>
                </div>
              </div>

              {/* Social Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { platform: 'whatsapp' as const, icon: MessageCircle, color: '#25D366', label: 'WhatsApp' },
                  { platform: 'twitter' as const, icon: Twitter, color: 'var(--text-primary)', label: 'Twitter / X' },
                  { platform: 'telegram' as const, icon: Send, color: '#0088cc', label: 'Telegram' },
                ].map(({ platform, icon: Icon, color, label }) => (
                  <button 
                    key={platform}
                    onClick={() => handleSocialShare(platform)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 16,
                      backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color, transition: 'transform 200ms ease',
                    }} className="hover:scale-110">
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <button 
                  onClick={handleCopy}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 0', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
                    borderRadius: 999, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                    transition: 'all 200ms ease', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }}
                  className="active:scale-95"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button 
                  onClick={downloadImage}
                  disabled={isGenerating}
                  style={{
                    padding: 14, backgroundColor: 'var(--accent-soft)', color: 'var(--accent)',
                    borderRadius: 16, border: 'none', cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  className="disabled:opacity-50"
                >
                  <Download size={20} className={isGenerating ? 'animate-bounce' : ''} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
