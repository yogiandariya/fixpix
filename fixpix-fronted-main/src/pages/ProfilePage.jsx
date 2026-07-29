import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authenticatedFetch } from '../lib/authFetch';
import {
    User, Mail, Calendar, Image, Edit3, Check, X, Shield,
    ChevronRight, LogOut, Trash2, Camera, Sparkles, Key, AlertCircle, Loader2,
    Settings, Bell, Cloud, Download, Palette, Globe, Crown
} from 'lucide-react';

import PremiumMobileHeader from '../components/layout/PremiumMobileHeader';
import { Text } from '../components/ui/Text';

/* ────────────────────────────────────────
   THEME HELPER
   ──────────────────────────────────────── */
const useProfileTheme = () => {
    const { isDark } = useTheme();
    return {
        isDark,
        pageBg: 'var(--bg-primary)',
        sectionBg: 'var(--surface)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textTertiary: 'var(--text-tertiary)',
        border: 'var(--border-subtle)',
        accentColor: 'var(--accent)',
        hover: 'var(--fill-secondary)',
        errorBg: isDark ? 'rgba(255, 69, 58, 0.12)' : 'rgba(255, 59, 48, 0.08)',
        errorText: isDark ? '#FF453A' : '#FF3B30',
        dangerBg: isDark ? 'rgba(255, 69, 58, 0.15)' : 'rgba(255, 59, 48, 0.1)',
        dangerText: isDark ? '#FF453A' : '#FF3B30',
        separator: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
        hoverBg: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
    };
};

/* ────────────────────────────────────────
   TOAST NOTIFICATION
   ──────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        style={{
            position: 'fixed', bottom: 'max(24px, env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)',
            zIndex: 200, display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            background: type === 'error' ? 'var(--error)' : 'var(--accent)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            maxWidth: 'calc(100% - 24px)',
            width: 'fit-content',
        }}
    >
        {type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
        <Text as="span" variant="subhead" tone="inverse" className="font-semibold">
            {message}
        </Text>
    </motion.div>
);

/* ────────────────────────────────────────
   FLOATING SECTION
   ──────────────────────────────────────── */
const FloatingSection = ({ label, footer, children, t, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay, ease: [0.25, 1, 0.5, 1] }}
        style={{ marginBottom: 28 }}
    >
        {label && (
            <Text as="div" variant="caption" tone="tertiary" className="font-semibold uppercase tracking-[0.12em] px-[var(--space-6)] pb-[var(--space-2)]">
                {label}
            </Text>
        )}
        <div style={{
            borderRadius: 'var(--radius-xl)',
            background: t.isDark ? 'var(--surface-elevated)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(30px) saturate(210%)',
            WebkitBackdropFilter: 'blur(30px) saturate(210%)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--depth-1)',
            overflow: 'hidden',
        }}>
            {children}
        </div>
        {footer && (
            <Text as="div" variant="caption" tone="tertiary" className="px-[var(--space-6)] pt-[var(--space-2)] opacity-70">
                {footer}
            </Text>
        )}
    </motion.div>
);

/* ────────────────────────────────────────
   INFO ROW
   ──────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, isLast, editable, onEdit, t }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
        minHeight: 60, padding: '10px var(--space-6)',
        borderBottom: isLast ? 'none' : `1px solid ${t.separator}`,
    }}>
        <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, background: 'var(--accent-soft)',
        }}>
            <Icon size={16} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <Text as="div" variant="caption" tone="tertiary" className="mb-px">
                {label}
            </Text>
            <Text as="div" variant="subhead" tone="primary" className="font-medium truncate">
                {value || '—'}
            </Text>
        </div>
        {editable && (
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--fill-tertiary)',
                    border: 'none', cursor: 'pointer', color: t.textSecondary, flexShrink: 0,
                }}
            >
                <Edit3 size={14} strokeWidth={1.75} />
            </motion.button>
        )}
    </div>
);

/* ────────────────────────────────────────
   ACTION ROW
   ──────────────────────────────────────── */
const ActionRow = ({ icon: Icon, title, subtitle, destructive, onClick, showChevron, isLast, t }) => (
    <motion.div
        onClick={onClick}
        whileTap={onClick ? { scale: 0.99 } : {}}
        style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
            minHeight: 60, padding: '10px var(--space-6)',
            cursor: onClick ? 'pointer' : 'default',
            borderBottom: isLast ? 'none' : `1px solid ${t.separator}`,
        }}
        whileHover={{ background: t.hoverBg }}
    >
        <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, background: destructive ? t.dangerBg : 'var(--accent-soft)',
        }}>
            <Icon size={16} strokeWidth={1.75} style={{ color: destructive ? t.dangerText : 'var(--accent)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <Text as="div" variant="subhead" tone={destructive ? 'accent' : 'primary'} className="font-medium">
                {title}
            </Text>
            {subtitle && <Text as="div" variant="caption" tone="tertiary" className="mt-px">{subtitle}</Text>}
        </div>
        {showChevron && <ChevronRight size={16} strokeWidth={2} style={{ color: t.textSecondary, opacity: 0.5 }} />}
    </motion.div>
);

/* ────────────────────────────────────────
   EDIT MODAL
   ──────────────────────────────────────── */
const EditModal = ({ field, value, onSave, onCancel, saving }) => {
    const [inputValue, setInputValue] = useState(value || '');

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (inputValue.trim()) onSave(inputValue.trim());
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleSubmit}
                style={{
                    width: 'min(380px, calc(100% - 48px))',
                    borderRadius: '32px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--depth-3)',
                    overflow: 'hidden',
                }}
            >
                <div style={{ padding: '20px 24px 0' }}>
                    <Text as="h3" variant="headline" tone="primary" className="m-0 font-semibold">
                        Edit {field}
                    </Text>
                </div>
                <div style={{ padding: '16px 24px' }}>
                    <input
                        type={field === 'Email' ? 'email' : 'text'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        placeholder={`Enter new ${field.toLowerCase()}`}
                        style={{
                            width: '100%', height: '52px', padding: '0 20px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1.5px solid var(--border-subtle)',
                            background: 'var(--fill-secondary)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 150ms ease',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                </div>
                <div style={{
                    display: 'flex', gap: 8,
                    padding: '0 24px 20px',
                    justifyContent: 'flex-end',
                }}>
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={onCancel}
                        disabled={saving}
                        style={{
                            height: '52px', padding: '0 24px', borderRadius: '999px',
                            background: 'var(--fill-tertiary)', color: 'var(--text-primary)',
                            border: 'none', cursor: 'pointer',
                            opacity: saving ? 0.5 : 1,
                        }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        disabled={saving || !inputValue.trim()}
                        style={{
                            height: '52px', padding: '0 24px', borderRadius: '999px',
                            background: 'var(--accent)', color: 'white',
                            border: 'none', cursor: 'pointer',
                            opacity: (saving || !inputValue.trim()) ? 0.6 : 1,
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                        {saving ? 'Saving...' : 'Save'}
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

/* ────────────────────────────────────────
   PASSWORD CHANGE MODAL
   ──────────────────────────────────────── */
const PasswordModal = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setSaving(true);
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/api/profile/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setError(data.error || 'Failed to change password');
                return;
            }

            setSuccess(true);
            setTimeout(() => onClose(), 1500);
        } catch {
            setError('Could not connect to server');
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        width: '100%', height: '52px', padding: '0 16px',
        borderRadius: '24px',
        border: '1.5px solid var(--border-subtle)',
        background: 'var(--fill-secondary)',
        color: 'var(--text-primary)',
        outline: 'none', boxSizing: 'border-box',
        marginBottom: 10,
        transition: 'border-color 150ms ease',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleSubmit}
                style={{
                    width: 'min(380px, calc(100% - 48px))',
                    borderRadius: '32px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--depth-3)',
                    overflow: 'hidden',
                }}
            >
                <div style={{ padding: '20px 24px 0' }}>
                    <Text as="h3" variant="headline" tone="primary" className="m-0 font-semibold">
                        Change Password
                    </Text>
                </div>
                <div style={{ padding: '16px 24px' }}>
                    <input
                        type="password" placeholder="Current password" value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)} autoFocus style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                    <input
                        type="password" placeholder="New password (min 6 chars)" value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                    <input
                        type="password" placeholder="Confirm new password" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} style={{ ...inputStyle, borderRadius: 'var(--radius-lg)', marginBottom: 0 }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                    {error && (
                        <div style={{ color: 'var(--error)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ color: 'var(--success, #34C759)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Check size={14} /> Password changed successfully!
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '0 24px 20px', justifyContent: 'flex-end' }}>
                    <motion.button
                        type="button" whileTap={{ scale: 0.97 }} onClick={onClose}
                        style={{
                            padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--fill-tertiary)', color: 'var(--text-primary)',
                            border: 'none', cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        type="submit" whileTap={{ scale: 0.97 }}
                        disabled={saving || !oldPassword || !newPassword || !confirmPassword}
                        style={{
                            padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--accent)', color: 'white',
                            border: 'none', cursor: 'pointer',
                            opacity: (saving || !oldPassword || !newPassword || !confirmPassword) ? 0.6 : 1,
                        }}
                    >
                        {saving ? 'Changing...' : 'Change Password'}
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

/* ────────────────────────────────────────
   PROFILE PAGE
   ──────────────────────────────────────── */
const ProfilePage = () => {
    const { user, isElite, isPro, plan, isSubscribed, logoutUser } = useAuth();
    const t = useProfileTheme();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editField, setEditField] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [subscription, setSubscription] = useState(null);

    const [prefs, setPrefs] = useState({
        notifications: true,
        cloudSave: true,
        hqExport: false,
    });

    const fileInputRef = React.useRef(null);

    const toggleTimeout = React.useRef(null);

    const togglePref = (key) => {
        const newPrefs = { ...prefs, [key]: !prefs[key] };
        setPrefs(newPrefs);
        
        if (toggleTimeout.current) clearTimeout(toggleTimeout.current);
        
        if (user) {
            toggleTimeout.current = setTimeout(async () => {
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                await authenticatedFetch(`${API_URL}/api/profile/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferences: newPrefs })
                });
            }, 600);
        }
    };

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                
                // Fetch Django Profile
                const profileRes = await authenticatedFetch(`${API_URL}/api/profile/`);
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setProfile(data);
                    if (data.preferences) setPrefs(data.preferences);
                }

                // Fetch Subscription from Django Backend
                const subResponse = await authenticatedFetch(`${API_URL}/api/subscriptions/status/`).catch(() => null);

                if (subResponse && subResponse.ok) {
                    const subData = await subResponse.json();
                    setSubscription(subData);
                }

            } catch (err) {
                console.warn('Profile/Sub fetch failed', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = async (newValue) => {
        if (!editField) return;
        setSaving(true);
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            
            if (editField.key === 'email') {
                showToast('Email modification not supported', 'error');
            } else if (editField.key === 'first_name') {
                // Assume Full Name edit
                const parts = newValue.trim().split(' ');
                const first_name = parts[0];
                const last_name = parts.slice(1).join(' ');
                
                const response = await authenticatedFetch(`${API_URL}/api/profile/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ first_name, last_name })
                });
                if (!response.ok) throw new Error('Failed to update profile');
                
                setProfile(prev => ({ ...prev, first_name, last_name }));
                showToast(`Full Name updated`);
            }
        } catch (err) {
            showToast(err.message || 'Update failed', 'error');
        } finally {
            setSaving(false);
            setEditField(null);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const formData = new FormData();
            formData.append('avatar', file);

            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/api/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to upload avatar');
            }

            const data = await response.json();
            setProfile(data.user);
            
            // Show toast message
            showToast('Avatar updated successfully!');
        } catch (err) {
            showToast(err.message || 'Error uploading avatar', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setSaving(true);
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/api/profile/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            showToast('Account deleted successfully.');
            // Clear all local data and redirect
            localStorage.clear();
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
            setShowDeleteConfirm(false);
        }
    };

    const displayProfile = profile || {
        username: user?.username || 'User',
        email: user?.email || '',
        first_name: '',
        last_name: '',
        date_joined: new Date().toISOString(),
        images_count: 0,
    };

    const memberSinceYear = useMemo(() => {
        return new Date(displayProfile.created_at || displayProfile.date_joined || Date.now()).getFullYear() || new Date().getFullYear();
    }, [displayProfile.created_at, displayProfile.date_joined]);

    const activePlanLabel = useMemo(() => {
        return isSubscribed ? plan.toUpperCase() : 'Free Tier';
    }, [isSubscribed, plan]);

    if (loading) {
        return (
            <div className="w-full min-h-[100dvh] flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return (
        <>
            <div className="w-full min-h-screen bg-bg-primary overflow-x-hidden overflow-y-auto pb-28 md:pb-20">
                <PremiumMobileHeader title="Profile" />
                <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-1.5 md:pt-12">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-7 md:mb-10 text-center"
                >
                    <div className="relative mb-5">
                        {/* Status Glow Ring */}
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -inset-3 rounded-[44px] bg-[var(--accent)]/20 blur-2xl"
                        />
                        <div className="relative w-28 h-28 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--accent)] to-purple-600 p-[3px] shadow-[var(--depth-2)]">
                            <div className="w-full h-full rounded-[calc(var(--radius-xl)-3px)] bg-[var(--surface-elevated)] flex items-center justify-center overflow-hidden">
                                {displayProfile.avatar_url ? (
                                    <img src={displayProfile.avatar_url} alt="Avatar" loading="lazy" decoding="async" className="w-full h-auto min-h-full object-cover" />
                                ) : (
                                    <Text as="span" variant="largeTitle" tone="accent" className="font-black">
                                        {displayProfile.username[0].toUpperCase()}
                                    </Text>
                                )}
                            </div>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleAvatarUpload} 
                        />
                        <motion.button 
                            whileHover={{ y: -2, scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border-4 border-[var(--bg-primary)] shadow-[var(--depth-1)] flex items-center justify-center text-[var(--accent)] cursor-pointer transition-transform"
                        >
                            <Camera size={18} strokeWidth={2.5} />
                        </motion.button>
                    </div>
                    <div className="flex flex-col items-center gap-2.5 mt-4">
                        {isSubscribed && (
                            <div className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-lg border border-white/20 ${
                                isElite ? 'bg-amber-500 shadow-amber-500/20' : 'bg-indigo-500 shadow-indigo-500/20'
                            }`}>
                                {isElite ? <Crown size={16} className="text-white" /> : <Sparkles size={16} className="text-white" />}
                                <Text as="span" variant="caption" tone="inverse" className="font-black uppercase tracking-[0.2em]">
                                    {plan} Member
                                </Text>
                            </div>
                        )}
                        <Text as="span" variant="caption" tone="tertiary" className="font-black uppercase tracking-[0.2em]">
                            Member since {memberSinceYear}
                        </Text>
                    </div>
                </motion.div>

                {/* Membership Card */}
                <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="relative mb-5 md:mb-8 rounded-[var(--radius-xl)] overflow-hidden p-5 md:p-8 text-white shadow-[var(--depth-2)] cursor-pointer border border-white/10"
                    onClick={() => navigate('/app/pricing')}
                    style={{ 
                        background: subscription?.plan?.name === 'elite' 
                            ? 'linear-gradient(135deg, #FF9500 0%, #FF2D55 100%)' 
                            : 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
                        willChange: 'transform'
                    }}
                >
                    <div className="relative z-10">
                        <div className="flex items-center justify-between gap-3 mb-7 md:mb-10">
                            <Text as="h3" variant="title3" tone="primary" className="font-black italic">
                                FixPix Subscription
                            </Text>
                            {isElite ? <Crown size={28} className="opacity-60" /> : <Sparkles size={28} className="opacity-60" />}
                        </div>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <Text as="p" variant="caption" tone="inverse" className="font-black opacity-90 mb-1.5 uppercase tracking-[0.15em]">
                                    Active Plan
                                </Text>
                                <Text as="p" variant="title2" tone="inverse" className="font-black leading-none">
                                    {activePlanLabel}
                                </Text>
                            </div>
                            <div className="text-right">
                                <Text as="p" variant="caption" tone="inverse" className="font-black opacity-90 mb-1.5 uppercase tracking-[0.15em]">
                                    Status
                                </Text>
                                <Text as="p" variant="subhead" tone="inverse" className="font-black uppercase tracking-[0.2em]">
                                    {isSubscribed ? 'Active' : 'Upgrade'}
                                </Text>
                            </div>
                        </div>
                    </div>
                    {/* Gloss Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </motion.div>

                {/* Account Section */}
                <FloatingSection label="Account Details" t={t} delay={0.1}>
                    <InfoRow icon={User} label="FullName" value={`${displayProfile.first_name} ${displayProfile.last_name}`.trim() || 'Not set'} editable onEdit={() => setEditField({ field: 'Full Name', key: 'first_name', value: displayProfile.first_name })} t={t} />
                    <InfoRow icon={Mail} label="Email" value={displayProfile.email} editable onEdit={() => setEditField({ field: 'Email', key: 'email', value: displayProfile.email })} t={t} isLast />
                </FloatingSection>

                {/* Preferences */}
                <FloatingSection label="App Preferences" t={t} delay={0.2}>
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-subtle gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-8 h-8 rounded-[16px] bg-orange-100 flex items-center justify-center text-orange-500">
                                <Bell size={18} />
                            </div>
                            <Text as="span" variant="body" tone="primary" className="font-bold">
                                Notifications
                            </Text>
                        </div>
                        <motion.div 
                            onClick={() => togglePref('notifications')}
                            className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-all border border-[var(--border-subtle)] ${prefs.notifications ? 'bg-[var(--accent)]' : 'bg-[var(--fill-secondary)]'}`}
                        >
                            <motion.div 
                                animate={{ x: prefs.notifications ? 20 : 0 }}
                                className="w-5 h-5 bg-white rounded-full shadow-lg"
                            />
                        </motion.div>
                    </div>
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-subtle gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-8 h-8 rounded-[16px] bg-blue-100 flex items-center justify-center text-blue-500">
                                <Cloud size={18} />
                            </div>
                            <Text as="span" variant="body" tone="primary" className="font-bold">
                                Cloud Autosave
                            </Text>
                        </div>
                        <motion.div 
                            onClick={() => togglePref('cloudSave')}
                            className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-all border border-[var(--border-subtle)] ${prefs.cloudSave ? 'bg-[var(--accent)]' : 'bg-[var(--fill-secondary)]'}`}
                        >
                            <motion.div 
                                animate={{ x: prefs.cloudSave ? 20 : 0 }}
                                className="w-5 h-5 bg-white rounded-full shadow-lg"
                            />
                        </motion.div>
                    </div>
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-subtle gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-8 h-8 rounded-[16px] bg-purple-100 flex items-center justify-center text-purple-500">
                                <Download size={18} />
                            </div>
                            <Text as="span" variant="body" tone="primary" className="font-bold">
                                HQ Export
                            </Text>
                        </div>
                        <motion.div 
                            onClick={() => togglePref('hqExport')}
                            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${prefs.hqExport ? 'bg-[#34C759]' : 'bg-fill-secondary'}`}
                        >
                            <motion.div 
                                animate={{ x: prefs.hqExport ? 20 : 0 }}
                                className="w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </motion.div>
                    </div>
                    <ActionRow icon={Globe} title="Language" subtitle="English (US)" showChevron t={t} isLast />
                </FloatingSection>

                {/* Security */}
                <FloatingSection label="Security" t={t} delay={0.3}>
                    <ActionRow icon={Key} title="Update Password" subtitle="Last changed 3 months ago" onClick={() => setShowPasswordModal(true)} showChevron t={t} />
                    <ActionRow icon={Shield} title="2FA Verification" subtitle="Highly recommended" showChevron t={t} isLast />
                </FloatingSection>

                {/* Actions */}
                <FloatingSection t={t} delay={0.4}>
                    <ActionRow icon={LogOut} title="Sign Out" destructive onClick={() => logoutUser()} t={t} />
                    <ActionRow icon={Trash2} title="Delete Account" subtitle="Permanent action" destructive onClick={() => setShowDeleteConfirm(true)} isLast t={t} />
                </FloatingSection>
            </div>
        </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {editField && (
                    <EditModal
                        field={editField.field}
                        value={editField.value}
                        onSave={handleSave}
                        onCancel={() => setEditField(null)}
                        saving={saving}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPasswordModal && (
                    <PasswordModal
                        onClose={() => setShowPasswordModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.25)',
                            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                width: 'min(380px, calc(100% - 48px))',
                                borderRadius: 'var(--radius-2xl)',
                                background: 'var(--surface)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: 'var(--depth-3)',
                                padding: 24,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                                    background: t.dangerBg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Trash2 size={20} style={{ color: t.dangerText }} />
                                </div>
                                <Text as="h3" variant="headline" tone="primary" className="font-semibold m-0">
                                    Delete Account?
                                </Text>
                            </div>
                            <Text as="p" variant="callout" tone="secondary" className="mb-5">
                                This will permanently delete your account and all your data. This action cannot be undone.
                            </Text>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowDeleteConfirm(false)}
                                    style={{
                                        padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                                        background: 'var(--fill-tertiary)', color: t.textPrimary,
                                        border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleDeleteAccount}
                                    style={{
                                        padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                                        background: 'var(--error)', color: 'white',
                                        border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    Delete Account
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </AnimatePresence>

            {/* Spinner keyframes */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
};

export default ProfilePage;
