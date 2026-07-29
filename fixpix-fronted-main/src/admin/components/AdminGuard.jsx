/**
 * Admin Guard — iOS themed loading screen with var() tokens
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAdminAuthStore from '../store/adminAuthStore';
import { Shield, Loader2 } from 'lucide-react';

const ADMIN_BASE = '/admin-fixpix-secure-portal-9x7';

const AdminGuard = ({ children }) => {
    const { isAdminAuthenticated, verifyAdminToken } = useAdminAuthStore();
    const [checking, setChecking] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verify = async () => {
            // Background verification
            await verifyAdminToken();
            setChecking(false);
        };
        verify();
    }, [verifyAdminToken]);

    // If we have a token in sessionStorage, we trust it optimistically
    // This prevents the "logout on reload" issue while verification happens in background
    if (isAdminAuthenticated) {
        return children;
    }

    // If we are strictly checking and have no token yet
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-primary)' }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-[22px] flex items-center justify-center"
                            style={{
                                background: 'var(--accent, #2563eb)',
                                boxShadow: '0 12px 30px var(--accent-soft, rgba(37,99,235,0.3))',
                            }}
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <Loader2 className="w-5 h-5 animate-spin absolute -bottom-1 -right-1"
                            style={{ color: 'var(--accent, #2563eb)' }}
                        />
                    </div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--text-muted, #999)' }}>
                        Verifying admin access...
                    </p>
                </motion.div>
            </div>
        );
    }

    // Final fallback: if not authenticated and no longer checking
    return <Navigate to={`${ADMIN_BASE}/login`} state={{ from: location }} replace />;
};

export default AdminGuard;
