import { create } from 'zustand'

const useToastStore = create((set, get) => ({
  toasts: [],
  
  // Add toast
  show: (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    set(state => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }))
    // Auto remove
    setTimeout(() => {
      get().remove(id)
    }, duration)
    return id
  },
  
  // Shorthand methods
  success: (msg, duration) => 
    get().show(msg, 'success', duration),
  error: (msg, duration) => 
    get().show(msg, 'error', duration || 4000),
  info: (msg, duration) => 
    get().show(msg, 'info', duration),
  warning: (msg, duration) => 
    get().show(msg, 'warning', duration),
  loading: (msg) => 
    get().show(msg, 'loading', 99999), // manual remove
  
  remove: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
  
  clear: () => set({ toasts: [] })
}))

export default useToastStore
