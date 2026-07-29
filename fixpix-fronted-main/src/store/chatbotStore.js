import { create } from 'zustand';

const useChatbotStore = create((set) => ({
    isOpen: false,
    messages: [
        { id: 1, text: "Welcome to FixPix Pro. I'm your AI Copilot. Upload an image to start optimizing with Neural Intelligence.", sender: 'bot' }
    ],
    isTyping: false,
    isProcessing: false,
    activeImageTags: [],
    activeWorkflow: null,
    currentWorkflowStep: -1,
    lastActionResult: null,
    isExplainMode: false,

    // Actions
    setIsOpen: (open) => set({ isOpen: open }),
    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setIsTyping: (isTyping) => set({ isTyping }),
    setIsProcessing: (isProcessing) => set({ isProcessing }),
    setActiveImageTags: (tags) => set({ activeImageTags: tags }),
    setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
    setCurrentWorkflowStep: (step) => set({ currentWorkflowStep: step }),
    setLastActionResult: (result) => set({ lastActionResult: result }),
    setIsExplainMode: (isExplainMode) => set({ isExplainMode }),
    toggleExplainMode: () => set((state) => ({ isExplainMode: !state.isExplainMode })),
    clearMessages: () => set({ 
        messages: [{ id: 1, text: "Welcome to FixPix Pro. I'm your AI Copilot. Upload an image to start optimizing with Neural Intelligence.", sender: 'bot' }] 
    }),
}));

export default useChatbotStore;
