import React, { useState } from 'react';
import SegmentedControl from '../ui/SegmentedControl';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';

export default function TextToImagePopup({ feature, onClose }) {
    const [style, setStyle] = useState('Realistic');
    const [ratio, setRatio] = useState('1:1');
    const [prompt, setPrompt] = useState('');

    const suggestions = [
        "Portrait in golden hour",
        "Anime cityscape",
        "Abstract art"
    ];

    const { applyFeature } = useFeatureApply();

    const handleApply = () => {
        applyFeature({
          featureId: 'text-to-image',
          featureName: 'Text to Image',
          featureIcon: '🖼️',
          featureColor: '#f59e0b',
          endpoint: apiEndpoints.cloudflareGenerate,
          payload: { 
              prompt,
              style,
              aspectRatio: ratio
          },
          isNewImage: true,
          requiresImage: false,
          isJson: true,
          onClose
        });
    };

    return (
        <div className="popup-body">
            <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Prompt Group */}
                <div className="popup-group" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Prompt</div>
                        <button type="button" style={{ background: 'rgba(0, 122, 255, 0.1)', color: '#007AFF', border: 'none', borderRadius: '12px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            Optimize ✨
                        </button>
                    </div>
                    <textarea 
                        value={prompt} onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe the image you want to create..."
                        style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '14px', outline: 'none', resize: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)' }}
                    />

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                        {suggestions.map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setPrompt(s)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '999px',
                                    border: prompt === s ? '1px solid #007AFF' : '1px solid rgba(0,0,0,0.08)',
                                    backgroundColor: prompt === s ? '#007AFF' : 'transparent',
                                    color: prompt === s ? 'white' : 'var(--text-secondary)',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Group */}
                <div className="popup-group">
                    <div className="popup-separator" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Style</div>
                        <select 
                            value={style} onChange={e => setStyle(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--fill-secondary)', outline: 'none', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}
                        >
                            <option>Realistic</option><option>Anime</option><option>Digital Art</option>
                            <option>Oil Painting</option><option>Watercolor</option><option>Cinematic</option>
                        </select>
                    </div>
                    <div className="popup-separator" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Aspect Ratio</div>
                        <div style={{ flex: 1, maxWidth: '200px' }}>
                            <SegmentedControl options={['1:1', '16:9', '9:16']} value={ratio} onChange={setRatio} />
                        </div>
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
                    Generate Image
                </button>
            </div>
        </div>
    );
}
