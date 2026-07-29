import React, { useState } from 'react';
import IOSToggle from '../ui/IOSToggle';
import SettingSlider from '../ui/SettingSlider';
import SegmentedControl from '../ui/SegmentedControl';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';

export default function FaceRestorePopup({ feature, onClose }) {
  const [enabled, setEnabled] = useState(true);
  const [strength, setStrength] = useState(75);
  const [quality, setQuality] = useState('Balanced');
  const [skinTone, setSkinTone] = useState(false);
  
  const { applyFeature } = useFeatureApply();
  
  const handleApply = () => {
    applyFeature({
      featureId: 'face-restore',
      featureName: 'Face Restore',
      featureIcon: '🧑',
      featureColor: '#3b82f6',
      endpoint: apiEndpoints.restoreFace,
      payload: { 
          mode: quality.toLowerCase(),
          upscale: 'true',
          preserve_skin_tone: skinTone ? 'true' : 'false',
          fidelity: (strength / 100).toFixed(2)
      },
      requiresImage: true,
      onClose
    });
  };
  
  return (
    <div className="popup-body">
      <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Settings Group 1 */}
        <div className="popup-group" style={{ padding: '8px 16px' }}>
          <IOSToggle label="Enable Restoration" value={enabled} onChange={setEnabled} />
        </div>
        
        {/* Settings Group 2 */}
        <div 
          className="popup-group"
          style={{
            opacity: enabled ? 1 : 0.5,
            pointerEvents: enabled ? 'auto' : 'none'
          }}
        >
          <div className="popup-separator" style={{ padding: '16px 0' }}>
            <SettingSlider label="Strength" value={strength} onChange={setStrength} />
          </div>
          
          <div className="popup-separator" style={{ padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
             <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' }}>Quality</div>
             <div style={{ width: '180px' }}>
                <SegmentedControl options={['Fast', 'Balanced', 'Max']} value={quality} onChange={setQuality} />
             </div>
          </div>

          <div className="popup-separator" style={{ padding: '8px 0' }}>
            <IOSToggle label="Preserve Skin Tone" value={skinTone} onChange={setSkinTone} />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '16px' }}>
          <button 
            type="button" 
            className="popup-button-apply" 
            onClick={handleApply} 
            disabled={!enabled}
            style={{ 
              width: '100%',
              height: '52px',
              borderRadius: '16px',
              border: 'none',
              fontWeight: 600,
              fontSize: '16px',
              cursor: enabled ? 'pointer' : 'default',
              background: enabled ? '#007AFF' : 'rgba(255,255,255,0.08)',
              color: enabled ? '#ffffff' : '#8e8e93',
              transition: 'all 0.2s ease',
              boxShadow: enabled ? '0 4px 14px rgba(0, 122, 255, 0.3)' : 'none'
            }}
          >
              Apply Restore
          </button>
      </div>
    </div>
  );
}
