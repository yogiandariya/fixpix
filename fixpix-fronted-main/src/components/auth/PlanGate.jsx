import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * PlanGate Component
 * 
 * Logic-heavy gate to conditionally render premium features.
 * Supports fallback UI (e.g., UpgradeCards) to resolve SaaS inconsistencies v3.
 */
const PlanGate = ({ 
  children, 
  required = 'elite', 
  fallback = null, 
  showLoading = true 
}) => {
  const { plan, loading, isElite, isPro, isSubscribed } = useAuth();

  // 1. Show loading state if auth isn't resolved yet (Zero-Flicker)
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
      </div>
    );
  }

  // 2. Evaluate Permission
  let hasAccess = false;
  
  if (required === 'elite') {
    hasAccess = isElite;
  } else if (required === 'pro') {
    hasAccess = isPro;
  } else if (required === 'any') {
    hasAccess = isSubscribed;
  } else if (required === 'free') {
    hasAccess = true; // Everyone can see free
  }

  // 3. Render
  if (hasAccess) {
    return <>{children}</>;
  }

  // 4. Return Fallback if permission denied
  return <>{fallback}</>;
};

export default PlanGate;
