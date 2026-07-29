import React, { useState } from 'react';
import IOSToggle from '../ui/IOSToggle';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';

export default function RemoveBGPopup({ feature, onClose }) {
    const [enabled, setEnabled] = useState(true);
    const [outBg, setOutBg] = useState('Transparent');
    const [refine, setRefine] = useState(true);
    const [shadows, setShadows] = useState(false);

    const { applyFeature } = useFeatureApply();

    const bgOptions = [
        { id: 'Transparent', label: 'Transparent', color: 'transparent', pattern: true },
        { id: 'White', label: 'White', color: '#ffffff', pattern: false },
        { id: 'Custom Color', label: 'Custom', color: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)', pattern: false }
    ];

    const handleApply = () => {
        applyFeature({
          featureId: 'remove-bg',
          featureName: 'Remove Background',
          featureIcon: '✂️',
          featureColor: '#f43f5e',
          endpoint: apiEndpoints.removeBg,
          payload: { 
              // M6 FIX: Only send params the Stability AI Remove BG API actually accepts
              output_type: outBg.toLowerCase() === 'custom color' ? 'custom' : outBg.toLowerCase(),
              custom_color: outBg === 'Custom Color' ? '#ffffff' : undefined
              // refine_edges and keep_shadows removed — not supported by current API
          },
          requiresImage: true,
          onClose
        });
    };

    return (
        <div className="popup-body">
            <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <div className="popup-group" style={{ padding: '8px 16px' }}>
                    <IOSToggle label="Enable Remove BG" value={enabled} onChange={setEnabled} />
                </div>

                <div className="popup-group" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Output Background</div>
                    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        {bgOptions.map(opt => (
                            <div 
                                key={opt.id}
                                onClick={() => setOutBg(opt.id)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    borderRadius: '16px', /* refined from 20px for iOS */
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: outBg === opt.id ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.08)',
                                    transform: outBg === opt.id ? 'scale(1.06)' : 'scale(1)',
                                    boxShadow: outBg === opt.id ? '0 8px 16px rgba(0, 122, 255, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    background: opt.pattern ? 
                                        'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)' : 
                                        opt.color,
                                    backgroundSize: opt.pattern ? '10px 10px' : 'cover',
                                    backgroundPosition: opt.pattern ? '0 0, 0 5px, 5px 5px, 5px 0' : 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {outBg === opt.id && (
                                        <div style={{ position: 'absolute', inset: 0, border: '2px solid white', borderRadius: '14px', pointerEvents: 'none' }} />
                                    )}
                                </div>
                                <span style={{ 
                                    fontSize: '11px', 
                                    fontWeight: outBg === opt.id ? 600 : 500, 
                                    color: outBg === opt.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    textAlign: 'center'
                                }}>
                                    {opt.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="popup-group">
                    <div className="popup-separator" style={{ padding: '8px 0', opacity: 0.45, pointerEvents: 'none', position: 'relative' }}>
                        <IOSToggle label="Refine Hair & Edges" value={refine} onChange={setRefine} />
                    </div>
                    <div className="popup-separator" style={{ padding: '8px 0', opacity: 0.45, pointerEvents: 'none', position: 'relative' }}>
                        <IOSToggle label="Keep Shadows" value={shadows} onChange={setShadows} />
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ fontSize: '12px', color: '#8e8e93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Want to add a new background? 
                    <button 
                        type="button" 
                        style={{ background: 'none', border: 'none', padding: 0, color: '#007AFF', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => {
                            if (window.setActiveFeatureProxy) {
                                window.setActiveFeatureProxy('change-bg');
                            }
                        }}
                    >
                        Change BG
                    </button>
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
                    Remove BG
                </button>
            </div>
        </div>
    );
}
