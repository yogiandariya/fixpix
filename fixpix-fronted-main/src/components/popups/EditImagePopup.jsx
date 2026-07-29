import React, { useState } from 'react';
import IOSToggle from '../ui/IOSToggle';
import SettingSlider from '../ui/SettingSlider';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';

export default function EditImagePopup({ feature, onClose }) {
    const [strength, setStrength] = useState(50);
    const [preserve, setPreserve] = useState(true);
    const [prompt, setPrompt] = useState('');

    const quickActions = [
        "Make vibrant",
        "Add warm tones",
        "Convert to anime",
        "Make dramatic"
    ];

    const { applyFeature } = useFeatureApply();

    const handleApply = () => {
        applyFeature({
          featureId: 'edit-image',
          featureName: 'Edit Image',
          featureIcon: '✏️',
          featureColor: '#f97316',
          endpoint: apiEndpoints.editImage,
          payload: { 
              prompt,
              strength: (strength / 100 || 0.5).toString(),
              preserve: preserve ? 'true' : 'false'
          },
          requiresImage: true,
          onClose
        });
    };

    return (
        <div className="popup-body">
            <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Prompt Group */}
                <div className="popup-group" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Edit Prompt</div>
                    <textarea 
                        value={prompt} onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe the changes you want..."
                        style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '14px', outline: 'none', resize: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)' }}
                    />
                    
                    <div style={{ 
                        display: 'flex', gap: '6px', overflowX: 'auto', 
                        paddingBottom: '4px', marginTop: '12px', width: '100%', 
                        scrollbarWidth: 'none', msOverflowStyle: 'none' 
                    }}>
                        {quickActions.map(action => (
                            <button
                                key={action}
                                type="button"
                                onClick={() => setPrompt(action)}
                                style={{
                                    flex: '0 0 auto', padding: '6px 14px', borderRadius: '999px',
                                    border: prompt === action ? '1px solid #007AFF' : '1px solid rgba(0,0,0,0.08)',
                                    background: prompt === action ? '#007AFF' : 'transparent',
                                    fontSize: '11px', fontWeight: 600,
                                    color: prompt === action ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Group */}
                <div className="popup-group">
                    <div className="popup-separator" style={{ padding: '16px 0' }}>
                        <SettingSlider label="Transformation Strength" value={strength} onChange={setStrength} min={0} max={100} />
                    </div>
                    <div className="popup-separator" style={{ padding: '8px 0' }}>
                        <IOSToggle label="Preserve Composition" value={preserve} onChange={setPreserve} />
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
                    Apply Edit
                </button>
            </div>
        </div>
    );
}
