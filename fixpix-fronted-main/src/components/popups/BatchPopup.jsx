import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import IOSToggle from '../ui/IOSToggle';
import SegmentedControl from '../ui/SegmentedControl';
import SettingSlider from '../ui/SettingSlider';
import { useFeatureApply } from '../../hooks/useFeatureApply';
import useToastStore from '../../store/toastStore';
import { useNavigate } from 'react-router-dom';

export default function BatchPopup({ feature, onClose }) {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [face, setFace] = useState(true);
    const [res, setRes] = useState(false);
    const [bg, setBg] = useState(false);
    const [format, setFormat] = useState('PNG');
    const [quality, setQuality] = useState(85);
    const fileInputRef = useRef(null);

    const toast = useToastStore();
    const navigate = useNavigate();

    const handleFiles = (newFiles) => {
        const imageFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) return;
        setFiles(prev => [...prev, ...imageFiles].slice(0, 10)); // Limit to 10 for batch
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleApply = () => {
        if (files.length === 0) {
            toast.error("Please add files to the batch queue");
            return;
        }

        onClose();
        
        // Let's assume there's a batch studio route
        // This was simply: navigate('/batch') in User's spec
        navigate('/batch', { state: { files, settings: { face, res, bg, format, quality } } });
    };

    return (
        <div className="popup-body">
            <div className="popup-controls" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Upload Group */}
                <div className="popup-group" style={{ padding: '16px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Batch Queue</div>
                        <div style={{ backgroundColor: 'var(--fill-secondary)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {files.length} / 10 IMAGES
                        </div>
                    </div>

                    {/* Drag & Drop Zone */}
                    <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100%',
                            height: '120px',
                            borderRadius: '16px',
                            border: `2px dashed ${isDragging ? '#007AFF' : 'var(--border-subtle)'}`,
                            backgroundColor: isDragging ? 'rgba(0, 122, 255, 0.05)' : 'transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            marginBottom: files.length > 0 ? '16px' : '0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={(e) => handleFiles(e.target.files)} 
                        />
                        
                        <Upload 
                            size={24} 
                            strokeWidth={2} 
                            style={{ color: isDragging ? '#007AFF' : 'var(--text-secondary)', marginBottom: '8px', transition: 'all 0.2s' }} 
                        />
                        <div style={{ fontSize: '13px', fontWeight: 600, color: isDragging ? '#007AFF' : 'var(--text-primary)' }}>
                            {isDragging ? 'Drop images here' : 'Drag & Drop Images'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            or click to browse
                        </div>
                    </div>

                    {/* Thumbnail Queue */}
                    {files.length > 0 && (
                        <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            overflowX: 'auto', 
                            paddingBottom: '4px',
                            width: '100%',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            <AnimatePresence>
                                {files.map((file, i) => (
                                    <motion.div
                                        key={file.name + i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        style={{
                                            flex: '0 0 52px',
                                            height: '52px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            cursor: 'default',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                            style={{
                                                position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.9)', 
                                                border: 'none', borderRadius: '6px', width: '18px', height: '18px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <X size={12} color="#FF3B30" strokeWidth={3} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Processing Pipelines */}
                <div className="popup-group">
                    <div className="popup-separator" style={{ padding: '8px 0' }}><IOSToggle label="Auto Face Restore" value={face} onChange={setFace} /></div>
                    <div className="popup-separator" style={{ padding: '8px 0' }}><IOSToggle label="Auto Super Resolution" value={res} onChange={setRes} /></div>
                    <div className="popup-separator" style={{ padding: '8px 0' }}><IOSToggle label="Auto Remove Background" value={bg} onChange={setBg} /></div>
                </div>

                {/* Output Formats */}
                <div className="popup-group">
                    <div className="popup-separator" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Output Format</div>
                        <div style={{ flex: 1, maxWidth: '200px' }}>
                            <SegmentedControl options={['PNG', 'JPG', 'WebP']} value={format} onChange={setFormat} />
                        </div>
                    </div>
                    <div className="popup-separator" style={{ padding: '16px 0' }}>
                        <SettingSlider label="Render Quality" value={quality} onChange={setQuality} min={60} max={100} />
                    </div>
                </div>

            </div>

            <div style={{ marginTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={handleApply}
                  style={{ 
                    width: '100%', height: '52px', borderRadius: '16px', border: 'none', 
                    fontWeight: 600, fontSize: '16px', background: '#007AFF', color: '#fff', 
                    boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)', cursor: 'pointer', transition: 'all 0.2s ease',
                    opacity: files.length === 0 ? 0.5 : 1
                  }}
                >
                    Process Batch
                </button>
            </div>
        </div>
    );
}
