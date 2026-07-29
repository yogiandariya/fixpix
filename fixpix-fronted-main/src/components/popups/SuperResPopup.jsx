import React, { useState, useEffect } from 'react';
import IOSToggle from '../ui/IOSToggle';
import SegmentedControl from '../ui/SegmentedControl';
import useCanvasStore from '../../store/canvasStore';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';

export default function SuperResPopup({ feature, onClose }) {
    const [scale, setScale] = useState('4x');
    const [noise, setNoise] = useState(true);
    const [sharpen, setSharpen] = useState(true);
    const [detail, setDetail] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const store = useCanvasStore();
    const workingImage = store.getWorkingImage();
    const { applyFeature } = useFeatureApply();

    useEffect(() => {
        if (!workingImage) return;
        const img = new Image();
        const objectUrl = typeof workingImage === 'string' ? workingImage : URL.createObjectURL(workingImage);
        
        img.onload = () => {
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
            if (typeof workingImage !== 'string') URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    }, [workingImage]);

    const scaleFactor = parseInt(scale) || 4;
    const targetWidth = dimensions.width * scaleFactor;
    const targetHeight = dimensions.height * scaleFactor;
    const estTime = scale === '2x' ? 12 : (scale === '4x' ? 24 : 45);

    const handleApply = () => {
        applyFeature({
          featureId: 'super-res',
          featureName: 'Super Resolution',
          featureIcon: '⬆️',
          featureColor: '#8b5cf6',
          endpoint: apiEndpoints.superResolution,
          payload: { 
              scale: scale.replace('x', ''),
              // M4 FIX: Send toggle values — backend can use or ignore gracefully
              noise_reduction: noise,
              sharpening: sharpen,
              detail_enhancement: detail
          },
          requiresImage: true,
          onClose
        });
    };

    return (
    <div className="popup-body">
      <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Scale Group */}
        <div className="popup-group">
          <div className="popup-separator" style={{ padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)' }}>Scale</div>
            <div style={{ width: '180px' }}>
              <SegmentedControl options={['2x', '4x', '8x']} value={scale} onChange={setScale} />
            </div>
          </div>
          
          {dimensions.width > 0 && (
            <div className="popup-separator" style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Resolution</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {dimensions.width}×{dimensions.height} → <span style={{ color: '#007AFF' }}>{targetWidth}×{targetHeight}</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhancements Group */}
        <div className="popup-group">
          <div className="popup-separator" style={{ padding: '8px 0' }}><IOSToggle label="Noise Reduction" value={noise} onChange={setNoise} /></div>
          <div className="popup-separator" style={{ padding: '8px 0' }}><IOSToggle label="Edge Sharpening" value={sharpen} onChange={setSharpen} /></div>
          <div className="popup-separator" style={{ padding: '8px 0' }}><IOSToggle label="Detail Recovery" value={detail} onChange={setDetail} /></div>
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
          Apply Upscale
        </button>
      </div>
    </div>
    );
}
