/**
 * Notification System — Toast notifications for admin panel
 * Renders in portal, stacked with auto-dismiss progress bar.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import useNotificationStore from '../store/useNotificationStore';

const ICON_MAP = {
    success: { icon: CheckCircle, color: '#10b981' },
    error: { icon: XCircle, color: '#ef4444' },
    warning: { icon: AlertTriangle, color: '#f59e0b' },
    info: { icon: Info, color: '#3b82f6' },
};

const Toast = ({ notification, onDismiss }) => {
    const [progress, setProgress] = useState(100);
    const { icon: Icon, color } = ICON_MAP[notification.type] || ICON_MAP.info;

    useEffect(() => {
        if (notification.duration <= 0) return;
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 100 - (elapsed / notification.duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, [notification.duration]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-80 rounded-[16px] overflow-hidden"
            style={{
                backgroundColor: 'var(--popup-bg, #fff)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid var(--glass-border, rgba(0,0,0,0.08))',
            }}
        >
            <div className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15`, color }}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold" style={{ color }}>{notification.title}</p>
                    <p className="text-[12px] font-medium mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{notification.message}</p>
                </div>
                <button onClick={() => onDismiss(notification.id)}
                    className="p-1 rounded-[6px] transition-colors flex-shrink-0 opacity-40 hover:opacity-100"
                    style={{ color: 'var(--text-muted)' }}>
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Progress bar */}
            {notification.duration > 0 && (
                <div className="h-[2px] w-full" style={{ backgroundColor: 'var(--divider, rgba(0,0,0,0.04))' }}>
                    <div className="h-full transition-all ease-linear" style={{ width: `${progress}%`, backgroundColor: color, opacity: 0.6 }} />
                </div>
            )}
        </motion.div>
    );
};

const NotificationSystem = () => {
    const { notifications, dismissNotification } = useNotificationStore();

    return (
        <div className="fixed top-4 right-4 z-[9997] flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {notifications.map(n => (
                    <Toast key={n.id} notification={n} onDismiss={dismissNotification} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem;
