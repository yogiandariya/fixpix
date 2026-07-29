import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import IconRail from '../components/layout/IconRail';
import SidebarPanel from '../components/layout/SidebarPanel';
import FeaturePopup from '../components/editor/FeaturePopup';
import useBreakpoint from '../hooks/useBreakpoint';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Global Sidebar State
    const [activeTab, setActiveTab] = useState('edit');
    const [activePopup, setActivePopup] = useState(null);
    const { isMobile } = useBreakpoint();
    
    // Mobile Drawer state
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const shouldHideFloating = isMobile && isSidebarOpen;
        document.body.classList.toggle('sidebar-drawer-open', shouldHideFloating);
        return () => document.body.classList.remove('sidebar-drawer-open');
    }, [isMobile, isSidebarOpen]);

    // Effect: sync route with tab (if user navigates independently, sync tab)
    useEffect(() => {
        if (location.pathname.includes('restoration')) {
            setActiveTab('edit');
        } else if (location.pathname.includes('projects') || location.pathname.includes('batch') || location.pathname.includes('ai-news')) {
            setActiveTab('tools');
        } else if (location.pathname.includes('settings') || location.pathname.includes('profile')) {
            setActiveTab('account');
        }
    }, [location.pathname]);

    // Handle IconRail clicks
    const handleTabSelect = (tabId) => {
        setActiveTab(tabId);
        
        // Smart Navigation: if clicking Edit (Pencil), automatically navigate to restoration if not there.
        if (tabId === 'edit' && !location.pathname.includes('restoration')) {
            navigate('/app/restoration');
        }
        
        // Note: For 'tools' and 'account', we do NOT force navigation because Panel 2/3 have sub-links.
        // The user clicks the panel link to navigate.
    };

    const isRestorationRoute = location.pathname.includes('restoration');
    const isMobileRestoration = isMobile && isRestorationRoute;

    const renderMobileHeader = () => {
        if (isMobileRestoration || !isMobile) return null;
        
        return (
            <header
                className="flex items-center justify-between z-40 mobile-header-bar"
                style={{
                    height: '56px', margin: '12px', padding: '0 16px',
                    borderRadius: '20px', backgroundColor: 'var(--surface)',
                    backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    position: 'sticky', top: 0, border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-soft)', flexShrink: 0,
                }}
            >
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSidebarOpen(true)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-text-main hover:bg-fill-primary/5 transition-colors"
                >
                    <Menu className="w-5 h-5" strokeWidth={1.75} />
                </motion.button>
                <span style={{ fontSize: '17px', fontWeight: 600 }} className="text-text-main">FixPix</span>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>
                    U
                </div>
            </header>
        );
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100dvh', 
            width: '100vw', 
            backgroundColor: 'var(--bg-primary)', 
            overflow: 'hidden', 
            gap: '16px',
            padding: '16px' 
        }}>
            
            {/* Desktop Unified Sidebar: IconRail + SidebarPanel */}
            {!isMobile && (
                <>
                    <IconRail activeTab={activeTab} onTabSelect={handleTabSelect} />
                    <SidebarPanel activeTab={activeTab} activePopup={activePopup} setActivePopup={setActivePopup} />
                </>
            )}

            {/* Mobile Drawer wrapper (stubbed for now to fit new layout paradigm safely) */}
            {isMobile && isSidebarOpen && (
                <div className="fixed inset-0 z-[100] flex p-3 sm:p-4 overflow-x-hidden">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mobile-sidebar-overlay"
                        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} 
                        onClick={() => setSidebarOpen(false)} 
                    />
                    <motion.div 
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="mobile-sidebar-drawer relative z-10 flex flex-wrap h-full w-full max-w-[400px] gap-2 sm:gap-3 overflow-hidden"
                    >
                        <IconRail mobileDrawer activeTab={activeTab} onTabSelect={(tab) => { handleTabSelect(tab); setSidebarOpen(false); }} />
                        <SidebarPanel activeTab={activeTab} activePopup={activePopup} setActivePopup={(p) => { setActivePopup(p); setSidebarOpen(false); }} />
                    </motion.div>
                </div>
            )}

            {/* Main Content Area */}
            <main style={{ minWidth: 0, flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100dvh', overflow: 'hidden' }}>
                {renderMobileHeader()}
                
                {/* Outlet handles rendering the Canvas (EditorPage) or other pages */}
                <div 
                    className="flex-1 relative overflow-hidden bg-white/80 dark:bg-[#1a1a1a]/40 rounded-[32px] border border-white/20 dark:border-white/5 shadow-[var(--shadow-panel)] backdrop-blur-xl"
                    style={{ flex: 1, position: 'relative' }}
                >
                    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
                        <Outlet />
                    </div>
                </div>

                {/* Overlaid Global Feature Popup (since Panel and Canvas are siblings, this renders over canvas) */}
                <FeaturePopup 
                    featureId={activePopup} 
                    title={
                        activePopup === 'faceRestoration' ? 'Face Restore' :
                        activePopup === 'superResolution' ? 'Super Resolution' :
                        activePopup === 'magicEraser' ? 'Magic Eraser' :
                        activePopup === 'removeBg' ? 'Remove BG' :
                        activePopup === 'styleTransfer' ? 'Style Transfer' :
                        activePopup === 'textToImage' ? 'Text to Image' :
                        activePopup === 'editImage' ? 'Edit Image' :
                        activePopup === 'aiTagline' ? 'AI Tagline' :
                        activePopup === 'smartFrames' ? 'Smart Frames' : ''
                    }
                    onClose={() => setActivePopup(null)} 
                />
            </main>
        </div>
    );
};

export default DashboardLayout;
