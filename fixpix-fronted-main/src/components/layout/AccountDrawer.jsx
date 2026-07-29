import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Save, Image as ImageIcon, User as UserIcon, ChevronRight, Sun, Moon, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SettingRow = ({ icon: Icon, iconClass, label, right, toggle, checked, onClick }) => (
    <button onClick={onClick} className="setting-row" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none' }}>
        <div className={`setting-icon ${iconClass}`} style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--fill-secondary)', color: 'var(--text-primary)' }}>
            <Icon size={16} />
        </div>
        <span className="setting-label" style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>{label}</span>
        {toggle ? (
            <div className={`ios-toggle ${checked ? 'on' : ''}`} style={{ transition: 'all 0.2s', width: '40px', height: '22px', borderRadius: '12px', backgroundColor: checked ? 'var(--accent)' : 'var(--fill-secondary)', position: 'relative' }}>
               <div style={{ position: 'absolute', top: '2px', left: checked ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
        ) : typeof right === 'string' ? (
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{right}</span>
        ) : (
            <span style={{ color: 'var(--text-secondary)' }}>{right}</span>
        )}
    </button>
);

const AccountDrawer = ({ isOpen, onClose }) => {
    const { user, logoutUser, plan } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            backgroundColor: '#000', zIndex: 999
                        }}
                    />

                    {/* Drawer */}
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, bottom: 0,
                            width: '280px', backgroundColor: 'var(--bg-primary)',
                            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                            zIndex: 1000, display: 'flex', flexDirection: 'column',
                            borderRight: '1px solid var(--border-color)',
                            overflowY: 'auto'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Account Settings</h2>
                            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="account-header" style={{ padding: '0 20px 24px' }}>
                            <div className="avatar-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div className="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {user?.username?.[0]?.toUpperCase() || 'P'}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <h4 className="user-name" style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>{user?.username || 'User'}</h4>
                                    <p className="user-email" style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{user?.email}</p>
                                </div>
                                <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '6px', 
                                    fontSize: '10px', 
                                    fontWeight: 700, 
                                    backgroundColor: plan === 'elite' ? 'var(--accent)' : 'var(--accent-soft)', 
                                    color: plan === 'elite' ? '#fff' : 'var(--accent)', 
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase'
                                }}>
                                    {plan}
                                </span>
                            </div>
                            
                            <div className="stats-row" style={{ display: 'flex', gap: '12px' }}>
                                <div className="stat-card" style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="stat-value" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>1,204</span>
                                    <span className="stat-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Images</span>
                                </div>
                                <div className="stat-card" style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="stat-value" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Mar '26</span>
                                    <span className="stat-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Joined</span>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section" style={{ padding: '0 8px' }}>
                            <SettingRow icon={isDark ? Sun : Moon} iconClass="si-theme" label="Dark Mode" toggle={true} checked={isDark} onClick={toggleTheme} />
                            <SettingRow icon={Bell} iconClass="si-notif" label="Notifications" toggle={true} checked={true} />
                            <SettingRow icon={Save} iconClass="si-save" label="Auto-save Cloud" toggle={true} checked={true} />
                            <SettingRow icon={ImageIcon} iconClass="si-export" label="HQ Export" toggle={true} checked={false} />
                        </div>
                        
                        <div className="settings-section" style={{ padding: '16px 8px 0', borderTop: '1px solid var(--border-color)', marginTop: '16px' }}>
                            <SettingRow icon={UserIcon} iconClass="si-password" label="Password" right={<ChevronRight size={14} />} />
                            <SettingRow icon={UserIcon} iconClass="si-2fa" label="2-Factor Auth" right={<ChevronRight size={14} />} />
                        </div>

                        <div style={{ marginTop: 'auto', padding: '24px 20px' }}>
                            <button onClick={logoutUser} className="logout-btn" style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                Logout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AccountDrawer;
