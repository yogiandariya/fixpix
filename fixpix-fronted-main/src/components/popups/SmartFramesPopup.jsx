import React from 'react';
import SmartFramesStudio from '../tools/SmartFramesStudio';
import useCanvasStore from '../../store/canvasStore';

export default function SmartFramesPopup({ feature, onClose }) {
    return (
        <div className="popup-body">
            <SmartFramesStudio 
                onClose={onClose} 
                onApply={(dataUrl) => {
                    const store = useCanvasStore.getState();
                    const beforeUrl = store.getWorkingImage();
                    store.startProcessing({ featureId: 'smart-frames', featureName: 'Smart Frame', featureIcon: '🖼️', featureColor: '#06b6d4' });
                    
                    setTimeout(() => {
                        store.completeProcessing(
                            typeof beforeUrl === 'string' ? beforeUrl : null,
                            dataUrl, 'Smart Frame', '🖼️'
                        );
                        store.pushEdit(dataUrl, 'Smart Frame', 'smart-frames');
                    }, 800);
                    
                    onClose();
                }} 
            />
        </div>
    );
}
