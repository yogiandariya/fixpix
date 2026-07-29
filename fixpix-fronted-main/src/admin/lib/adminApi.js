/**
 * Admin API Module for FixPix Admin Panel
 *
 * Separate from public API. Uses admin JWT from sessionStorage.
 * Auto-redirects to admin login on 401/403.
 */

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ADMIN_BASE = '/admin-fixpix-secure-portal-9x7';

export const adminEndpoints = {
    login: `${API_URL}/api/admin/login/`,
    verify: `${API_URL}/api/admin/verify/`,
    dashboard: `${API_URL}/api/admin/dashboard/`,
    users: `${API_URL}/api/admin/users/`,
    userDetail: (pk) => `${API_URL}/api/admin/users/${pk}/detail/`,
    userAction: (pk) => `${API_URL}/api/admin/users/${pk}/`,
    jobs: `${API_URL}/api/admin/jobs/`,
    analytics: `${API_URL}/api/admin/analytics/`,
    activity: `${API_URL}/api/admin/activity/`,
    insights: `${API_URL}/api/admin/insights/`,
    systemHealth: `${API_URL}/api/admin/system-health/`,
};

/**
 * Authenticated fetch for admin API.
 * Automatically adds admin JWT and handles session failures.
 */
export const adminFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem('admin_token');

    if (!token) {
        window.location.href = `${ADMIN_BASE}/login`;
        throw new Error('No admin session');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_session_expiry');
        window.location.href = `${ADMIN_BASE}/login`;
        throw new Error('Admin session expired');
    }

    return response;
};

/**
 * Convenience: fetch + parse JSON.
 */
export const adminFetchJSON = async (url, options = {}) => {
    const response = await adminFetch(url, options);
    return response.json();
};
