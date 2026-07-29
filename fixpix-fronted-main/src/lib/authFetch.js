export const authenticatedFetch = async (url, options = {}) => {
    // Get current session from localStorage
    let token = localStorage.getItem('access_token');
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    // Set up standard headers
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // First attempt
    let response = await fetch(url, { 
        ...options, 
        headers 
    });
    
    // On 401, refresh session and retry WITH fresh token
    if (response.status === 401) {
        console.warn('[Auth] Token rejected (401), attempting session refresh...');
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken })
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    token = data.access;
                    localStorage.setItem('access_token', token);
                    
                    headers.set('Authorization', `Bearer ${token}`);
                    // Retry ONCE
                    response = await fetch(url, {
                        ...options,
                        headers
                    });
                } else {
                    console.error('[Auth] Refresh token is invalid/expired.');
                    // Optionally clear tokens here or let UI components handle 401
                }
            } catch (refreshErr) {
                console.error('[Auth] Session refresh failed:', refreshErr);
            }
        }
    }
    
    return response;
};
