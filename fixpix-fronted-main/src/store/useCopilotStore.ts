import { create } from 'zustand';

export type AIIntent = 'navigate' | 'ask_question' | 'upgrade' | 'edit_image' | 'general_chat' | 'search_web' | 'unknown';

export interface CopilotSection {
  title: string;
  content: string;
  icon?: string;
}

export interface CopilotAction {
  label: string;
  action: 'navigate' | 'execute' | 'upgrade';
  target: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: AIIntent;
  pipeline?: any[];
  sections?: CopilotSection[];
  actions?: CopilotAction[];
  isStreaming?: boolean;
  imageData?: string; // Base64 or URL of attached image
  processedImage?: string; // AI generated/edited result
  suggestions?: any[]; // Interactive tool suggestions
  confidence?: number;
  responseType?: 'text' | 'action' | 'interactive_list' | 'guide' | 'error';
  guideData?: {
    steps: { title: string; content: string }[];
    pro_tip?: string;
  };
  isError?: boolean;
  pipeline?: any[];
}

export type AIIntent = 'navigate' | 'ask_question' | 'upgrade' | 'edit_image' | 'general_chat' | 'search_web' | 'repeat_action' | 'undo_action' | 'unknown';

// Live context object sent with every request
export interface CopilotContext {
  page: string;
  hasImage: boolean;
  activeTool: string | null;
  lastAction: string | null;
}

// Pipeline progress tracking
export interface PipelineProgress {
  status: 'idle' | 'analyzing' | 'processing' | 'completed' | 'partial' | 'failed';
  currentStep: number;
  totalSteps: number;
  currentTool: string | null;
  toolName: string | null;
  stepsCompleted: number;
  processedImage: string | null;
}

interface CopilotState {
  isOpen: boolean;
  messages: CopilotMessage[];
  isThinking: boolean;
  
  // Active Session Tracking
  activeConversationId: string | null;

  // Actions
  toggleCopilot: () => void;
  openCopilot: () => void;
  closeCopilot: () => void;
  addMessage: (message: CopilotMessage) => void;
  updateMessage: (id: string, update: Partial<CopilotMessage>) => void;
  appendToMessage: (id: string, content: string) => void;
  setThinking: (isThinking: boolean) => void;
  setActiveConversationId: (id: string | null) => void;
  
  // Context Actions
  setCurrentPage: (page: string) => void;
  setUserPlan: (plan: 'Free' | 'Pro' | 'Elite') => void;
  setActiveImage: (image: string | null) => void;
  setActiveTool: (tool: string | null) => void;
  setLastAction: (action: string | null) => void;
  setPipelineProgress: (progress: Partial<PipelineProgress>) => void;
  resetPipeline: () => void;
  clearMessages: () => void;

  // Context getters
  getConversationHistory: () => { role: string; content: string }[];
  getLiveContext: () => CopilotContext;
}

export const useCopilotStore = create<CopilotState>((set, get) => ({
  isOpen: false,
  messages: [{
    id: 'welcome',
    role: 'assistant',
    content: "Hi! I'm **Assistant PRO** — your AI copilot for FixPix. I can edit images, navigate the platform, explain features, and more.\n\nWhat would you like to do?"
  }],
  isThinking: false,
  activeConversationId: null,
  
  currentPage: 'home',
  userPlan: 'Free',
  activeImage: null,
  activeTool: null,
  lastAction: null,
  pipelineProgress: {
    status: 'idle',
    currentStep: 0,
    totalSteps: 0,
    currentTool: null,
    toolName: null,
    stepsCompleted: 0,
    processedImage: null,
  },

  toggleCopilot: () => set((state) => ({ isOpen: !state.isOpen })),
  openCopilot: () => set({ isOpen: true }),
  closeCopilot: () => set({ isOpen: false }),
  
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  updateMessage: (id, update) => set((state) => ({
    messages: state.messages.map(msg => msg.id === id ? { ...msg, ...update } : msg)
  })),

  // Efficient append for streaming — avoids full message replacement
  appendToMessage: (id, content) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, content: msg.content + content } : msg
    )
  })),

  setThinking: (isThinking) => set({ isThinking }),

  setCurrentPage: (currentPage) => set({ currentPage }),
  setUserPlan: (userPlan) => set({ userPlan }),
  setActiveImage: (activeImage) => set({ activeImage }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setLastAction: (action) => set({ lastAction: action }),
  setPipelineProgress: (progress) => set((state) => ({
    pipelineProgress: { ...state.pipelineProgress, ...progress }
  })),
  resetPipeline: () => set({
    pipelineProgress: {
      status: 'idle', currentStep: 0, totalSteps: 0,
      currentTool: null, toolName: null, stepsCompleted: 0, processedImage: null
    }
  }),
  clearMessages: () => set({ 
    activeConversationId: null,
    messages: [{
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm **Assistant PRO** — your AI copilot for FixPix. I can edit images, navigate the platform, explain features, and more.\n\nWhat would you like to do?"
    }] 
  }),

  // Returns last N messages for context injection into the AI prompt
  getConversationHistory: () => {
    const msgs = get().messages.filter(m => m.id !== 'welcome' && m.content);
    return msgs.slice(-8).map(m => ({ role: m.role, content: m.content.substring(0, 300) }));
  },

  // Returns the live context object for the memory system
  getLiveContext: () => ({
    page: get().currentPage,
    hasImage: !!get().activeImage,
    activeTool: get().activeTool,
    lastAction: get().lastAction,
  })
}));
