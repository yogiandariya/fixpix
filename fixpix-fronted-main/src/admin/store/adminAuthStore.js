/**
 * Admin Authentication Store (Zustand)
 * 
 * Completely separate from user AuthContext.
 * Uses sessionStorage (not localStorage) for security — 
 * closing the browser tab auto-destroys the admin session.
 */

import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ADMIN_API = `${API_URL}/api/admin`;

const useAdminAuthStore = create((set, get) => ({
    // State
    adminToken: sessionStorage.getItem('admin_token') || null,
    adminUser: JSON.parse(sessionStorage.getItem('admin_user') || 'null'),
    isAdminAuthenticated: !!sessionStorage.getItem('admin_token'),
    isVerified: false, // Tracks if the initial background check has completed
    isLoading: false,
    error: null,
    sessionExpiresAt: sessionStorage.getItem('admin_session_expires') || null,

    /**
     * Admin Login
     * POST /api/admin/login/
     */
    adminLogin: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch(`${ADMIN_API}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                set({ isLoading: false, error: data.error || 'Login failed' });
                return false;
            }

            // Calculate expiry (30 mins from now if not provided)
            const minutes = data.expires_in_minutes || 30;
            const expiresAt = Date.now() + (minutes * 60 * 1000);

            // Store in sessionStorage (dies with tab close)
            sessionStorage.setItem('admin_token', data.token);
            sessionStorage.setItem('admin_user', JSON.stringify(data.admin));
            sessionStorage.setItem('admin_session_expires', expiresAt.toString());

            set({
                adminToken: data.token,
                adminUser: data.admin,
                isAdminAuthenticated: true,
                isVerified: true,
                isLoading: false,
                error: null,
                sessionExpiresAt: expiresAt.toString(),
            });

            return true;
        } catch (err) {
            set({
                isLoading: false,
                error: 'Network error. Check your connection.',
            });
            return false;
        }
    },

    /**
     * Verify existing admin token on page load
     * GET /api/admin/verify/
     */
    verifyAdminToken: async () => {
        const token = sessionStorage.getItem('admin_token');
        const storedExpiry = sessionStorage.getItem('admin_session_expires');
        
        if (!token) {
            set({ isAdminAuthenticated: false, isVerified: true, adminToken: null, adminUser: null });
            return false;
        }

        // Check client-side expiry first (only log out if definitely expired)
        const expiresAt = parseInt(storedExpiry || '0');
        if (storedExpiry && Date.now() > expiresAt) {
            get().adminLogout();
            return false;
        }

        try {
            const response = await fetch(`${ADMIN_API}/verify/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid) {
                    set({
                        isAdminAuthenticated: true,
                        isVerified: true,
                        adminToken: token,
                        adminUser: data.admin || get().adminUser,
                    });
                    return true;
                }
            }

            // Explicitly invalid token or 401 from middleware
            if (response.status === 401 || response.status === 403) {
                get().adminLogout();
                return false;
            }

            // For other errors (500, etc.), trust the local session unless expired
            set({ isVerified: true });
            return !!token;
        } catch {
            // Network error during verification — keep session alive if not expired
            set({ isVerified: true });
            return !!token && (!storedExpiry || Date.now() < expiresAt);
        }
    },

    /**
     * Admin Logout — clear everything
     */
    adminLogout: () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_session_expires');
        set({
            adminToken: null,
            adminUser: null,
            isAdminAuthenticated: false,
            error: null,
            sessionExpiresAt: null,
        });
    },

    /**
     * Get remaining session time in seconds
     */
    getSessionTimeRemaining: () => {
        const expiresAt = parseInt(sessionStorage.getItem('admin_session_expires') || '0');
        const remaining = Math.max(0, expiresAt - Date.now());
        return Math.floor(remaining / 1000);
    },

    /**
     * Extend current session by re-verifying token and pushing expiry forward.
     */
    extendSession: async () => {
        const token = sessionStorage.getItem('admin_token');
        if (!token) return false;

        try {
            const response = await fetch(`${ADMIN_API}/verify/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    get().adminLogout();
                }
                return false;
            }

            const minutes = Number(import.meta.env.VITE_ADMIN_SESSION_MINUTES || 30);
            const expiresAt = Date.now() + (minutes * 60 * 1000);
            sessionStorage.setItem('admin_session_expires', expiresAt.toString());
            set({ sessionExpiresAt: expiresAt.toString() });
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),
}));

export default useAdminAuthStore;
