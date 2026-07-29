import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useToastStore from '../store/toastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';



// Core Editor Tools
import UniversalCanvas from '../components/editor/UniversalCanvas';
import OnboardingTour from '../components/features/OnboardingTour';
import QuickStartModal from '../components/features/QuickStartModal';
import KeyboardShortcutsHelp from '../components/ui/KeyboardShortcutsHelp';
import ExportModal from '../components/features/ExportModal';

// Mobile Components
import FloatingCapsuleToolbar from '../components/mobile/FloatingCapsuleToolbar';
import MobileEditorHeader from '../components/mobile/MobileEditorHeader';

// Context
import { useCommand } from '../context/CommandContext';
import useCanvasStore from '../store/canvasStore';

// Hooks
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import useBreakpoint from '../hooks/useBreakpoint';

// Styles
import '../styles/studio-system.css';
import '../styles/mobile-studio.css'; // Premium Dark Studio Theme
import '../styles/background-studio.css'; // Background Studio Styles
import '../styles/tagline-generator.css'; // Tagline Generator Styles

/* ────────────────────────────────────────────────────
   EDITOR CONTENT
   ──────────────────────────────────────────────────── */
const EditorContent = () => {
    const toast = useToastStore();
    const [quickStartDone, setQuickStartDone] = useState(false);
    const { isMobile } = useBreakpoint();
    
    const navigate = useNavigate();
    const location = useLocation();
    const toolParam = useMemo(() => new URLSearchParams(location.search).get('tool'), [location.search]);
    const preloadImage = location.state?.preloadImage;

    const { commitCommands, toggleCommand } = useCommand();
    
    // Canvas Store variables
    const originalImage = useCanvasStore(state => state.originalImage);
    const setOriginalImage = useCanvasStore(state => state.setOriginalImage);
    const isProcessing = useCanvasStore(state => state.isProcessing);
    const isExportModalOpen = useCanvasStore(state => state.isExportModalOpen);
    const setExportModalOpen = useCanvasStore(state => state.setExportModalOpen);
    const undo = useCanvasStore(state => state.undo);
    const redo = useCanvasStore(state => state.redo);
    const reset = useCanvasStore(state => state.reset);

    // Derive activeTab from URL for layout consistency
    const activeTab = location.pathname.includes('restoration') ? 'edit' : 'dashboard';

    useEffect(() => {
        if (isMobile) {
            document.body.classList.add('in-mobile-editor');
        } else {
            document.body.classList.remove('in-mobile-editor');
        }

        return () => {
            document.body.classList.remove('in-mobile-editor');
        };
    }, [isMobile]);

    // Deep linking: auto-activate tools based on URL param or history replay
    useEffect(() => {
        if (toggleCommand) {
            // Priority 1: Replayed History (Reuse Settings)
            if (location.state?.reuseSettings) {
                const item = location.state.reuseSettings;
                // tool holds the ID (e.g. 'faceRestoration'). Set it to its parameters.
                // Assuming parameters is a valid structure tools expect. If the tool is a simple toggle, value should be true.
                const paramValue = Object.keys(item.parameters || {}).length > 0 ? item.parameters : true;
                toggleCommand(item.tool, paramValue);
                // We're ready for image drop.
                window.history.replaceState({}, document.title); // clear state to prevent loop if re-loaded
            } 
            // Priority 2: Simple toolParam (e.g. ?tool=enhance)
            else if (toolParam) {
                if (toolParam === 'enhance') {
                    if (window.setActiveFeatureProxy) window.setActiveFeatureProxy('face-restore');
                    toggleCommand('faceRestoration', true);
                } else if (toolParam === 'remove_bg') {
                    if (window.setActiveFeatureProxy) window.setActiveFeatureProxy('remove-bg');
                    toggleCommand('removeBg', true);
                } else if (toolParam === 'style') {
                    if (window.setActiveFeatureProxy) window.setActiveFeatureProxy('style-transfer');
                    toggleCommand('styleTransfer', true);
                }
            }
        }
    }, [toolParam, toggleCommand, location.state]);

    useEffect(() => {
        if (!preloadImage || originalImage === preloadImage) return;
        setOriginalImage(preloadImage, 'copilot-handoff');

        const featureId = location.state?.handoffFeatureId;
        if (featureId && window.setActiveFeatureProxy) {
            window.setActiveFeatureProxy(featureId);
        } else if (location.state?.handoffTool && toggleCommand) {
            if (location.state.handoffTool === 'remove_bg') toggleCommand('removeBg', true);
            if (location.state.handoffTool === 'face_restore') toggleCommand('faceRestoration', true);
            if (location.state.handoffTool === 'enhance') toggleCommand('faceRestoration', true);
        }
    }, [preloadImage, originalImage, setOriginalImage, location.state, toggleCommand]);

    const handleGenerate = async () => {
        // ─── SaaS Processing Lock (Double Execution Prevention) ───
        if (isProcessing) {
            toast.error("Process in progress. Please wait for completion.");
            return;
        }
        if (commitCommands) await commitCommands();
    };
    const handleExport = () => setExportModalOpen(true);
    const handleZoomIn = () => {};
    const handleZoomOut = () => {};
    const handleZoomReset = () => {};

    const handleResetProject = useCallback(() => {
        if (originalImage) {
            if (!window.confirm('Start a new project? Unsaved changes will be lost.')) return;
        }
        reset();
    }, [originalImage, reset]);

    // Cmd+N / Ctrl+N shortcut for new project
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                handleResetProject();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleResetProject]);

    const { isPanning } = useKeyboardShortcuts({
        onUndo: undo, onRedo: redo,
        onSave: handleExport, onExport: handleExport,
        onProcess: handleGenerate,
        onCancel: () => setExportModalOpen(false),
        onZoomIn: handleZoomIn, onZoomOut: handleZoomOut, onZoomReset: handleZoomReset,
        enabled: !isMobile
    });

    /* ── MOBILE ── */
    if (isMobile) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed inset-0 flex flex-col mobile-studio-canvas overflow-hidden overflow-x-hidden" 
                style={{ zIndex: 100 }}
            >
                <div className="mobile-studio-surface" />
                
                <MobileEditorHeader
                    title="FixPix"
                    onBack={() => navigate('/app')}
                    onExport={handleExport}
                    onReset={handleResetProject}
                    onMenu={() => window.dispatchEvent(new CustomEvent('editor-open-sidebar'))}
                />
                
                {/* Immersive Canvas Area */}
                <div
                    className="flex-1 relative flex items-center justify-center w-full universal-canvas-container"
                    style={{
                        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
                        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 104px)',
                        paddingLeft: 'clamp(12px, 4vw, 20px)',
                        paddingRight: 'clamp(12px, 4vw, 20px)',
                        overflow: 'hidden',
                        zIndex: 2
                    }}
                >
                    <UniversalCanvas />
                </div>

                <FloatingCapsuleToolbar onExport={handleExport} />

                <AnimatePresence>
                    {isExportModalOpen && <ExportModal onClose={() => setExportModalOpen(false)} />}
                </AnimatePresence>
            </motion.div>
        );
    }


    /* ── DESKTOP — Floating Assistant Layout ── */
    return (
        <div style={{ backgroundColor: 'transparent', margin: '0', overflow: 'hidden' }} className={`flex-1 w-full h-full relative transition-all duration-500 ease-in-out ${isPanning ? 'cursor-grab' : ''}`}>
            {/* LAYER 1: Sacred Canvas Area (with Dynamic Safe Area Padding) */}
            <div 
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/[0.02] dark:bg-transparent transition-all duration-700 ease-in-out"
                style={{ 
                    paddingLeft: activeTab === 'edit' ? '412px' : '64px',
                    paddingRight: '64px'
                }}
            >
                <div className="w-full h-full relative flex items-center justify-center transition-all duration-500">
                    <UniversalCanvas />
                </div>
                


                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                    {quickStartDone && <OnboardingTour />}
                    <KeyboardShortcutsHelp />
                </div>
            </div>

            {/* 🍏 Layer 2: Assistant functionality is managed within UniversalCanvas to ensure correct layout and Z-indexing */}

            <QuickStartModal onClose={() => { setQuickStartDone(true); }} />
            <AnimatePresence>
                {isExportModalOpen && <ExportModal onClose={() => setExportModalOpen(false)} />}
            </AnimatePresence>
        </div>
    );
};

const EditorPage = () => <EditorContent />;

export default EditorPage;
