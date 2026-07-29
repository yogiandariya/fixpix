/**
 * Notification Store (Zustand)
 * Global toast notification state for admin panel.
 */

import { create } from 'zustand';

let notificationId = 0;

const useNotificationStore = create((set, get) => ({
    notifications: [],

    addNotification: ({ type = 'info', title, message, duration = 5000 }) => {
        const id = ++notificationId;
        const notification = { id, type, title, message, duration, createdAt: Date.now() };

        set(state => ({
            notifications: [notification, ...state.notifications].slice(0, 8),
        }));

        if (duration > 0) {
            setTimeout(() => get().dismissNotification(id), duration);
        }

        return id;
    },

    dismissNotification: (id) => {
        set(state => ({
            notifications: state.notifications.filter(n => n.id !== id),
        }));
    },

    clearAll: () => set({ notifications: [] }),

    // Convenience methods
    success: (message, title = 'Success') => get().addNotification({ type: 'success', title, message }),
    error: (message, title = 'Error') => get().addNotification({ type: 'error', title, message, duration: 8000 }),
    warning: (message, title = 'Warning') => get().addNotification({ type: 'warning', title, message, duration: 6000 }),
    info: (message, title = 'Info') => get().addNotification({ type: 'info', title, message }),
}));

export default useNotificationStore;
