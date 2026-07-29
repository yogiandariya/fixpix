import React from 'react';
import BackgroundStudio from '../tools/BackgroundStudio';
import useCanvasStore from '../../store/canvasStore';

export default function ChangeBGPopup({ feature, onClose }) {
    return (
        <div className="popup-body">
            <BackgroundStudio onClose={onClose} />
        </div>
    );
}
