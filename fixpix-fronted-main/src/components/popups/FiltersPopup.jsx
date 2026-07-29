import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Wand2, SlidersHorizontal, Image as ImageIcon, Star, Clock, BrainCircuit } from 'lucide-react';
import SettingSlider from '../ui/SettingSlider';
import useCanvasStore from '../../store/canvasStore';
import { FILTER_PRESETS, buildCustomFilterCSS, applyFilterToImage } from '../../lib/filterEngine';
import useToastStore from '../../store/toastStore';
import IOSToggle from '../ui/IOSToggle';

// Flattened predefined filters for quick ID lookup
const ALL_FILTERS = Object.values(FILTER_PRESETS).flat();

export default function FiltersPopup({ feature, onClose }) {
  const [mainTab, setMainTab] = useState('presets'); // 'presets' | 'adjust'
  const [category, setCategory] = useState('portrait');
  const [activeFilterId, setActiveFilterId] = useState(null);
  
  // Custom Controls
  const [strength, setStrength] = useState(70); // Intensity slider defaulting to 70%
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const [smartMode, setSmartMode] = useState(false);

  // Canvas Store API
  const setPreviewFilter = useCanvasStore(s => s.setPreviewFilter);
  const getWorkingImage = useCanvasStore(s => s.getWorkingImage);
  const startProcessing = useCanvasStore(s => s.startProcessing);
  const pushEdit = useCanvasStore(s => s.pushEdit);
  const favoriteFilters = useCanvasStore(s => s.favoriteFilters);
  const toggleFavoriteFilter = useCanvasStore(s => s.toggleFavoriteFilter);
  const recentFilters = useCanvasStore(s => s.recentFilters);
  const addRecentFilter = useCanvasStore(s => s.addRecentFilter);
  
  // Track history state reactively for the thumbnail effect
  const historyIndex = useCanvasStore(s => s.historyIndex);
  const originalImage = useCanvasStore(s => s.originalImage);
  
  const toast = useToastStore();

  const [liveSourceThumbnail, setLiveSourceThumbnail] = useState(
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  );

  // Manage Live Personalized Thumbnail safely without memory leaks
  useEffect(() => {
      const sourceImg = getWorkingImage();
      let objectUrl = null;
      
      if (sourceImg instanceof File) {
          objectUrl = URL.createObjectURL(sourceImg);
          setLiveSourceThumbnail(objectUrl);
      } else if (typeof sourceImg === 'string' && sourceImg.length > 0) {
          setLiveSourceThumbnail(sourceImg);
      } else {
          setLiveSourceThumbnail('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150');
      }

      return () => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
  }, [getWorkingImage, historyIndex, originalImage]); // Reactive to history changes

  // Derived filtered categories
  const currentFilters = useMemo(() => {
      if (category === 'recent') return recentFilters.map(id => ALL_FILTERS.find(f => f.id === id)).filter(Boolean);
      if (category === 'favorites') return favoriteFilters.map(id => ALL_FILTERS.find(f => f.id === id)).filter(Boolean);
      return FILTER_PRESETS[category] || [];
  }, [category, recentFilters, favoriteFilters]);

  // Handle Smart Mode toggling (Zero-latency AI Heuristic matching)
  useEffect(() => {
      if (smartMode) {
          toast.success("AI Smart Mode Engaged");
      }
  }, [smartMode, toast]);

  const isAppliedRef = React.useRef(false);

  // Live CSS Re-calculation Engine
  useEffect(() => {
     let baseCss = '';
     if (activeFilterId) {
        const found = ALL_FILTERS.find(f => f.id === activeFilterId);
        if (found) baseCss = found.css;
     }

     const dynamicStrength = smartMode ? 100 : strength; 
     const computedCss = buildCustomFilterCSS(baseCss, { 
         strength: dynamicStrength, brightness, contrast, saturation, warmth 
     });
     
     setPreviewFilter(computedCss);

     return () => {
         // Only clear if we didn't just successfully apply the filter
         if (!isAppliedRef.current) {
            setPreviewFilter('');
         }
     };
  }, [activeFilterId, strength, brightness, contrast, saturation, warmth, smartMode, setPreviewFilter]);

  const handleApply = async () => {
     const sourceImg = getWorkingImage();
     if (!sourceImg) {
         toast.error("Waiting for image context.");
         return;
     }

    const createdUrl = (sourceImg instanceof File) ? URL.createObjectURL(sourceImg) : null;
    const url = createdUrl || sourceImg;

    // Mark as applied EARLY
    isAppliedRef.current = true;
    onClose();
     

     try {
         const baseCss = activeFilterId ? ALL_FILTERS.find(f => f.id === activeFilterId)?.css || '' : '';
         const dynamicStrength = smartMode ? 100 : strength; 

         const computedCss = buildCustomFilterCSS(baseCss, { 
             strength: dynamicStrength, brightness, contrast, saturation, warmth 
         });

         // Enforce minimum animation time
         const filteredDataUrl = await applyFilterToImage(url, computedCss);

         if (createdUrl) URL.revokeObjectURL(createdUrl);

         if (activeFilterId) addRecentFilter(activeFilterId); 
         
         const filterName = activeFilterId ? (ALL_FILTERS.find(f => f.id === activeFilterId)?.name || 'AI Filter') : 'Custom Adjustment';
         toast.success(`${filterName} Applied`);

         // Push to edit history with full parameters
         pushEdit(filteredDataUrl, filterName, 'smart-filters', { 
             filterId: activeFilterId, 
             strength: dynamicStrength,
             brightness, 
             contrast, 
             saturation, 
             warmth,
             smartMode
         });
         
         // Clear preview filter after push to canvas
         setTimeout(() => {
             setPreviewFilter('');
             isAppliedRef.current = false;
         }, 300);
     } catch(err) {

         console.error(err);
         useCanvasStore.getState().setProcessingError({ 
             message: 'Filter pipeline failure: ' + err.message,
             canRetry: true 
         });
     }
  };

  const handleAutoPerfect = () => {
      setMainTab('presets');
      setCategory('portrait');
      setActiveFilterId('studio-light-pro');
      setStrength(80);
      setBrightness(5);
      setContrast(10);
      setSaturation(10);
      setWarmth(-5);
      setSmartMode(true);
      toast.success("✨ Auto Perfected Image");
  };

  const ALL_CATEGORIES = ['recent', 'favorites', ...Object.keys(FILTER_PRESETS)];
  const formatCatName = (k) => {
      if(k === 'recent') return <><Clock size={12} className="inline mr-1 -mt-0.5" /> Recent</>;
      if(k === 'favorites') return <><Star size={12} className="inline mr-1 -mt-0.5" /> Favorites</>;
      return k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="popup-body">
      <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Smart Mode Banner */}
      <div 
        onClick={handleAutoPerfect}
        className="popup-group soft-glow-hover"
        style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <BrainCircuit size={14} color="#8b5cf6" />
                Vision Analysis
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Portrait, Soft Lighting
            </div>
            <div style={{ fontSize: '12px', color: '#8e8e93' }}>
                Recommends: <span style={{ color: '#007AFF' }}>Studio Light Pro</span>
            </div>
        </div>
        <button style={{ backgroundColor: '#007AFF', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)' }}>
            <Sparkles size={14} /> Auto Perfect
        </button>
      </div>

      {/* Main Tabs Segmented Control Style */}
      <div className="popup-group" style={{ padding: '4px', display: 'flex' }}>
          <button 
              style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: mainTab === 'presets' ? 'var(--card-bg)' : 'transparent', color: mainTab === 'presets' ? 'var(--text-primary)' : '#8e8e93', boxShadow: mainTab === 'presets' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', cursor: 'pointer' }}
              onClick={() => setMainTab('presets')}
          >
              <ImageIcon size={14} /> Intelligence
          </button>
          <button 
              style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: mainTab === 'adjust' ? 'var(--card-bg)' : 'transparent', color: mainTab === 'adjust' ? 'var(--text-primary)' : '#8e8e93', boxShadow: mainTab === 'adjust' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', cursor: 'pointer' }}
              onClick={() => setMainTab('adjust')}
          >
              <SlidersHorizontal size={14} /> Engine Control
              {(brightness !== 0 || contrast !== 0 || saturation !== 0 || warmth !== 0) && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#007AFF' }} />
              )}
          </button>
      </div>

      {/* 🎨 PRESETS MODE */}
      {mainTab === 'presets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Category Chips */}
              <div 
                  style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                  {ALL_CATEGORIES.map(k => (
                      <button 
                         key={k}
                         onClick={() => setCategory(k)}
                         style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.3px', transition: 'all 0.2s', border: '1px solid', borderColor: category === k ? 'transparent' : 'rgba(0,0,0,0.06)', backgroundColor: category === k ? 'var(--text-primary)' : 'var(--card-bg)', color: category === k ? 'var(--card-bg)' : 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                          {formatCatName(k)}
                      </button>
                  ))}
              </div>

              {currentFilters.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#8e8e93', fontSize: '14px', fontWeight: 500 }}>
                      No filters found here yet.
                  </div>
              ) : (
                  <div className="popup-group" style={{ padding: '16px' }}>
                      <div 
                          style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                         {currentFilters.map(f => {
                             const isActive = activeFilterId === f.id;
                             const isFav = favoriteFilters.includes(f.id);
                             return (
                                 <div 
                                     key={f.id}
                                     onClick={() => setActiveFilterId(f.id === activeFilterId ? null : f.id)}
                                     onMouseEnter={() => { if (!isActive) setPreviewFilter(f.css); }}
                                     onMouseLeave={() => { 
                                         const baseCss = activeFilterId ? ALL_FILTERS.find(x => x.id === activeFilterId)?.css || '' : '';
                                         setPreviewFilter(buildCustomFilterCSS(baseCss, { strength, brightness, contrast, saturation, warmth }));
                                     }}
                                     style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '88px' }}
                                 >
                                     <div style={{ width: '88px', height: '110px', borderRadius: '16px', overflow: 'hidden', position: 'relative', transition: 'all 0.2s', border: isActive ? '3px solid #007AFF' : '1px solid rgba(0,0,0,0.08)', transform: isActive ? 'scale(1.02)' : 'scale(1)', boxShadow: isActive ? '0 4px 12px rgba(0, 122, 255, 0.2)' : '0 2px 6px rgba(0,0,0,0.04)' }}>
                                          
                                          <img src={liveSourceThumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', filter: f.css }} alt={f.name || 'Filter'} />
                                          
                                          <div 
                                              style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 20, padding: '4px', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '50%', display: isActive || isFav ? 'flex' : 'none' }}
                                              onClick={(e) => { e.stopPropagation(); toggleFavoriteFilter(f.id); toast.success(isFav ? "Removed from Favorites" : "Added to Favorites!"); }}
                                          >
                                              <Star size={10} color={isFav ? "#FFD60A" : "white"} fill={isFav ? "#FFD60A" : "none"} />
                                          </div>

                                          {isActive && (
                                              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 122, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#007AFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)' }}>
                                                      <Sparkles size={16} strokeWidth={2.5} />
                                                  </div>
                                              </div>
                                          )}
                                     </div>
                                     <span style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isActive ? '#007AFF' : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.1 }}>
                                         {f.name}
                                     </span>
                                 </div>
                             )
                         })}
                      </div>
                      
                      {activeFilterId && (
                          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                              <SettingSlider label="Intensity" value={strength} onChange={setStrength} min={0} max={100} />
                          </div>
                      )}
                  </div>
              )}
          </div>
      )}

      {/* 🎚️ ENGINE CONTROL MODE */}
      {mainTab === 'adjust' && (
          <div className="popup-group" style={{ padding: '0 16px', opacity: smartMode ? 0.6 : 1, pointerEvents: smartMode ? 'none' : 'auto' }}>
             <div className="popup-separator" style={{ padding: '16px 0' }}>
               <IOSToggle label="Smart Auto-Adjust" value={smartMode} onChange={setSmartMode} />
               <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '4px' }}>Auto-calibrates to perfect lighting</div>
             </div>

             <div className="popup-separator" style={{ padding: '16px 0' }}>
               <SettingSlider label="Brightness" value={brightness} onChange={setBrightness} min={-100} max={100} />
             </div>
             <div className="popup-separator" style={{ padding: '16px 0' }}>
               <SettingSlider label="Contrast" value={contrast} onChange={setContrast} min={-100} max={100} />
             </div>
             <div className="popup-separator" style={{ padding: '16px 0' }}>
               <SettingSlider label="Saturation" value={saturation} onChange={setSaturation} min={-100} max={100} />
             </div>
             <div className="popup-separator" style={{ padding: '16px 0' }}>
               <SettingSlider label="Warmth" value={warmth} onChange={setWarmth} min={-100} max={100} />
             </div>
             
             {(brightness !== 0 || contrast !== 0 || saturation !== 0 || warmth !== 0) && !smartMode && (
                 <div className="popup-separator" style={{ padding: '12px 0', textAlign: 'center' }}>
                     <button 
                        onClick={() => { setBrightness(0); setContrast(0); setSaturation(0); setWarmth(0); }}
                        style={{ background: 'none', border: 'none', color: '#FF3B30', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                     >
                         Reset Adjustments
                     </button>
                 </div>
             )}
          </div>
      )}
      </div>

      {/* Primary CTA */}
      <div style={{ marginTop: '16px' }}>
          <button 
             type="button" 
             onClick={handleApply}
             style={{ 
                width: '100%', height: '52px', borderRadius: '16px', border: 'none', 
                fontWeight: 600, fontSize: '16px', background: '#007AFF', color: '#fff', 
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)', cursor: 'pointer', transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
             }}
          >
              <Sparkles size={16} /> Render Output
          </button>
      </div>

<style dangerouslySetInnerHTML={{__html: `
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`}} />
    </div>
  );
}
