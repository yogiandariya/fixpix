import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IOSToggle from '../ui/IOSToggle';
import SettingSlider from '../ui/SettingSlider';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';

export default function StyleTransferPopup({ feature, onClose }) {
    const [strength, setStrength] = useState(70);
    const [preserve, setPreserve] = useState(true);
    const [activeStyle, setActiveStyle] = useState('Anime');
    const [hoveredStyle, setHoveredStyle] = useState(null);

    const { applyFeature } = useFeatureApply();

    const stylePreviews = {
        'Anime': 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
        'Oil Painting': 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)',
        'Watercolor': 'linear-gradient(135deg, #A8E6CF 0%, #DCEDC1 33%, #FFD3B6 66%, #FFAAA5 100%)',
        'Pencil Sketch': 'linear-gradient(135deg, #2C3E50 0%, #BDC3C7 100%)',
        'Vintage Film': 'linear-gradient(135deg, #795548 0%, #BCAAA4 100%)',
        'Cyberpunk': 'linear-gradient(135deg, #00F260 0%, #0575E6 50%, #642B73 100%)'
    };

    const styles = Object.keys(stylePreviews);

    const handleApply = () => {
        applyFeature({
          featureId: 'style-transfer',
          featureName: 'Style Transfer',
          featureIcon: '🎨',
          featureColor: '#ec4899',
          endpoint: apiEndpoints.styleTransfer,
          payload: { 
              prompt: activeStyle,
              style_strength: (strength / 100 || 0.7).toString(),
              // M5 FIX: Send preserve_face toggle — backend can augment prompt accordingly
              preserve_face: preserve
          },
          requiresImage: true,
          onClose
        });
    };

    return (
        <div className="popup-body">
            <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <div className="popup-group" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Artistic Style</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%' }}>
                        {styles.map(s => (
                            <div 
                                key={s} 
                                onMouseEnter={() => setHoveredStyle(s)}
                                onMouseLeave={() => setHoveredStyle(null)}
                                onClick={() => setActiveStyle(s)}
                                style={{
                                    height: '70px', 
                                    borderRadius: '16px', 
                                    background: activeStyle === s ? 'white' : 'transparent',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '10px', 
                                    fontWeight: 600, 
                                    cursor: 'pointer',
                                    position: 'relative',
                                    border: activeStyle === s ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.08)',
                                    boxShadow: activeStyle === s ? '0 8px 16px rgba(0, 122, 255, 0.2)' : 'none',
                                    transform: activeStyle === s ? 'scale(1.03)' : 'scale(1)',
                                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    zIndex: hoveredStyle === s ? 100 : 1
                                }}
                            >
                                <AnimatePresence>
                                    {hoveredStyle === s && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 10, x: '-50%' }}
                                            animate={{ opacity: 1, scale: 1, y: -5, x: '-50%' }}
                                            exit={{ opacity: 0, scale: 0.8, y: 10, x: '-50%' }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '100%',
                                                left: '50%',
                                                width: '100px',
                                                height: '60px',
                                                background: 'white',
                                                borderRadius: '16px',
                                                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                                                padding: '4px',
                                                pointerEvents: 'none',
                                                zIndex: 101,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                border: '1px solid rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <div style={{ 
                                                flex: 1, 
                                                borderRadius: '6px', 
                                                background: stylePreviews[s],
                                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                                            }} />
                                            <div style={{ fontSize: '9px', textAlign: 'center', marginTop: '4px', color: '#1c1c1e' }}>
                                                {s} Preview
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '-4px',
                                                left: '50%',
                                                transform: 'translateX(-50%) rotate(45deg)',
                                                width: '8px',
                                                height: '8px',
                                                background: 'white',
                                                borderRight: '1px solid rgba(0,0,0,0.05)',
                                                borderBottom: '1px solid rgba(0,0,0,0.05)'
                                            }} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    borderRadius: '50%', 
                                    background: stylePreviews[s], 
                                    marginBottom: '6px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }} />
                                <span style={{ color: activeStyle === s ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="popup-group">
                    <div className="popup-separator" style={{ padding: '16px 0' }}>
                        <SettingSlider label="Blend with Original" value={strength} onChange={setStrength} min={0} max={100} />
                    </div>
                    <div className="popup-separator" style={{ padding: '8px 0' }}>
                        <IOSToggle label="Preserve Face" value={preserve} onChange={setPreserve} />
                    </div>
                </div>

            </div>

            <div style={{ marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="popup-button-apply" 
                  onClick={handleApply}
                  style={{ 
                    width: '100%', height: '52px', borderRadius: '16px', border: 'none', 
                    fontWeight: 600, fontSize: '16px', background: '#007AFF', color: '#fff', 
                    boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)', cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                    Apply Style
                </button>
            </div>
        </div>
    );
}
