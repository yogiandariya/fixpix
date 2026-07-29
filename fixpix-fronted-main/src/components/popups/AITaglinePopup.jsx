import React, { useState } from 'react';
import useCanvasStore from '../../store/canvasStore';
import useToastStore from '../../store/toastStore';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import { apiEndpoints } from '../../lib/api';
import { authenticatedFetch } from '../../lib/authFetch';

export default function AITaglinePopup({ feature, onClose }) {
  const [category, setCategory] = useState('Professional');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [taglines, setTaglines] = useState([]);
  
  const toast = useToastStore();
  const store = useCanvasStore();
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    setTaglines([]);
    
    try {
      const workingImage = store.getWorkingImage();
      let imageBase64 = '';
      if (workingImage) {
          const res = await fetch(workingImage);
          const blob = await res.blob();
          imageBase64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
          });
      }

      const response = await authenticatedFetch(apiEndpoints.intelligence.generateTagline, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          image: imageBase64 
        })
      });
      
      const result = await response.json();
      // The old proxy returned { tagline: "..." } but the spec says { taglines: [...] }. 
      // We will handle both gracefully.
      const tags = result.taglines || (result.tagline ? [result.tagline] : []);
      setTaglines(tags);
      
    } catch (error) {
      toast.error("Failed to generate taglines");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyTagline = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 📋");
  };
  
  return (
    <div className="popup-body">
      <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Input & Category Group */}
        <div className="popup-group" style={{ padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Context</div>
            <textarea
              placeholder="Describe your image (optional)..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', height: '60px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '14px', outline: 'none', resize: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)', marginBottom: '12px' }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', width: '100%' }}>
              {['Professional','Instagram','Product Ad','Romantic','Funny','Luxury','Emotional'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                      padding: '6px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                      border: category === cat ? '1px solid #007AFF' : '1px solid rgba(0,0,0,0.08)',
                      backgroundColor: category === cat ? '#007AFF' : 'transparent',
                      color: category === cat ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
        </div>

        {/* Results area */}
        {taglines.length > 0 && (
          <div className="popup-group" style={{ padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                Generated Taglines
            </div>
            {taglines.map((tagline, i) => (
              <div key={i} className="popup-separator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: i === 0 ? 'none' : undefined, gap: '10px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.4, flex: 1, fontStyle: 'italic' }}>"{tagline}"</span>
                <button 
                  type="button"
                  onClick={() => copyTagline(tagline)}
                  style={{ background: 'var(--fill-secondary)', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '8px', borderRadius: '10px', color: '#007AFF', fontWeight: 600 }}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px' }}>
        {taglines.length > 0 ? (
          <div style={{ display:'flex', gap: '8px', width: '100%' }}>
            <button 
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{ flex: 1, height: '52px', background: 'var(--fill-secondary)', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              Regenerate
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ flex: 1, height: '52px', background: '#007AFF', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              Done
            </button>
          </div>
        ) : (
          <button 
            type="button"
            className="popup-button-apply"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ 
              width: '100%', height: '52px', borderRadius: '16px', border: 'none', 
              fontWeight: 600, fontSize: '16px', background: '#007AFF', color: '#fff', 
              boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)', cursor: 'pointer', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isGenerating ? 0.8 : 1
            }}
          >
            {isGenerating ? (
              <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block', marginRight: '8px' }}/> Generating...</>
            ) : (
              'Generate Tagline'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
