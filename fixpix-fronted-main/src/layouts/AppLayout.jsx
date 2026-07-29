import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import IconRail from '../components/layout/IconRail';
import BottomTabBar from '../components/layout/BottomTabBar';

const AppLayout = () => {
    const location = useLocation();

    let activeTab = 'dashboard';
    const path = location.pathname.toLowerCase();

    if (path.startsWith('/app/restoration')) activeTab = 'edit';
    else if (path.startsWith('/app/history')) activeTab = 'history';
    else if (path.startsWith('/app/projects')) activeTab = 'projects';
    else if (path.startsWith('/app/batch') || path.startsWith('/ai-news')) activeTab = 'tools';
    else if (path.startsWith('/app/pricing')) activeTab = 'pricing';
    else if (path.startsWith('/app/settings') || path.startsWith('/app/profile')) activeTab = 'account';

    return (
        <div className="w-screen min-h-[100dvh] md:h-screen overflow-hidden bg-bg-primary relative flex flex-col md:flex-row">
            {/* Fixed Floating Icon Rail (Desktop Only) */}
            <div className="fixed inset-y-0 left-0 z-[60] hidden md:flex items-center pointer-events-none">
                <div className="pointer-events-auto">
                    <IconRail activeTab={activeTab} />
                </div>
            </div>

            {/* Main Content Area */}
            <main
                className="flex-1 relative overflow-hidden bg-white/80 dark:bg-[#1a1a1a]/40 md:rounded-[32px] md:border md:border-white/20 dark:md:border-white/5 md:shadow-[var(--shadow-panel)] md:backdrop-blur-xl md:my-4 md:mr-4"
                style={{
                    marginLeft: 'var(--main-margin-left, 0)',
                }}
            >
                <div
                    id="main-content"
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-[calc(110px+env(safe-area-inset-bottom,20px))] md:pb-10"
                >
                    <Outlet />
                </div>
            </main>

            {/* Bottom Tab Bar (Mobile Only - Global Fixed Overlay) */}
            {!path.startsWith('/app/restoration') && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
                    <BottomTabBar />
                </div>
            )}
        </div>
    );
};

export default AppLayout;
