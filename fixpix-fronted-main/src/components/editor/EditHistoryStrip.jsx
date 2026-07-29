import useCanvasStore from '../../store/canvasStore';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryThumb = ({ label, isActive, onClick, isFuture }) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`history-thumb relative px-5 py-2.5 rounded-full transition-colors z-10 ${isActive ? 'text-black' : 'text-[var(--text-secondary)] opacity-60 hover:opacity-100'} ${isFuture ? 'text-slate-400' : ''}`}
      onClick={onClick}
      type="button"
    >
      <span className="text-[11px] font-black uppercase tracking-widest leading-none relative z-20">{label}</span>
      
      {isActive && (
        <motion.div
          layoutId="history-active-pill"
          className="absolute inset-0 bg-white shadow-lg shadow-black/10 rounded-full z-10"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const EditHistoryStrip = () => {
  const history = useCanvasStore(state => state.history);
  const historyIndex = useCanvasStore(state => state.historyIndex);
  const setHistoryIndex = useCanvasStore(state => state.setHistoryIndex);
  
  return (
    <div className="history-strip absolute bottom-32 left-1/2 -translate-x-1/2 z-[80] pointer-events-none">
      <div className="history-scroll flex items-center gap-1.5 p-1.5 bg-black/5 dark:bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 dark:border-white/5 pointer-events-auto shadow-2xl">
        
        {/* Original */}
        <HistoryThumb
          label="Original"
          isActive={historyIndex === -1}
          onClick={() => setHistoryIndex(-1)}
        />
        
        {/* Each edit step */}
        {history.map((edit, idx) => (
          <HistoryThumb
            key={edit.id}
            label={edit.featureName}
            isActive={historyIndex === idx}
            onClick={() => setHistoryIndex(idx)}
            isFuture={idx > historyIndex}
          />
        ))}
        
      </div>
    </div>
  );
};

export default EditHistoryStrip;
