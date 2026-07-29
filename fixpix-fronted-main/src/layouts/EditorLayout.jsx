import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sparkles, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import IconRail from '../components/layout/IconRail';
import SidebarPanel from '../components/layout/SidebarPanel';
import { FEATURES } from '../data/features';
import FeaturePopup from '../components/editor/FeaturePopup';
import useCanvasStore from '../store/canvasStore';
import useBreakpoint from '../hooks/useBreakpoint';
import '../styles/processing-experience.css';




const EditorLayout = () => {
    const navigate = useNavigate();
    const { user, isLoadingAuth, isElite } = useAuth();
    // Global Editor State
    const [activeTab, setActiveTab] = useState('edit');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);
    const { isMobile } = useBreakpoint();
    const uiLocked = useCanvasStore(state => state.uiLocked);

    useEffect(() => {
        // Global proxy for tool navigation (used by "Try Change BG" shortcuts)
        window.setActiveFeatureProxy = (featureId) => {
            const target = FEATURES.find(f => f.id === featureId);
            if (target) setActiveFeature(target);
        };

        return () => {
            delete window.setActiveFeatureProxy;
        };
    }, []);

    useEffect(() => {
        const openSidebar = () => setSidebarOpen(true);
        window.addEventListener('editor-open-sidebar', openSidebar);
        return () => window.removeEventListener('editor-open-sidebar', openSidebar);
    }, []);

    useEffect(() => {
        const shouldHideFloating = isMobile && isSidebarOpen;
        document.body.classList.toggle('sidebar-drawer-open', shouldHideFloating);
        return () => document.body.classList.remove('sidebar-drawer-open');
    }, [isMobile, isSidebarOpen]);


    return (
        <div style={{ display: 'flex', height: '100dvh', width: '100vw', backgroundColor: 'var(--bg-primary, #111)', overflow: 'hidden', position: 'relative' }}>
            {/* GLOBAL STUDIO BACKDROP — Spans entire page */}
            <div className="absolute inset-0 studio-dots" style={{ zIndex: 0 }} />
            <div className="absolute inset-0 studio-vignette" style={{ zIndex: 1 }} />
            <div className="absolute inset-0 studio-noise opacity-[0.03]" style={{ zIndex: 2 }} />
            
            {/* 🛸 LAYER 1: Floating Icon Rail (Vertically Centered) */}
            {!isMobile && (
                <>
                    <div className={`fixed inset-y-0 left-0 z-50 flex items-center pointer-events-none ${uiLocked ? 'ui-locked-overlay' : ''}`} style={{ padding: 0 }}>
                        <div className="pointer-events-auto">
                            <IconRail activeTab={activeTab} />
                        </div>
                    </div>
                    {activeTab === 'edit' && (
                        <div className={`fixed inset-y-0 z-40 flex items-stretch pointer-events-none ${uiLocked ? 'ui-locked-overlay' : ''}`} style={{ left: 'calc(var(--rail-w, 68px) + var(--rail-m, 16px)*2)' }}>
                            <div className="h-full pointer-events-auto flex items-center">
                                <SidebarPanel 
                                    activeTab={activeTab} 
                                    activeFeature={activeFeature}
                                    setActiveFeature={setActiveFeature}
                                    loading={isLoadingAuth}
                                    isEliteUser={isElite}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            {isMobile && (
                <>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="fixed top-[max(10px,env(safe-area-inset-top))] right-4 z-[110] w-10 h-10 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] shadow-[var(--depth-1)]"
                        aria-label="Open editor sidebar"
                    >
                        <Menu size={20} strokeWidth={2.4} />
                    </button>

                    <AnimatePresence>
                        {isSidebarOpen && (
                            <div className="fixed inset-0 z-[120] flex p-3 sm:p-4 overflow-x-hidden">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mobile-sidebar-overlay absolute inset-0"
                                    onClick={() => setSidebarOpen(false)}
                                />

                                <motion.div
                                    initial={{ x: -80, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -80, opacity: 0 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="mobile-sidebar-drawer relative z-10 flex flex-wrap h-full w-full max-w-[400px] gap-2 sm:gap-3 overflow-hidden"
                                >
                                    <IconRail
                                        mobileDrawer
                                        activeTab={activeTab}
                                        onTabSelect={(tab) => {
                                            setActiveTab(tab);
                                            setSidebarOpen(false);
                                        }}
                                    />
                                    <SidebarPanel
                                        activeTab={activeTab}
                                        activeFeature={activeFeature}
                                        setActiveFeature={(feature) => {
                                            setActiveFeature(feature);
                                            setSidebarOpen(false);
                                        }}
                                        loading={isLoadingAuth}
                                        isEliteUser={isElite}
                                    />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* Main Content Area (Canvas) — Full bleed behind floating panels */}
            <main className="flex-1 relative z-10 w-full h-full overflow-hidden">
                <div className="w-full h-full relative">
                    <Outlet />
                </div>
            </main>

            {/* Universal Feature Popup */}
            <AnimatePresence>
                {activeFeature && (
                    <FeaturePopup 
                        key="feature-popup"
                        feature={activeFeature}
                        onClose={() => setActiveFeature(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};


export default EditorLayout;
