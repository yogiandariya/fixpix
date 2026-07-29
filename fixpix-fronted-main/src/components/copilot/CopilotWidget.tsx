import React, { useEffect, useRef, useState, KeyboardEvent, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Bot, X, Maximize2, Minimize2, Send, Sparkles, Image as ImageIcon, 
  CornerDownLeft, RefreshCw, ShieldCheck, Mic, Paperclip, ChevronRight, 
  XCircle, Zap, ArrowUpRight, Wand2, Eraser, ImagePlus, Clock, Play,
  Search, ArrowLeft, MessageSquare, ExternalLink, Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCopilotStore, CopilotMessage, CopilotSection, CopilotAction } from '../../store/useCopilotStore';
import useCanvasStore from '../../store/canvasStore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL, NODE_API_URL } from '../../lib/api';
import { ActionCard, ActionSuggestion } from './ActionCard';
import { FeatureCards } from './FeatureCards';
import { GuideCard } from './GuideCard';
import clsx from 'clsx';
import './CopilotWidget.css';

// ═══════════════════════════════════════════════════════════════════════
// 🍎 SUB-COMPONENTS — iOS-Grade Micro Components
// ═══════════════════════════════════════════════════════════════════════

// ── Section Card (Glassmorphic Info Block) ─────────────────────────────
const SectionCard: React.FC<{ section: CopilotSection; index: number }> = ({ section, index }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 12, scale: 0.96 },
      visible: { opacity: 1, y: 0, scale: 1 }
    }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    className="copilot-section-card p-4"
  >
    <div className="flex items-start gap-3">
      {section.icon && (
        <span className="text-xl mt-0.5 shrink-0 select-none">{section.icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1.5 leading-tight tracking-tight">
          {section.title}
        </h4>
        <div className="text-[12.5px] text-gray-600 dark:text-gray-300 leading-[1.6] break-words">
          <ReactMarkdown remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-[1.65]" {...props} />,
              strong: ({node, ...props}) => <strong className="font-extrabold text-gray-900 dark:text-white" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
              li: ({node, ...props}) => <li className="leading-relaxed text-[13px]" {...props} />
            }}
          >{section.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  </motion.div>
);

// ── Action Button (Interactive Pill) ──────────────────────────────────
const ActionButton: React.FC<{ action: CopilotAction; onClick: () => void; index: number }> = ({ action, onClick, index }) => (
  <motion.button
    variants={{
      hidden: { opacity: 0, scale: 0.92, y: 6 },
      visible: { opacity: 1, scale: 1, y: 0 }
    }}
    transition={{ type: 'spring', stiffness: 550, damping: 25 }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.94 }}
    onClick={onClick}
    className={clsx(
      "copilot-action-btn px-4 py-2.5 flex items-center gap-2 shadow-sm",
      action.action === 'navigate' && 'copilot-action-navigate',
      action.action === 'execute' && 'copilot-action-execute',
      action.action === 'upgrade' && 'copilot-action-upgrade'
    )}
  >
    <span className="font-semibold text-[12px] tracking-tight">{action.label}</span>
    <ChevronRight className="w-3 h-3 opacity-50" />
  </motion.button>
);

// ── Pipeline Execution Visualizer ─────────────────────────────────────
const PipelineCard: React.FC<{ pipeline: any[] }> = ({ pipeline }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="copilot-pipeline-card p-3 mt-3"
  >
    <div className="flex items-center gap-2 mb-2.5 px-1">
      <Zap className="w-3 h-3 text-blue-500" />
      <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
        Executing Pipeline
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      {pipeline.map((step: any, idx: number) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="copilot-pipeline-step px-3 py-2 flex items-center gap-2"
        >
          <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
          <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
            {step.tool}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ── Result Image Card (AI Generated/Edited Output) ────────────────────
const ResultImageCard: React.FC<{ imageUrl: string; onDownload: () => void }> = ({ imageUrl, onDownload }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className="copilot-result-card relative group mt-4 overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
  >
    <img src={imageUrl} alt="AI Result" className="w-full h-auto object-contain bg-gray-100 dark:bg-white/5" />
    
    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between backdrop-blur-[1px]">
       <div className="flex flex-col">
         <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">FixPix Neural Result</span>
         <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
           <ShieldCheck className="w-3 h-3" /> Synced to Canvas
         </span>
       </div>
       <div className="flex gap-2">
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={onDownload}
           className="p-2.5 bg-white text-black rounded-xl shadow-lg hover:bg-gray-100 transition-colors"
           title="Download Image"
         >
           <ArrowUpRight className="w-4 h-4" />
         </motion.button>
       </div>
    </div>

    {/* Quick action button always visible in corner */}
    <button 
      onClick={onDownload} 
      className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-black transition-all border border-white/10 group-hover:scale-110"
    >
      <ExternalLink className="w-4 h-4" />
    </button>
  </motion.div>
);

// ── Smart Chip (Quick Action Pill) ────────────────────────────────────
const SmartChip: React.FC<{ emoji: string; label: string; onClick: () => void }> = ({ emoji, label, onClick }) => (
  <motion.button
    variants={{
      hidden: { opacity: 0, scale: 0.9, y: 8 },
      visible: { opacity: 1, scale: 1, y: 0 }
    }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.94 }}
    onClick={onClick}
    className="copilot-chip px-3.5 py-2.5 flex items-center gap-2 text-gray-700 dark:text-gray-200"
  >
    <span className="text-sm">{emoji}</span>
    <span className="text-[11px] font-semibold tracking-tight">{label}</span>
  </motion.button>
);

// ── Dynamic Placeholder ───────────────────────────────────────────────
const getPlaceholder = (page: string, isListening: boolean): string => {
  if (isListening) return "Listening...";
  const placeholders: Record<string, string> = {
    'home': "Ask me anything about FixPix...",
    'editor': "Describe what to do with your image...",
    'pricing': "Questions about plans or features?",
    'workspace': "Need help managing your projects?",
    'restoration': "Tell me how to enhance this image...",
  };
  return placeholders[page] || "Message Assistant PRO...";
};

// ═══════════════════════════════════════════════════════════════════════
// 🧠 MAIN COPILOT WIDGET — iOS-Grade Neural Interface
// ═══════════════════════════════════════════════════════════════════════
export const CopilotWidget: React.FC = () => {
  const { 
    isOpen, toggleCopilot, closeCopilot, messages, addMessage, 
    isThinking, updateMessage, activeImage, setThinking,
    getConversationHistory, currentPage, clearMessages, openCopilot,
    activeConversationId, setActiveConversationId
  } = useCopilotStore();
  
  // ── SaaS Enhanced Auth Integration ────────────────────────────────
  const { user, plan, isElite, isPro, isSubscribed, session } = useAuth();
  const location = useLocation();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // ── Fetch copilot history ──────────────────────────────────────────
  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams({ userId: user.id, limit: '30', search: historySearch });
      const res = await fetch(`${NODE_API_URL}/api/copilot-history?${params}`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      const data = await res.json();
      setHistoryData(data.conversations || []);
    } catch (err) {
      console.error('History fetch failed:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [user, historySearch]);

  useEffect(() => { if (showHistory) fetchHistory(); }, [showHistory, fetchHistory]);

  // ── Explicit editor handoff for image-based actions ─────────────
  const getEditorImage = () => attachedImage || activeImage || null;

  const openEditorWithImage = useCallback((tool?: string) => {
    const imageToOpen = getEditorImage();
    const normalizedTool = tool === 'remove_bg' ? 'remove_bg' : tool;
    const handoffFeatureId = normalizedTool === 'remove_bg' ? 'remove-bg' : normalizedTool || null;

    navigate(`/app/restoration${normalizedTool ? `?tool=${normalizedTool}` : ''}`, {
      state: imageToOpen
        ? { preloadImage: imageToOpen, handoffTool: normalizedTool || null, handoffFeatureId }
        : undefined,
    });

    closeCopilot();
  }, [attachedImage, activeImage, closeCopilot, navigate]);

  const runSuggestionDirectly = useCallback((tool: string) => {
    const normalizedTool = (tool || '').toLowerCase();
    const featureMap: Record<string, string> = {
      remove_bg: 'remove-bg',
      removebg: 'remove-bg',
      'remove bg': 'remove-bg',
      face_restore: 'face-restore',
      facerestore: 'face-restore',
      'face restore': 'face-restore',
      super_res: 'super-res',
      superres: 'super-res',
      'super res': 'super-res',
      magic_eraser: 'magic-eraser',
      magiceraser: 'magic-eraser',
      'magic eraser': 'magic-eraser',
      style_transfer: 'style-transfer',
      styletransfer: 'style-transfer',
      'style transfer': 'style-transfer',
      change_bg: 'change-bg',
      changebg: 'change-bg',
      'change bg': 'change-bg',
      edit_image: 'edit-image',
      editimage: 'edit-image',
      text_to_image: 'text-to-image',
      texttoimage: 'text-to-image',
      ai_tagline: 'ai-tagline',
      tagline: 'ai-tagline',
      smart_frames: 'smart-frames',
      smartframes: 'smart-frames',
      smart_filters: 'smart-filters',
      smartfilters: 'smart-filters',
    };

    const featureId = featureMap[normalizedTool] || featureMap[normalizedTool.replace(/[_-]/g, ' ')] || null;

    if (featureId && getEditorImage()) {
      openEditorWithImage(featureId);
      return;
    }

    executeAction(`Use ${tool} on my image`);
  }, [executeAction, getEditorImage, openEditorWithImage]);

  const runSuggestionInChat = useCallback((tool: string) => {
    executeAction(`Use ${tool} on my image`);
  }, [executeAction]);

  const restoreConversation = (conv: any) => {
    clearMessages();
    setActiveConversationId(conv.id);
    const msgs = conv.messages || [];
    msgs.forEach((msg: any, i: number) => {
      addMessage({
        id: `restored-${conv.id}-${i}`,
        role: msg.role,
        content: msg.content,
        sections: msg.sections,
        actions: msg.actions,
      });
    });
    setShowHistory(false);
  };

  const deleteHistoryItem = async (convId: string) => {
    if (!user?.id) return;
    try {
      await fetch(`${NODE_API_URL}/api/copilot-history/${convId}?userId=${user.id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      setHistoryData(prev => prev.filter(c => c.id !== convId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
  
  // Scroll to bottom smoothly
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => { scrollToBottom(); }, [messages, isThinking, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  // Keyboard handling
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── Image Attachment ─────────────────────────────────────────────
  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      setAttachedImage(imageDataUrl);

      // Keep uploaded image in copilot context for explicit handoff to the editor.
      const { setActiveImage } = useCopilotStore.getState();
      setActiveImage(imageDataUrl);

      // Show immediate suggestions without auto-running any pipeline.
      addMessage({
        id: `upload-suggestion-${Date.now()}`,
        role: 'assistant',
        content: 'Image uploaded. Choose an action to continue in the editor or keep chatting here.',
        actions: [
          { label: 'Remove BG in Canvas', action: 'navigate', target: 'remove_bg' },
          { label: 'Remove BG in Chat', action: 'execute', target: 'remove background' }
        ]
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Voice Input ──────────────────────────────────────────────────
  const handleVoiceInput = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice not supported. Try Chrome or Safari."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let result = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) result += event.results[i][0].transcript;
      setInputMessage(result);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  // ── Navigation ───────────────────────────────────────────────────
  const navMap: Record<string, string> = {
    'pricing': '/app/pricing', 'editor': '/app/restoration',
    'workspace': '/app', 'home': '/', 'settings': '/app/settings',
    'copilot-history': '/app/copilot-history', 'history': '/app/copilot-history',
  };
  const handleNavigate = (page: string) => navigate(navMap[page?.toLowerCase()] || `/${page}`);
  
  const handleActionClick = (action: CopilotAction) => {
    if (action.action === 'navigate') {
      if (getEditorImage() && action.target === 'remove_bg') {
        openEditorWithImage('remove_bg');
      } else if (action.target === 'editor' && getEditorImage()) {
        openEditorWithImage();
      } else {
        handleNavigate(action.target);
      }
    }
    else if (action.action === 'upgrade') handleNavigate('pricing');
    else if (action.action === 'execute') {
      const normalizedTarget = action.target.toLowerCase();
      if (getEditorImage() && (
        normalizedTarget.includes('remove background') ||
        normalizedTarget.includes('remove bg') ||
        normalizedTarget.includes('background')
      )) {
        openEditorWithImage('remove_bg');
      } else {
        executeAction(`Use ${action.target} on my image`);
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // 📡 SEND MESSAGE — SSE Streaming Handler
  // ═══════════════════════════════════════════════════════════════════
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !attachedImage) return;
    if (isThinking) return;

    const loweredInput = inputMessage.toLowerCase();
    if (getEditorImage() && (
      loweredInput.includes('remove bg') ||
      loweredInput.includes('remove background') ||
      loweredInput.includes('background removal')
    )) {
      openEditorWithImage('remove_bg');
      setInputMessage('');
      return;
    }
    
    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      imageData: attachedImage || undefined
    };
    
    addMessage(userMessage);
    setInputMessage('');
    setAttachedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setThinking(true);
    
    const assistantId = (Date.now() + 1).toString();
    addMessage({ id: assistantId, role: 'assistant', content: '', isStreaming: true });
    
    try {
      const state = useCopilotStore.getState();
      const conversationHistory = getConversationHistory();
      
      const payload = {
        message: userMessage.content,
        imageData: userMessage.imageData || null,
        conversationId: state.activeConversationId,
        context: {
          currentPage: state.currentPage,
          userPlan: state.userPlan,
          activeImage: state.activeImage,
          activeTool: state.activeTool,
          lastAction: state.lastAction,
          conversationHistory,
          userProfile: user ? {
            id: user.id,
            username: user.first_name || (user.username && !user.username.startsWith('sb_') ? user.username : 'User'),
            email: user.email,
            images_count: user.images_count
          } : null
        }
      };
      
      const response = await fetch(`${API_URL}/api/ai/chat/stream/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const statusCode = response.status;
        if (statusCode === 401) {
          throw new Error('AUTH_REQUIRED');
        }
        if (statusCode >= 500) {
          throw new Error('SERVER_TEMPORARY');
        }
        throw new Error(`API Error: ${statusCode}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      if (!reader) throw new Error('No reader available');
      
      let fullContent = '';
      let sseBuffer = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || '';
        
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          if (!dataStr) continue;
          
          try {
            const data = JSON.parse(dataStr);
            
            if (data.type === 'chunk' && data.content) {
              fullContent += typeof data.content === 'string' ? data.content : '';
              
              // 🚀 Regex Guardrail: Detect and strip <suggestions> tags
              // AI sometimes hallucinate these tags instead of using tool calls
              let cleanContent = fullContent;
              const suggestionsMatch = fullContent.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
              
              if (suggestionsMatch && suggestionsMatch[1]) {
                try {
                  const rawSuggestions = JSON.parse(suggestionsMatch[1]);
                  // Normalize: if they are grouped, flatten them for our ActionCard UI
                  const normalizedSuggs = Array.isArray(rawSuggestions) ? rawSuggestions.flatMap(group => {
                    if (group.tools) {
                      return group.tools.map((t: string) => ({ tool: t.toLowerCase().replace(/ /g, '_'), name: t, description: `Apply ${t} to your photo.` }));
                    }
                    return [group];
                  }) : [];
                  
                  updateMessage(assistantId, { suggestions: normalizedSuggs });
                  // Strip the tag from display
                  cleanContent = fullContent.replace(/<suggestions>[\s\S]*?<\/suggestions>/, '').trim();
                } catch (e) {
                  console.warn("Failed to parse AI suggestions tag:", e);
                }
              }
              
              updateMessage(assistantId, { content: cleanContent });
            }
            if (data.type === 'sections' && data.sections) {
              updateMessage(assistantId, { sections: data.sections });
            }
            if (data.type === 'ui_actions' && data.actions) {
              updateMessage(assistantId, { actions: data.actions });
            }
            if (data.type === 'meta') {
              updateMessage(assistantId, { 
                intent: data.intent, 
                confidence: data.confidence,
                pipeline: data.pipeline || [],
                responseType: data.response_type,
                guideData: data.guide
              });
              
              // 🚀 Auto-Execution Trigger
              if (data.auto_execute && data.pipeline && data.pipeline.length > 0) {
                 handleExecutePipeline(data.pipeline, assistantId);
              }

              // New conversation created by backend
              if (data.newConversationId) {
                setActiveConversationId(data.newConversationId);
              }

              // Pipeline progress updates
              if (data.pipelineStatus) {
                const { setPipelineProgress } = useCopilotStore.getState();
                setPipelineProgress({
                  status: data.pipelineStatus,
                  currentStep: data.currentStep || 0,
                  totalSteps: data.totalSteps || 0,
                  currentTool: data.currentTool || null,
                  toolName: data.toolName || null,
                  stepsCompleted: data.stepsCompleted || 0,
                  processedImage: data.processedImage || null,
                });
              }
              // Processed image result
              if (data.processedImage) {
                const { setActiveImage } = useCopilotStore.getState();
                const { pushEdit } = useCanvasStore.getState();

                // 1. Sync globally to App Context
                setActiveImage(data.processedImage);

                // 2. Add to Assistant's message for Chat View
                updateMessage(assistantId, { processedImage: data.processedImage });

                // 3. 🚀 Redirect to Canvas (Push to history)
                pushEdit(
                  data.processedImage, 
                  data.toolName || 'AI Enhancement', 
                  data.currentTool || 'ai_hub', 
                  {}
                );
              }
            }
            if (data.type === 'tool_call') {
              // Handle structured tool suggestions
              if (data.delta && data.delta[0]?.function) {
                const func = data.delta[0].function;
                const currentSuggestions = useCopilotStore.getState().messages.find(m => m.id === assistantId)?.suggestions || [];
                
                // Accumulate function arguments if streaming
                const existingIndex = currentSuggestions.findIndex(s => s.name === func.name);
                if (existingIndex !== -1) {
                  currentSuggestions[existingIndex].arguments = (currentSuggestions[existingIndex].arguments || '') + (func.arguments || '');
                } else {
                  currentSuggestions.push({
                    name: func.name,
                    arguments: func.arguments || '',
                    id: Math.random().toString(36).substr(2, 9)
                  });
                }
                updateMessage(assistantId, { suggestions: currentSuggestions });
              }
            }

            if (data.type === 'action_suggestion' && data.suggestion) {
               const currentSuggestions = useCopilotStore.getState().messages.find(m => m.id === assistantId)?.suggestions || [];
               currentSuggestions.push(data.suggestion);
               updateMessage(assistantId, { suggestions: currentSuggestions });
            }

            if (data.type === 'action') {
              if (data.intent === 'navigate' && data.page) handleNavigate(data.page);
              else updateMessage(assistantId, { intent: data.intent, pipeline: data.pipeline });
            }
          } catch (e) { /* skip malformed chunks */ }
        }
      }
      
      updateMessage(assistantId, { isStreaming: false });
    } catch (error: any) {
      console.error("Copilot Error:", error);
      const isNetworkError = error.message === 'Failed to fetch';
      const isAuthError = error.message === 'AUTH_REQUIRED';
      const isServerTemporary = error.message === 'SERVER_TEMPORARY';
      updateMessage(assistantId, { 
        content: isNetworkError
          ? "I'm having trouble reaching the Brain Server. Please make sure the backend is running and try again."
          : isAuthError
            ? "Please login first to continue this action."
            : isServerTemporary
              ? "The neural engine is temporarily busy. Please retry in a few seconds."
              : `I encountered a neural error: ${error.message}. Please try again in a moment.`,
        isStreaming: false
      });
    } finally {
      setThinking(false);
    }
  };

  const handleExecutePipeline = async (pipeline: any[], msgId: string) => {
    try {
      setThinking(true);
      if (!Array.isArray(pipeline) || pipeline.length === 0) {
        updateMessage(msgId, {
          content: '❌ **No executable steps found.** Please ask again with a clear action (e.g. "remove background").',
          isError: true,
          pipeline: [],
        });
        return;
      }

      updateMessage(msgId, { content: "🚀 **Starting AI Neural Pipeline...**\n\nI'm beginning the multi-step optimization sequence. High-performance models are now processing your image." });

      const workingImage = useCanvasStore.getState().getWorkingImage();
      const storeState = useCopilotStore.getState();
      const latestChatImage = [...(storeState.messages || [])]
        .reverse()
        .find((m: any) => m.role === 'user' && typeof m.imageData === 'string')?.imageData;

      const candidateImages = [
        workingImage,
        storeState.activeImage,
        latestChatImage,
        attachedImage,
      ];

      const imageForPipeline = candidateImages.find(
        (img) => typeof img === 'string' && img.startsWith('data:image/')
      ) as string | undefined;

      if (!imageForPipeline) {
        updateMessage(msgId, {
          content: '❌ **I need an image to work on!** Please upload one, then tap **Remove Background**.',
          isError: true,
          pipeline,
        });
        return;
      }
      
      const response = await fetch(`${API_URL}/api/copilot/execute-pipeline/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          pipeline,
          image_url: imageForPipeline,
          context: {
            userProfile: user ? {
              id: user.id,
              username: user.first_name || (user.username && !user.username.startsWith('sb_') ? user.username : 'User'),
              email: user.email,
            } : null
          }
        })
      });

      const result = await response.json();
      
      if (result.type === 'success' || (result.status === 'success' && result.image)) {
        const { setActiveImage } = useCopilotStore.getState();
        const { pushEdit } = useCanvasStore.getState();

        setActiveImage(result.image);
        updateMessage(msgId, { 
          processedImage: result.image,
          content: `✅ **Pipeline Succeeded!**\n\nI've successfully applied the optimization sequence. What would you like to do next?`,
          isError: false
        });

        // Push to canvas history
        pushEdit(result.image, 'Neural Pipeline', 'ai_copilot', { pipeline });
      } else {
        updateMessage(msgId, { 
          content: `❌ **${result.message || 'Processing failed. Try again.'}**`,
          isError: true,
          pipeline: pipeline
        });
      }
    } catch (error: any) {
      console.error("Pipeline Error:", error);
      updateMessage(msgId, { 
        content: `❌ **Neural Interruption**: I couldn't finish the execution. This might be due to a connection error or heavy server load.`,
        isError: true,
        pipeline: pipeline
      });
    } finally {
      setThinking(false);
    }
  };

  function executeAction(str: string) {
    setInputMessage(str);
    setTimeout(() => handleSendMessage(), 10);
  }

  // Get current page name for dynamic placeholder
  const pageName = location.pathname.includes('pricing') ? 'pricing' 
    : location.pathname.includes('restoration') || location.pathname.includes('editor') ? 'editor'
    : location.pathname === '/app' ? 'workspace'
    : 'home';
  const isLandingPage = location.pathname === '/';
  const isAppTabbarPage = location.pathname.startsWith('/app') && !location.pathname.includes('restoration');

  // ═══════════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ═══ FLOATING ACTION BUTTON ═══ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleCopilot}
            className={clsx(
              "copilot-fab fixed w-14 h-14 text-white z-50 flex items-center justify-center overflow-hidden",
              isLandingPage
                ? "bottom-4 right-4 sm:bottom-6 sm:right-6"
                : isAppTabbarPage
                  ? "bottom-[calc(env(safe-area-inset-bottom)+92px)] right-4 sm:bottom-6 sm:right-6"
                  : "bottom-6 right-6"
            )}
            style={{ 
              backgroundColor: '#007AFF', 
              borderRadius: '22px',
              border: 'none'
            }}
          >
            {/* Custom Premium iOS Bot Symbol */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 drop-shadow-md">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" />
              <line x1="16" y1="16" x2="16" y2="16" />
            </svg>
            
            {/* Live status dot - Refined Position */}
            <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border-[2px] border-[#007AFF] shadow-sm copilot-status-live"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ MAIN WINDOW ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.96, filter: 'blur(12px)' }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30,
              mass: 0.8,
              opacity: { duration: 0.4 }
            }}
            className={clsx(
              "copilot-window fixed overflow-hidden flex flex-col z-[9999] transition-all duration-500 ease-in-out",
              isLandingPage
                ? (isExpanded
                    ? "left-[max(12px,env(safe-area-inset-left))] right-[max(12px,env(safe-area-inset-right))] bottom-[max(12px,env(safe-area-inset-bottom))] h-[78vh] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[85vw] sm:h-[85vh]"
                    : "left-[max(12px,env(safe-area-inset-left))] right-[max(12px,env(safe-area-inset-right))] bottom-[max(12px,env(safe-area-inset-bottom))] w-auto h-[72vh] max-h-[78vh] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[700px] sm:max-h-[88vh]")
                : isAppTabbarPage
                  ? (isExpanded
                      ? "left-[max(12px,env(safe-area-inset-left))] right-[max(12px,env(safe-area-inset-right))] bottom-[calc(env(safe-area-inset-bottom)+96px)] h-[76vh] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[85vw] sm:h-[85vh]"
                      : "left-[max(12px,env(safe-area-inset-left))] right-[max(12px,env(safe-area-inset-right))] bottom-[calc(env(safe-area-inset-bottom)+96px)] w-auto h-[68vh] max-h-[74vh] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[700px] sm:max-h-[88vh]")
                  : (isExpanded ? "bottom-6 right-6 w-[85vw] h-[85vh]" : "bottom-6 right-6 w-[400px] h-[700px] max-h-[88vh]")
            )}
          >
            {/* ─── HEADER ──────────────────────────────────────────── */}
            <div className="copilot-header relative flex items-center justify-between p-5">
              <div className="flex items-center space-x-3 z-10">
                <div className="w-10 h-10 rounded-2xl bg-[#007AFF] shadow-lg shadow-blue-500/20 flex items-center justify-center relative">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white drop-shadow-sm">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8" y2="16" />
                    <line x1="16" y1="16" x2="16" y2="16" />
                  </svg>
                  <div className="copilot-status-live absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-[2px] border-white dark:border-[#1C1C1E]"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-[15px] tracking-tight leading-tight flex items-center gap-2">
                    Assistant
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] uppercase tracking-[0.1em] font-extrabold border border-blue-500/15">{plan}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[7px] uppercase tracking-[0.1em] font-extrabold border border-emerald-500/15">V3</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-[0.15em] mt-0.5">
                    Neural Hub Live • Thinking Engine
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 z-10">
                <button onClick={() => setShowHistory(!showHistory)} title={showHistory ? 'Back to Chat' : 'Chat History'} className={clsx('p-2 rounded-xl transition-all', showHistory ? 'text-blue-500 bg-blue-500/10' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-500/8')}>
                  {showHistory ? <ArrowLeft className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all">
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={closeCopilot} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/8 rounded-xl transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ─── CONTEXT BAR ─────────────────────────────────────── */}
            <AnimatePresence>
              {activeImage && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="copilot-context-bar px-5 py-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 tracking-tight">Image loaded in context</span>
                  </div>
                  <div className="copilot-status-live w-2 h-2 bg-blue-500 rounded-full"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── INLINE HISTORY PANEL ──────────────────────────── */}
            {showHistory ? (
            <div className="flex-1 overflow-y-auto copilot-scroll flex flex-col">
              {/* History Header */}
              <div className="px-5 pt-4 pb-3 sticky top-0 z-10" style={{ background: 'var(--copilot-glass-bg, rgba(255,255,255,0.85))', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white tracking-tight">Chat History</h4>
                  <button
                    onClick={() => { navigate('/app/copilot-history'); closeCopilot(); }}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider transition-colors"
                  >
                    Full Page <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search past conversations..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-[12px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400 dark:placeholder-gray-500 dark:text-white"
                  />
                </div>
              </div>

              {/* History List */}
              <div className="flex-1 px-4 pb-4 space-y-2">
                {historyLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Loading history...</span>
                  </div>
                ) : historyData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    </div>
                    <span className="text-[12px] font-semibold text-gray-400">
                      {historySearch ? 'No conversations match your search' : 'No conversations yet'}
                    </span>
                  </div>
                ) : (
                  historyData.map((conv, idx) => {
                    const msgs = conv.messages || [];
                    const lastUserMsg = [...msgs].reverse().find((m: any) => m.role === 'user');
                    const lastAssistantMsg = [...msgs].reverse().find((m: any) => m.role === 'assistant');
                    const time = new Date(conv.updated_at || conv.created_at);
                    const intentColors: Record<string, string> = {
                      edit_image: '#34C759', general_chat: '#AF52DE', upgrade: '#FF9500',
                      navigate: '#007AFF', ask_question: '#5856D6', search_web: '#FF3B30',
                    };
                    const dotColor = intentColors[conv.intent] || '#8E8E93';

                    return (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => restoreConversation(conv)}
                        className="group relative p-3.5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/[0.06] hover:border-blue-300/50 dark:hover:border-blue-500/20 cursor-pointer transition-all hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: dotColor }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="text-[13px] font-semibold text-gray-900 dark:text-white truncate pr-2 leading-tight">
                                {conv.title || 'Untitled'}
                              </h5>
                              <span className="text-[10px] text-gray-400 font-medium shrink-0">
                                {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            {lastAssistantMsg?.content && (
                              <p className="text-[11.5px] text-gray-500 dark:text-gray-400 truncate leading-snug">
                                {lastAssistantMsg.content.substring(0, 80).replace(/[#*_]/g, '')}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                {msgs.length} msg{msgs.length !== 1 ? 's' : ''}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteHistoryItem(conv.id); }}
                                className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
            ) : (
            /* ─── MESSAGES (original chat view) ────────────────────── */
            <div className="flex-1 overflow-y-auto copilot-scroll p-5 space-y-5 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 450, 
                    damping: 28,
                    mass: 0.7 
                  }}
                  key={msg.id}
                  className={clsx("flex flex-col max-w-[88%]", msg.role === 'user' ? "ml-auto" : "mr-auto")}
                >
                  {/* User image */}
                  {msg.role === 'user' && msg.imageData && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-2 flex justify-end"
                    >
                      <img src={msg.imageData} alt="Attached" className="copilot-image-attachment w-20 h-20 object-cover" />
                    </motion.div>
                  )}

                  {/* Message Bubble */}
                  <div className={clsx(
                    "px-4 py-3 text-[14.5px] leading-[1.6]",
                    msg.role === 'user' ? "copilot-bubble-user" : "copilot-bubble-assistant"
                  )}>
                    {msg.role === 'assistant' ? (
                      <div className="w-full break-words">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({node, ...props}) => <p className="mb-3.5 last:mb-0 text-[14.5px] leading-[1.7]" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3.5 space-y-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-3.5 space-y-2" {...props} />,
                            li: ({node, ...props}) => <li className="leading-[1.65] text-[14px]" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-extrabold text-gray-900 dark:text-white tracking-tight" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-[15px] font-black mt-4 mb-2 uppercase tracking-wide text-gray-800 dark:text-gray-100" {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                        {msg.isStreaming && <span className="copilot-typing-cursor"></span>}
                      </div>
                    ) : (
                      <span className="relative z-10">{msg.content}</span>
                    )}
                  </div>

                  {/* Sections */}
                  {msg.sections && msg.sections.length > 0 && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.08 } }
                      }}
                      className="mt-3 space-y-2"
                    >
                      {msg.sections.map((section, idx) => (
                        <SectionCard key={idx} section={section} index={idx} />
                      ))}
                    </motion.div>
                  )}

                  {/* Actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
                      }}
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {msg.actions.map((action, idx) => (
                        <ActionButton key={idx} action={action} onClick={() => handleActionClick(action)} index={idx} />
                      ))}
                    </motion.div>
                  )}

                  {/* Pipeline */}
                  {msg.pipeline && msg.pipeline.length > 0 && (
                    <PipelineCard pipeline={msg.pipeline} />
                  )}

                  {/* 🖼️ AI Result Image (Downloadable) */}
                  {msg.processedImage && (
                    <ResultImageCard 
                      imageUrl={msg.processedImage} 
                      onDownload={() => {
                        const link = document.createElement('a');
                        link.href = msg.processedImage!;
                        link.download = `fixpix-result-${Date.now()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    />
                  )}

                  {/* ⚡ Interactive List (Phase 6) */}
                  {msg.responseType === 'interactive_list' && msg.suggestions && (
                    <FeatureCards 
                      suggestions={msg.suggestions}
                      onRun={(tool) => runSuggestionDirectly(tool)}
                      onRunInChat={(tool) => runSuggestionInChat(tool)}
                      onCustomize={(tool) => {
                        const query = tool.replace('enhance_image', 'enhance');
                        navigate(`/app/restoration?tool=${query}`);
                      }}
                    />
                  )}

                  {/* ⚡ Action Suggestions (Function Calls) */}
                  {msg.responseType === 'action' && msg.suggestions && msg.suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 space-y-3"
                    >
                      {msg.suggestions.map((suggestion, idx) => (
                        <ActionCard 
                          key={suggestion.id || idx}
                          suggestion={{
                            id: suggestion.id || idx.toString(),
                            name: suggestion.name.replace(/_/g, ' '),
                            tool: suggestion.name,
                            description: suggestion.description || `AI suggests using ${suggestion.name}`,
                            confidence: suggestion.confidence || 0.9
                          }}
                          onRun={() => runSuggestionDirectly(suggestion.name)}
                          onRunInChat={() => runSuggestionInChat(suggestion.name)}
                          onCustomize={() => {
                             const query = suggestion.name.replace('enhance_image', 'enhance');
                             navigate(`/app/restoration?tool=${query}`);
                          }}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* 🛠️ Reliability Failsafe (Phase 7) */}
                  {msg.isError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col gap-3"
                    >
                      <p className="text-[11px] font-bold text-red-600/60 uppercase tracking-widest">Neural Recovery Mode</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleExecutePipeline(msg.pipeline || [], msg.id)}
                          className="flex-1 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Retry Execution
                        </button>
                        <button 
                          onClick={() => document.getElementById('copilot-file-input')?.click()}
                          className="px-4 h-9 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-[12px] font-bold border border-gray-200/50 dark:border-white/10 transition-all"
                        >
                          Upload New
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 📖 Step-by-Step Guide (Phase 6) */}
                  {msg.responseType === 'guide' && msg.guideData && (
                    <GuideCard 
                      steps={msg.guideData.steps} 
                      proTip={msg.guideData.pro_tip} 
                    />
                  )}
                </motion.div>
              ))}

              {/* ── Thinking Indicator — Neural Pulse ─────────────────────── */}
              {isThinking && (
                <motion.div 
                  initial={{ opacity: 0, y: 12, scale: 0.9 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="flex flex-col max-w-[60%] mr-auto"
                >
                  <div className="copilot-bubble-assistant px-5 py-4 flex items-center gap-4">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <div className="copilot-neural-orb"></div>
                      <div className="copilot-neural-ring"></div>
                      <div className="copilot-neural-ring"></div>
                    </div>
                    <span className="text-[10px] text-blue-500/80 dark:text-blue-400/80 font-bold uppercase tracking-[0.2em]">
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
            )}

            <AnimatePresence>
              {messages.length < 3 && !isThinking && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                    hidden: { opacity: 0 }
                  }}
                  className="px-5 pb-4 flex flex-wrap gap-2 pt-1"
                >
                  <SmartChip emoji="✨" label="Enhance Image" onClick={() => executeAction("✨ Enhance this image")} />
                  <SmartChip emoji="🪄" label="Remove BG" onClick={() => executeAction("🪄 Remove the background")} />
                  <SmartChip emoji="🎨" label="Generate Image" onClick={() => executeAction("🎨 Generate an AI image")} />
                  <SmartChip emoji="💎" label="Plans & Pricing" onClick={() => executeAction("💎 Tell me about premium plans")} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── ATTACHED IMAGE PREVIEW ──────────────────────────── */}
            <AnimatePresence>
              {attachedImage && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-2"
                >
                  <div className="relative inline-block">
                    <img src={attachedImage} alt="Preview" className="copilot-image-attachment w-16 h-16 object-cover" />
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAttachedImage(null)} 
                      className="absolute -top-1.5 -right-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── INPUT AREA ──────────────────────────────────────── */}
            <div className="p-4 relative z-10 shrink-0" style={{ borderTop: '0.5px solid var(--copilot-glass-border)' }}>
              <form onSubmit={handleSendMessage} className="relative">
                <div className="copilot-input-wrap relative flex items-end w-full p-1">
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholder(pageName, isListening)}
                    className="w-full max-h-[120px] bg-transparent rounded-[20px] py-3 pl-4 pr-[110px] text-[14.5px] focus:outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none copilot-scroll"
                    disabled={isThinking}
                    rows={1}
                  />

                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageAttach} />

                  {/* Attach Image */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-[72px] bottom-2 p-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-500/8 transition-all"
                  >
                    <Paperclip className="w-[17px] h-[17px]" strokeWidth={2} />
                  </button>

                  {/* Voice */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={clsx(
                      "absolute right-11 bottom-2 p-2 w-8 h-8 flex items-center justify-center rounded-full transition-all",
                      isListening ? "bg-red-500/10 text-red-500 animate-pulse" : "text-gray-400 hover:text-blue-500 hover:bg-blue-500/8"
                    )}
                  >
                    <Mic className="w-[17px] h-[17px]" strokeWidth={isListening ? 2.5 : 2} />
                  </button>

                  {/* Send */}
                  <button
                    type="submit"
                    disabled={(!inputMessage.trim() && !attachedImage) || isThinking}
                    className="copilot-send-btn absolute right-1.5 bottom-1.5 p-2 w-9 h-9 flex items-center justify-center text-white rounded-full"
                  >
                    <CornerDownLeft className="w-[17px] h-[17px]" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Footer badge */}
                <div className="text-center mt-2.5">
                  <span className="copilot-footer-badge flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    Neural Hub V3 • Secure AI Processing
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
