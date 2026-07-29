import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Undo2, 
    Redo2, 
    ZoomIn, 
    ZoomOut, 
    Download, 
    Maximize,
    ChevronDown
} from 'lucide-react';
import useCanvasStore from '../../store/canvasStore';
import useToastStore from '../../store/toastStore';
import GenerateButton from './GenerateButton';
import { useCommand } from '../../context/CommandContext';

/**
 * FloatingActionToolbar - Premium Pill Toolbar
 * Design inspired by the user's provided screenshot.
 */
const FloatingActionToolbar = () => {
    const undo = useCanvasStore(state => state.undo);
    const redo = useCanvasStore(state => state.redo);
    const history = useCanvasStore(state => state.history);
    const historyIndex = useCanvasStore(state => state.historyIndex);
    const originalImage = useCanvasStore(state => state.originalImage);
    const zoom = useCanvasStore(state => state.zoom);
    const zoomIn = useCanvasStore(state => state.zoomIn);
    const zoomOut = useCanvasStore(state => state.zoomOut);
    const setZoom = useCanvasStore(state => state.setZoom);
    const toast = useToastStore();

    const canUndo = historyIndex >= 0;
    const canRedo = historyIndex < history.length - 1;
    
    const currentImage = historyIndex === -1 && originalImage 
      ? (originalImage instanceof File ? URL.createObjectURL(originalImage) : originalImage)
      : history[historyIndex]?.imageUrl || (originalImage ? (originalImage instanceof File ? URL.createObjectURL(originalImage) : originalImage) : null);

    const onExport = () => {
        if (!currentImage) return;
        const a = document.createElement('a');
        a.href = currentImage;
        a.download = `fixpix_edit_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Image downloaded! 📥");
    };

    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    if (!originalImage) return null;

    return (
        <motion.div 
            className="floating-action-toolbar"
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
            {/* History Group */}
            <div className="toolbar-group">
                <button 
                    className="toolbar-btn" 
                    onClick={undo} 
                    disabled={!canUndo}
                    title="Undo (Cmd+Z)"
                >
                    <Undo2 size={18} strokeWidth={2.2} />
                </button>
                <button 
                    className="toolbar-btn" 
                    onClick={redo} 
                    disabled={!canRedo}
                    title="Redo (Cmd+Shift+Z)"
                >
                    <Redo2 size={18} strokeWidth={2.2} />
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Zoom Group */}
            <div className="toolbar-zoom-pill">
                <button className="zoom-btn" onClick={zoomOut} title="Zoom Out">
                    <ZoomOut size={15} strokeWidth={2.5} />
                </button>
                <div className="zoom-value" onClick={() => setZoom(1.0)} title="Reset Zoom">
                    {Math.round(zoom * 100)}%
                </div>
                <button className="zoom-btn" onClick={zoomIn} title="Zoom In">
                    <ZoomIn size={15} strokeWidth={2.5} />
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Generate Group */}
            <div className="toolbar-group" style={{ minWidth: '140px' }}>
                <GenerateButton />
            </div>

            <div className="toolbar-divider" />

            {/* Actions Group */}
            <div className="toolbar-group">
                <button className="toolbar-btn" onClick={onExport} title="Download">
                    <Download size={18} strokeWidth={2.2} />
                </button>
                <button className="toolbar-btn" onClick={handleToggleFullscreen} title="Toggle Fullscreen">
                    <Maximize size={18} strokeWidth={2.2} />
                </button>
            </div>
        </motion.div>
    );
};

export default FloatingActionToolbar;
