import React, { useState, useEffect } from 'react';
import IOSToggle from '../ui/IOSToggle';
import SettingSlider from '../ui/SettingSlider';
import useCanvasStore from '../../store/canvasStore';

export default function MagicEraserPopup({ feature, onClose }) {
    // Magic eraser now puts the canvas in brush mode to trace the object
    const [size, setSize] = useState(30);
    const [softness, setSoftness] = useState(50);
    const [smartFill, setSmartFill] = useState(true);
    const [feather, setFeather] = useState(false);

    const store = useCanvasStore();

    const handleStartErasing = () => {
        // Enters brush mode on the Canvas
        store.setBrushSettings({ size, softness, smartFill, feather });
        store.setBrushMode(true);
        onClose(); // Close the popup so they can draw on the canvas
    };

  return (
    <div className="popup-body">
      <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        <div className="popup-group" style={{ padding: '16px', background: 'rgba(0, 122, 255, 0.08)', borderRadius: '18px', border: '1px solid rgba(0, 122, 255, 0.15)' }}>
          <div style={{ color: '#007AFF', fontSize: '13px', fontWeight: 500, textAlign: 'center', lineHeight: '1.4' }}>
            Tap "Start Erasing" then draw directly over objects to seamlessly remove them from the image.
          </div>
        </div>

        <div className="popup-group">
          <div className="popup-separator" style={{ padding: '16px 0' }}>
            <SettingSlider label="Brush Size" value={size} onChange={setSize} min={1} max={100} />
          </div>
          <div className="popup-separator" style={{ padding: '16px 0' }}>
            <SettingSlider label="Brush Softness" value={softness} onChange={setSoftness} min={0} max={100} />
          </div>
        </div>

        <div className="popup-group">
          <div className="popup-separator" style={{ padding: '8px 0' }}>
            <IOSToggle label="Smart AI Fill" value={smartFill} onChange={setSmartFill} />
          </div>
          <div className="popup-separator" style={{ padding: '8px 0' }}>
            <IOSToggle label="Feather Edges" value={feather} onChange={setFeather} />
          </div>
        </div>

      </div>

      <div style={{ marginTop: '16px' }}>
        <button 
          type="button" 
          className="popup-button-apply" 
          onClick={handleStartErasing}
          style={{ 
            width: '100%', height: '52px', borderRadius: '16px', border: 'none', 
            fontWeight: 600, fontSize: '16px', background: '#007AFF', color: '#fff', 
            boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)', cursor: 'pointer', transition: 'all 0.2s ease'
          }}
        >
          Start Erasing
        </button>
      </div>
    </div>
    );
}
