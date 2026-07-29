import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Minus, Maximize2, Download, 
  RotateCcw, RotateCw, ZoomIn, ZoomOut, Square
} from 'lucide-react';
import useCanvasStore from '../../store/canvasStore';

const CanvasControlBar = () => {
  const zoom = useCanvasStore(state => state.zoom);
  const setZoom = useCanvasStore(state => state.setZoom);
  const undo = useCanvasStore(state => state.undo);
  const redo = useCanvasStore(state => state.redo);
  const history = useCanvasStore(state => state.history);
  const historyIndex = useCanvasStore(state => state.historyIndex);
  const setViewMode = useCanvasStore(state => state.setViewMode);
  const isCropMode = useCanvasStore(state => state.isCropMode);
  const setCropMode = useCanvasStore(state => state.setCropMode);

  const formatPercentage = (z) => Math.round(z * 100) + '%';

  const downloadImage = () => {
    const current = useCanvasStore.getState().getWorkingImage();
    if (!current) return;
    const link = document.createElement('a');
    link.href = current;
    link.download = `fixpix-output-${Date.now()}.png`;
    link.click();
  };

  return (
    <motion.div 
      initial={{ y: 40, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      className="absolute bottom-6 left-1/2 z-[110] flex items-center h-[56px] px-1.5"
      style={{
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '999px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.5), 0 0 0 1px rgba(0,0,0,0.02)',
        border: 'none',
        backdropFilter: 'blur(36px) saturate(200%)',
        WebkitBackdropFilter: 'blur(36px) saturate(200%)',
        color: '#1a1a1a'
      }}
    >
      {/* Undo/Redo Section */}
      <div className="flex items-center gap-1 px-4">
        <ControlButton 
          onClick={undo} 
          disabled={historyIndex === -1} 
          icon={<RotateCcw size={18} strokeWidth={2.5} />} 
          tooltip="Undo" 
        />
        <ControlButton 
          onClick={redo} 
          disabled={historyIndex >= history.length - 1} 
          icon={<RotateCw size={18} strokeWidth={2.5} />} 
          tooltip="Redo" 
        />
      </div>

      <Divider />

      {/* Recessed Zoom Section */}
      <div className="flex items-center px-3 py-1">
        <div className="flex items-center gap-4 px-4 py-1.5 bg-[#f0f2f5] rounded-full">
          <ControlButton 
            onClick={() => setZoom(zoom - 0.1)} 
            icon={<ZoomOut size={16} strokeWidth={2.5} />} 
            className="p-1 hover:bg-transparent"
          />
          <span className="text-[14px] font-bold min-w-[42px] text-center text-[#1a1a1a]">
            {formatPercentage(zoom)}
          </span>
          <ControlButton 
            onClick={() => setZoom(zoom + 0.1)} 
            icon={<ZoomIn size={16} strokeWidth={2.5} />} 
            className="p-1 hover:bg-transparent"
          />
        </div>
      </div>

      <Divider />

      {/* Action Section */}
      <div className="flex items-center gap-2 px-4">
        <ControlButton 
          active={isCropMode}
          onClick={() => setCropMode(!isCropMode)}
          icon={<Square size={17} strokeWidth={2.5} />} 
          tooltip="Crop Tool" 
        />
        <ControlButton 
          onClick={downloadImage} 
          icon={<Download size={19} strokeWidth={2.5} className="text-[#0047ab]" />} 
          tooltip="Download" 
        />
        <ControlButton 
          onClick={() => setViewMode('fit')}
          icon={<Maximize2 size={17} strokeWidth={2.5} />} 
          tooltip="Fit to Screen" 
        />
      </div>
    </motion.div>
  );
};

const Divider = () => (
  <div className="h-6 w-[1px] bg-black/10" />
);

const ControlButton = ({ icon, onClick, disabled, tooltip, active, className = "" }) => (
  <motion.button 
    whileHover={!disabled ? { scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' } : {}}
    whileTap={!disabled ? { scale: 0.96 } : {}}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-full transition-all flex items-center justify-center text-[#4a4a4a] hover:text-black soft-glow-hover icon-scale-hover
      ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
      ${active ? 'bg-black text-white' : ''}
      ${className}
    `}
    title={tooltip}
  >
    <motion.div whileHover={!disabled ? { scale: 1.12 } : {}} transition={{ duration: 0.2 }}>
      {icon}
    </motion.div>
  </motion.button>
);

export default CanvasControlBar;
