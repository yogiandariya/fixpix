import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Search, Filter, Calendar, Clock, Sparkles,
  Trash2, ArrowRight, Inbox, RefreshCw, Bot, ChevronRight,
  Zap, Image as ImageIcon, ArrowUpRight, Wand2, Globe, Star,
  ChevronDown, RotateCcw, Settings, XCircle
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useCopilotStore } from '../store/useCopilotStore';
import PremiumMobileHeader from '../components/layout/PremiumMobileHeader';

// ─── Type indicator colors ──────────────────────────────────────────
const INTENT_CONFIG = {
  edit_image:    { label: 'Image Edit', icon: Wand2, color: '#34C759', bg: 'rgba(52,199,89,0.08)', border: 'rgba(52,199,89,0.15)' },
  general_chat:  { label: 'Chat', icon: MessageSquare, color: '#AF52DE', bg: 'rgba(175,82,222,0.08)', border: 'rgba(175,82,222,0.15)' },
  upgrade:       { label: 'Upgrade', icon: Star, color: '#FF9500', bg: 'rgba(255,149,0,0.08)', border: 'rgba(255,149,0,0.15)' },
  navigate:      { label: 'Navigation', icon: ArrowUpRight, color: '#007AFF', bg: 'rgba(0,122,255,0.08)', border: 'rgba(0,122,255,0.15)' },
  ask_question:  { label: 'Question', icon: Sparkles, color: '#5856D6', bg: 'rgba(88,86,214,0.08)', border: 'rgba(88,86,214,0.15)' },
  search_web:    { label: 'Web Search', icon: Globe, color: '#FF3B30', bg: 'rgba(255,59,48,0.08)', border: 'rgba(255,59,48,0.15)' },
  repeat_action: { label: 'Repeat', icon: RotateCcw, color: '#32ADE6', bg: 'rgba(50,173,230,0.08)', border: 'rgba(50,173,230,0.15)' },
  undo_action:   { label: 'Undo', icon: RotateCcw, color: '#FF6482', bg: 'rgba(255,100,130,0.08)', border: 'rgba(255,100,130,0.15)' },
};

// ─── Stat Card ──────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, count, label, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className="flex-1 min-w-[140px] p-5 rounded-[20px] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] relative overflow-hidden group hover:border-[var(--accent-soft)] transition-all"
  >
    <div className="relative z-10">
      <div className="w-9 h-9 rounded-[12px] flex items-center justify-center bg-[var(--fill-secondary)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors mb-3">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div className="text-2xl font-black text-[var(--text-primary)] leading-none tracking-tighter mb-0.5">{count}</div>
      <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.15em]">{label}</div>
    </div>
    <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
      <Icon size={64} />
    </div>
  </motion.div>
);

// ─── Conversation Card ──────────────────────────────────────────────
const ConversationCard = ({ conversation, index, onClick, onDelete }) => {
  const config = INTENT_CONFIG[conversation.intent] || INTENT_CONFIG.general_chat;
  const IconComp = config.icon;
  const messages = conversation.messages || [];
  const userMsg = messages.find(m => m.role === 'user');
  const assistantMsg = messages.filter(m => m.role === 'assistant').pop();
  const time = new Date(conversation.updated_at || conversation.created_at);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => onClick(conversation)}
      className="group relative flex items-stretch gap-5 p-5 rounded-[20px] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-soft)] transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
    >
      {/* Intent Icon */}
      <div
        className="w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center"
        style={{ background: config.bg, border: `0.5px solid ${config.border}` }}
      >
        <IconComp size={20} style={{ color: config.color }} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-extrabold uppercase tracking-[0.12em] px-2 py-0.5 rounded-md"
            style={{ background: config.bg, color: config.color, border: `0.5px solid ${config.border}` }}
          >
            {config.label}
          </span>
          <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <h4 className="text-[15px] font-bold text-[var(--text-primary)] truncate tracking-tight leading-tight mb-1">
          {conversation.title || 'Untitled Conversation'}
        </h4>

        {assistantMsg?.content && (
          <p className="text-[13px] text-[var(--text-secondary)] truncate leading-snug">
            {assistantMsg.content.substring(0, 100).replace(/[#*_]/g, '')}
          </p>
        )}

        {/* Message Count */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] font-bold text-[var(--text-tertiary)] flex items-center gap-1">
            <MessageSquare size={10} /> {messages.length} messages
          </span>
          {conversation.pipeline?.length > 0 && (
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
              <Zap size={10} /> Pipeline
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-between py-1">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(conversation.id); }}
          className="p-2 rounded-xl text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <Trash2 size={14} />
        </button>
        <div className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all">
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Filter Pill ────────────────────────────────────────────────────
const FilterPill = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`h-10 px-4 rounded-[12px] text-[11px] font-bold uppercase tracking-[0.08em] transition-all whitespace-nowrap flex items-center gap-2 ${
      active
        ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]'
        : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-soft)]'
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
        active ? 'bg-white/20 text-white' : 'bg-[var(--fill-secondary)] text-[var(--text-tertiary)]'
      }`}>
        {count}
      </span>
    )}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const CopilotHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addMessage, openCopilot, clearMessages } = useCopilotStore();

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState({ total: 0, byIntent: {} });

  const NODE_API = 'http://127.0.0.1:4000';

  // ─── Fetch conversations ──────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId: user.id,
        page: page.toString(),
        limit: '20',
        filter: activeFilter,
        search
      });

      const res = await fetch(`${NODE_API}/api/copilot-history?${params}`);
      const data = await res.json();

      setConversations(data.conversations || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  }, [user, page, activeFilter, search]);

  // ─── Fetch stats ──────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${NODE_API}/api/copilot-history/stats?userId=${user.id}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ─── Delete conversation ──────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await fetch(`${NODE_API}/api/copilot-history/${id}?userId=${user.id}`, { method: 'DELETE' });
      setConversations(prev => prev.filter(c => c.id !== id));
      fetchStats();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // ─── Restore conversation to copilot ──────────────────────────────
  const handleRestore = (conversation) => {
    clearMessages();
    // Reload all messages into the copilot
    const msgs = conversation.messages || [];
    msgs.forEach((msg, i) => {
      addMessage({
        id: `restored-${conversation.id}-${i}`,
        role: msg.role,
        content: msg.content,
        sections: msg.sections,
        actions: msg.actions,
        pipeline: msg.pipeline,
      });
    });
    openCopilot();
  };

  // ─── Group by date ────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const groups = {};
    conversations.forEach(conv => {
      const d = new Date(conv.updated_at || conv.created_at);
      const dateStr = d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
      const today = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yestStr = yesterday.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
      const label = dateStr === today ? 'Today' : (dateStr === yestStr ? 'Yesterday' : dateStr);
      if (!groups[label]) groups[label] = [];
      groups[label].push(conv);
    });
    return groups;
  }, [conversations]);

  // ─── Search handler with debounce ─────────────────────────────────
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'edit_image', label: 'Image Edits' },
    { key: 'general_chat', label: 'Chat' },
    { key: 'upgrade', label: 'Upgrades' },
    { key: 'ask_question', label: 'Questions' },
    { key: 'search_web', label: 'Web Search' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-32">
      <PremiumMobileHeader title="Copilot History" />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 md:pt-20">
        {/* ─── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-14"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                </span>
                <span className="text-[11px] font-extrabold text-[var(--accent)] uppercase tracking-[0.25em]">
                  Neural Archive • V3.1
                </span>
              </div>
              <h1 className="text-[52px] md:text-[72px] font-black text-[var(--text-primary)] tracking-tight leading-[0.88] mb-6" style={{ letterSpacing: '-0.04em' }}>
                COPILOT<br />HISTORY
              </h1>
              <p className="text-[15px] font-medium text-[var(--text-secondary)] leading-relaxed max-w-[440px]">
                Every conversation, every insight, every pipeline — persistently stored and instantly searchable.
              </p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                <input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search conversations..."
                  className="w-full h-14 pl-14 pr-10 rounded-[16px] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] outline-none focus:ring-4 focus:ring-[var(--accent-soft)] transition-all text-sm md:text-base lg:text-lg font-semibold md:min-w-[280px]"
                />
                {search && (
                  <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--accent)]">
                    <XCircle size={16} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 copilot-scroll">
                {filters.map(f => (
                  <FilterPill
                    key={f.key}
                    label={f.label}
                    active={activeFilter === f.key}
                    onClick={() => { setActiveFilter(f.key); setPage(1); }}
                    count={f.key === 'all' ? stats.total : (stats.byIntent?.[f.key] || 0)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Stats Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          <StatCard icon={Bot} count={stats.total} label="Conversations" delay={0.1} />
          <StatCard icon={Wand2} count={stats.byIntent?.edit_image || 0} label="Image Edits" delay={0.15} />
          <StatCard icon={MessageSquare} count={stats.byIntent?.general_chat || 0} label="Chats" delay={0.2} />
          <StatCard icon={Sparkles} count={stats.byIntent?.ask_question || 0} label="Questions" delay={0.25} />
        </div>

        {/* ─── Timeline ────────────────────────────────────────── */}
        <div className="relative">
          {/* Timeline rail */}
          <div className="absolute left-[38px] top-6 bottom-0 w-[3px] bg-[var(--fill-secondary)] rounded-full hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)] via-[var(--accent-soft)] to-transparent opacity-30 rounded-full" />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <RefreshCw className="animate-spin text-[var(--accent)]" size={40} />
              <p className="text-[11px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-[0.3em]">
                Loading Neural Archive...
              </p>
            </div>
          ) : Object.entries(grouped).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 rounded-[24px] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-elevated)]/50"
            >
              <div className="w-20 h-20 rounded-full bg-[var(--fill-secondary)] flex items-center justify-center mx-auto mb-6">
                <Inbox size={40} className="text-[var(--text-tertiary)]" />
              </div>
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No Conversations Yet</h3>
              <p className="text-[14px] text-[var(--text-secondary)] font-medium mb-8">
                {search ? 'No conversations match your search.' : 'Start chatting with Assistant PRO to build your history!'}
              </p>
              <button
                onClick={() => { openCopilot(); navigate('/app'); }}
                className="px-6 py-3 bg-[var(--accent)] text-white rounded-[14px] font-bold text-[12px] uppercase tracking-[0.1em] shadow-xl shadow-[var(--accent-soft)] hover:shadow-2xl transition-all active:scale-95"
              >
                Start Conversation
              </button>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {Object.entries(grouped).map(([label, items]) => (
                <div key={label} className="relative">
                  {/* Date Header */}
                  <div className="flex items-center gap-6 mb-8 md:mb-10">
                    <div className="flex items-center justify-center w-[80px] shrink-0 hidden md:flex">
                      <div className="w-5 h-5 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--accent)] shadow-[0_0_12px_var(--accent-soft)] z-20" />
                    </div>
                    <div className="flex items-end gap-3">
                      <h2 className="text-[24px] font-black text-[var(--text-primary)] tracking-tight">{label}</h2>
                      <span className="text-[12px] font-bold text-[var(--accent)] opacity-50 mb-1 uppercase tracking-wider">
                        {items.length} {items.length === 1 ? 'conversation' : 'conversations'}
                      </span>
                    </div>
                  </div>

                  {/* Conversation Cards */}
                  <div className="grid grid-cols-1 gap-4 pl-0 md:pl-24">
                    {items.map((conv, idx) => (
                      <ConversationCard
                        key={conv.id}
                        conversation={conv}
                        index={idx}
                        onClick={handleRestore}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2.5 rounded-[12px] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[12px] font-bold disabled:opacity-30 hover:border-[var(--accent-soft)] transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-[12px] font-bold text-[var(--text-secondary)]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2.5 rounded-[12px] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[12px] font-bold disabled:opacity-30 hover:border-[var(--accent-soft)] transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopilotHistoryPage;
