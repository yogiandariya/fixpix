import React from 'react';
import StickerStudio from '../tools/StickerStudio';

export default function StickersPopup({ feature, onClose }) {
    return (
        <div className="popup-body">
            <StickerStudio onClose={onClose} />
        </div>
    );
}
