/**
 * ChatbotUI.jsx
 * Advanced FixPix AI Assistant with iOS Glassmorphism, Dynamic Chips, and Workflow Cards.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Mic, Sparkles, 
  Settings, Info, History, Zap, ShieldCheck,
  ChevronDown, Brain, Activity, Wand2, Bot
} from 'lucide-react';
import { useChatbot } from './useChatbot';
import { startListening } from './voiceHandler';
import { trackEvent } from './analyticsTracker';
import useBreakpoint from '../../hooks/useBreakpoint';
import './AICopilot.css';

// Sub-components
import AnalysisChips from './ui/AnalysisChips';
import WorkflowCard from './ui/WorkflowCard';
import ResultSummaryCard from './ui/ResultSummaryCard';

/**
 * FormattedMessage: A premium parser for AI responses.
 * Handles bolding, lists, and spacing with iOS aesthetics.
 */
const FormattedMessage = ({ text, sender }) => {
  if (sender === 'user') return <span>{text}</span>;

  // Split into lines to detect lists
  const lines = text.split('\n');
  
  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Check for Numbered List (e.g., "1. **Title**")
        const numberedMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (numberedMatch) {
          const [_, num, content] = numberedMatch;
          return (
            <div key={idx} className="flex gap-3 items-start group">
              <div className="mt-0.5 w-5 h-5 rounded-full flex-none flex items-center justify-center text-[10px] font-black" 
                   style={{ backgroundColor: 'var(--fill-tertiary)', color: 'var(--accent)' }}>
                {num}
              </div>
              <div className="flex-1 text-[13px] leading-relaxed">
                {parseBoldText(content)}
              </div>
            </div>
          );
        }

        // Check for Bullet List (e.g., "* " or "- ")
        const bulletMatch = trimmed.match(/^[*•-]\s*(.*)/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex gap-3 items-start pl-1">
              <div className="mt-2 w-1.5 h-1.5 rounded-full flex-none bg-accent animate-pulse" />
              <div className="flex-1 text-[13px] leading-relaxed">
                {parseBoldText(bulletMatch[1])}
              </div>
            </div>
          );
        }

        // Default Paragraph
        return (
          <p key={idx} className="text-[13px] leading-relaxed">
            {parseBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to handle **bold** segments
const parseBoldText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-black text-text-primary" style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const ChatbotUI = () => {
  const { 
    isOpen, toggleChat, messages, isTyping, processUserInput,
    activeImageTags, activeWorkflow, isProcessing, 
    lastActionResult, isExplainMode, toggleExplainMode
  } = useChatbot();
  
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isMobile } = useBreakpoint();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    trackEvent('message_sent', { text });
    setInputText('');
    await processUserInput(text);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    startListening(
      (text) => {
        setIsListening(false);
        setInputText(text);
      },
      (error) => {
        setIsListening(false);
        console.error('Voice error:', error);
      }
    );
  };

  return (
    <div className={`z-[9999] font-sans pointer-events-none ${
      isMobile && isOpen ? 'fixed inset-0' : isMobile ? 'fixed bottom-[calc(92px+env(safe-area-inset-bottom,20px))] right-4' : 'fixed bottom-4 right-4'
    }`}>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleChat}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            style={{ zIndex: 90 }}
          />
        )}
      </AnimatePresence>

      {/* World-Class iOS Assistant Icon (FAB) */}
      <AnimatePresence>
        {!isOpen && !isMobile && (
          <div className="fixed bottom-8 right-8 z-[10000]">
            {/* Organic Breathing Aura */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-x-[-10px] inset-y-[-10px] rounded-full filter blur-[20px]"
              style={{ background: 'var(--accent)', opacity: 0.2 }}
            />

            <motion.button
              onClick={toggleChat}
              initial={{ scale: 0, opacity: 0, y: 100 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 200, damping: 25, mass: 1.2 }
              }}
              exit={{ scale: 0, opacity: 0, y: 100 }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              whileTap={{ scale: 0.92 }}
              className="pointer-events-auto w-16 h-16 rounded-[22px] flex items-center justify-center text-white relative overflow-hidden group shadow-2xl transition-all"
              style={{ 
                  background: 'var(--accent)',
                  boxShadow: `
                    0 15px 35px -5px rgba(0, 122, 255, 0.4),
                    inset 0 1px 1px rgba(255, 255, 255, 0.3)
                  `
              }}
            >
              {/* Internal Gloss Sweep Animation */}
              <motion.div
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none"
              />

              <motion.div
                key="ai-icon-ios"
                className="relative z-10"
                whileHover={{ scale: 1.1 }}
              >
                <Bot size={32} strokeWidth={2} className="drop-shadow-sm" />
                
                {/* Compact Presence Dot */}
                <div className="absolute -top-1 -right-1 h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
                </div>
              </motion.div>

              {/* High-End Inner Bevel Overlay */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[20px] shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Main Chat Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 20 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className={`pointer-events-auto flex flex-col vision-glass-panel overflow-hidden ${
              isMobile 
                ? 'fixed inset-x-0 bottom-0 h-[85vh] rounded-t-[32px]' 
                : 'absolute bottom-0 right-0 w-[400px] h-[700px] max-h-[85vh]'
            }`}
            style={{ 
              zIndex: 100,
              boxShadow: isMobile ? '0 -10px 40px rgba(0,0,0,0.2)' : '0 12px 40px rgba(0,0,0,0.15)',
              paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 20px)' : '0',
            }}
          >
            {/* Handle for Mobile Drawer */}
            {isMobile && <div className="mobile-sheet-handle" />}

            {/* Header: Pro Style */}
            <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'transparent' }}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-inner" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 8px 16px rgba(0,113,227,0.2)' }}>
                          <Wand2 size={22} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundColor: 'var(--surface)' }}>
                          <div className="w-2 h-2 bg-[#34C759] rounded-full shadow-[0_0_8px_rgba(52,199,89,0.8)] animate-pulse" />
                      </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[15px] flex items-center gap-2 mb-0" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                      Assistant
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/10">Pro</span>
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#34C759] flex items-center gap-1">NEURAL HUB LIVE</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                    style={{ color: showSettings ? 'var(--accent)' : 'var(--text-tertiary)' }}
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={toggleChat}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-red-500 transition-all active:scale-95"
                  >
                    <X size={19} strokeWidth={2.5} />
                  </button>
                </div>
            </div>

            {/* Quick Settings Panel (Toggleable) */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-5 border-b"
                        style={{ backgroundColor: 'var(--fill-tertiary)', borderColor: 'var(--border-subtle)' }}
                    >
                        <div className="py-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                    <Brain size={14} /> Explain Mode
                                </span>
                                <button 
                                    onClick={toggleExplainMode}
                                    className={`w-10 h-5 rounded-full p-1 transition-all ${isExplainMode ? 'bg-[#34C759]' : 'var(--fill-secondary)'}`}
                                    style={{ backgroundColor: isExplainMode ? '#34C759' : 'var(--fill-secondary)' }}
                                >
                                    <motion.div 
                                        animate={{ x: isExplainMode ? 20 : 0 }}
                                        className="w-3 h-3 bg-white rounded-full shadow-sm" 
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                    <Zap size={14} /> Smart Routing
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Always On</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-gradient-to-b from-white/20 to-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : ''}`}>
                    <div
                        className={`px-5 py-3 rounded-[20px] text-[13px] leading-relaxed shadow-sm font-medium ${
                        msg.sender === 'user'
                            ? 'text-white rounded-tr-[4px]'
                            : 'border text-text-primary rounded-tl-[4px]'
                        }`}
                        style={{ 
                            backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'var(--fill-secondary)',
                            borderColor: msg.sender === 'user' ? 'transparent' : 'var(--border-subtle)',
                            color: msg.sender === 'user' ? 'white' : 'var(--text-primary)'
                        }}
                    >
                        <FormattedMessage text={msg.text} sender={msg.sender} />
                    </div>
                    
                    {/* Render Special UI Components if returned in metadata */}
                    {msg.sender === 'bot' && (
                        <div className="mt-2 space-y-2">
                            {msg.type === 'analysis' && <AnalysisChips tags={activeImageTags} />}
                            {msg.type === 'workflow' && <WorkflowCard workflow={activeWorkflow} isProcessing={isProcessing} />}
                            {msg.type === 'summary' && <ResultSummaryCard result={lastActionResult} />}
                            
                            {msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 pt-1">
                                    {msg.suggestions.map((sug, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => processUserInput(sug)}
                                            className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderColor: 'var(--accent)',
                                                color: 'var(--accent)'
                                            }}
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <span className="text-[9px] mt-1.5 block font-medium uppercase tracking-wider px-1" style={{ color: 'var(--text-tertiary)' }}>
                      {msg.sender === 'user' ? 'Sent' : 'AI Assistant'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-5 py-3 rounded-[20px] rounded-tl-[4px] border shadow-sm flex items-center gap-3" style={{ backgroundColor: 'var(--fill-secondary)', borderColor: 'var(--border-subtle)' }}>
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: 'var(--accent)' }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: 'var(--accent)' }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)' }} />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-tight" style={{ color: 'var(--accent)' }}>AI Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggestions Chips (Context Aware) */}
            <AnimatePresence>
                {activeImageTags.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto"
                    >
                        {activeImageTags.slice(0, 4).map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => processUserInput(tag.label)}
                                className="flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-sm border whitespace-nowrap"
                                style={{ 
                                    backgroundColor: 'var(--fill-tertiary)', 
                                    color: 'var(--text-primary)', 
                                    borderColor: 'var(--border-subtle)' 
                                }}
                            >
                                <Sparkles size={12} style={{ color: 'var(--accent)' }} />
                                {tag.actionLabel || tag.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area: Premium Contextual Container */}
            <div className="vision-chat-input-container bg-transparent relative z-10 before:absolute before:inset-0 before:bg-white/40 dark:before:bg-black/20 before:backdrop-blur-xl before:-z-10 before:border-t before:border-white/20 dark:before:border-white/10 p-5 safe-area-bottom">
                <AnimatePresence>
                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="px-1 mb-4 flex items-center gap-2.5"
                      >
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1.1, 0.8]
                                    }}
                                    transition={{ 
                                        duration: 1.2, 
                                        repeat: Infinity, 
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1.5 h-1.5 rounded-full bg-accent"
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Neural Intelligence Processing</span>
                      </motion.div>
                    )}
                </AnimatePresence>
                
                <form 
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex-1 relative flex items-center bg-black/5 dark:bg-white/5 rounded-[22px] border border-black/5 dark:border-white/10 focus-within:border-accent transition-all overflow-hidden p-1 px-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={handleVoiceInput}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-text-tertiary hover:text-accent'}`}
                    >
                      <Mic size={18} />
                    </motion.button>
                    
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? 'Listening...' : "Ask Assistant..."}
                      className="flex-1 h-10 px-2 text-[14px] bg-transparent border-none outline-none"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    disabled={!inputText.trim()}
                    className={`shrink-0 w-11 h-11 rounded-[20px] flex items-center justify-center shadow-lg transition-all ${
                      inputText.trim() 
                        ? 'bg-accent text-white shadow-accent/25' 
                        : 'bg-fill-secondary text-text-tertiary opacity-50'
                    }`}
                  >
                    <Send size={19} fill={inputText.trim() ? "currentColor" : "none"} />
                  </motion.button>
                </form>

                <div className="mt-3 flex items-center justify-between px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-tertiary)', opacity: 0.6 }}>
                        <ShieldCheck size={12} className="text-[#34C759]" strokeWidth={3} />
                        Neural Privacy ON
                    </p>
                    <button 
                        onClick={() => {/* logic to clear history */}}
                        className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
                    >
                        Reset Thread
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatbotUI;
