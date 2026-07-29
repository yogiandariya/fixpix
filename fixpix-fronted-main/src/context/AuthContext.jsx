import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import useToastStore from '../store/toastStore';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const queryClient = useQueryClient();
    const toast = useToastStore();

    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    // ─── Phase 1: Initialize Session ──────────────────────────────
    useEffect(() => {
        const initialize = async () => {
            const token = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');

            if (token) {
                setSession({ access_token: token, refresh_token: refreshToken });
            }
            setIsLoadingAuth(false);
        };

        // Listen for Supabase shifts (SSOT)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
                localStorage.setItem('access_token', session.access_token);
                localStorage.setItem('refresh_token', session.refresh_token);
            }
        });

        initialize();
        return () => subscription.unsubscribe();
    }, []);

    // ─── Phase 2: Global Profile Query (SSOT) ─────────────────────
    const { data: user, isLoading: isProfileLoading, refetch: refetchProfile } = useQuery({
        queryKey: ['userProfile', session?.access_token],
        queryFn: async () => {
            if (!session?.access_token) return null;
            const res = await fetch(`${API_URL}/api/profile/`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (!res.ok) {
                if (res.status === 401) {
                    logoutUser();
                    throw new Error('Session expired');
                }
                throw new Error('Failed to load profile');
            }
            return res.json();
        },
        enabled: !!session?.access_token,
    });

    const { data: subscriptionStatus, isLoading: isSubscriptionLoading, refetch: refetchSubscription } = useQuery({
        queryKey: ['subscriptionStatus', session?.access_token],
        queryFn: async () => {
            if (!session?.access_token) return null;
            const res = await fetch(`${API_URL}/api/subscriptions/status/`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (!res.ok) return null;
            return res.json();
        },
        enabled: !!session?.access_token,
        staleTime: 15000,
    });

    // ─── Plan & Status Helpers (Namespaced) ────────────────────────
    const saasData = useMemo(() => {
        // We trust user_metadata from the session/JWT as primary SSOT
        const metadata = user?.user_metadata || {};
        const backendTier = String(subscriptionStatus?.plan?.tier || '').toLowerCase();
        const rawPlan = backendTier || metadata.fixpix_plan || 'free';
        const status = metadata.fixpix_plan_status || 'active';
        const expiry = metadata.fixpix_expiry ? new Date(metadata.fixpix_expiry) : null;
        
        const isExpired = expiry && expiry < new Date();
        const plan = isExpired ? 'free' : rawPlan;

        // Normalize plan name (remove _yearly or similar suffixes)
        const activePlan = plan.split('_')[0].toLowerCase();
        
        return {
            plan: activePlan,
            isElite: activePlan === 'elite',
            isPro: activePlan === 'pro' || activePlan === 'elite',
            isSubscribed: activePlan !== 'free',
            status,
            expiry,
            isExpired
        };
    }, [user, subscriptionStatus]);

    const refreshSession = async () => {
        setIsLoadingAuth(true);
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            
            // Invalidate React Query cache
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
            
            await Promise.all([refetchProfile(), refetchSubscription()]);
            
            return true;
        } catch (e) {
            console.error('Session refresh failed:', e);
            return false;
        } finally {
            setIsLoadingAuth(false);
        }
    };

    const loginUser = async (identifier, password) => {
        try {
            const response = await fetch(`${API_URL}/api/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: identifier, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.detail || 'Login failed');
                return false;
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setSession({ access_token: data.access, refresh_token: data.refresh });
            return true;
        } catch (error) {
            toast.error('Network error. Check your connection.');
            return false;
        }
    };

    const loginWithGoogle = async (credential) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/google/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential })
            });

            if (!response.ok) {
                toast.error('Google login failed');
                return false;
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.tokens.access);
            localStorage.setItem('refresh_token', data.tokens.refresh);
            setSession({ access_token: data.tokens.access, refresh_token: data.tokens.refresh });
            return true;
        } catch (error) {
            toast.error('Google Login Error');
            return false;
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setSession(null);
        queryClient.removeQueries({ queryKey: ['userProfile'] });
        window.location.href = '/';
    };

    const contextData = {
        user,
        session,
        loading: isLoadingAuth || (!!session && (isProfileLoading || isSubscriptionLoading)),
        isLoadingAuth,
        ...saasData,
        loginUser,
        loginWithGoogle,
        logoutUser,
        refreshSession
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
