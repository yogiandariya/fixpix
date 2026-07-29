import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Move } from 'lucide-react';
import useCanvasStore from '../../store/canvasStore';

const CropOverlay = () => {
  const isCropMode = useCanvasStore(state => state.isCropMode);
  const setCropMode = useCanvasStore(state => state.setCropMode);
  const zoom = useCanvasStore(state => state.zoom);
  
  if (!isCropMode) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[80] pointer-events-none"
    >
      {/* Dimmed Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Draggable Crop Box (Simplified Mockup) */}
      <motion.div 
        drag
        dragMomentum={false}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/80 shadow-2xl pointer-events-auto cursor-move"
        style={{
          width: '60%',
          height: '60%',
          boxShadow: '0 0 0 4000px rgba(0,0,0,0.5)', // Efficient cutout mask
          borderRadius: '2px'
        }}
      >
        {/* Resize Handles */}
        <Handle position="top-left" />
        <Handle position="top-right" />
        <Handle position="bottom-left" />
        <Handle position="bottom-right" />

        {/* Action Controls (Fixed Tooltip) */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl">
          <button 
            onClick={() => setCropMode(false)}
            className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="h-6 w-[1px] bg-gray-200 mx-1" />
          <button 
            onClick={() => setCropMode(false)}
            className="px-6 py-2 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            Apply Crop
          </button>
        </div>
      </motion.div>

      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="h-full w-[1px] bg-white absolute left-1/3" />
        <div className="h-full w-[1px] bg-white absolute left-2/3" />
        <div className="w-full h-[1px] bg-white absolute top-1/3" />
        <div className="w-full h-[1px] bg-white absolute top-2/3" />
      </div>
    </motion.div>
  );
};

const Handle = ({ position }) => {
  const styles = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize',
  };

  return (
    <div className={`absolute w-3 h-3 bg-white border-2 border-black rounded-sm shadow-md ${styles[position]}`} />
  );
};

export default CropOverlay;
