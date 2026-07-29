import React from 'react';
import { FEATURES } from '../data/features';

export default function MobileToolsDrawer({ isOpen, onClose, onFeatureSelect }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="drawer-backdrop" onClick={onClose} />
      )}
      
      {/* Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* Handle */}
        <div className="drawer-handle" />
        
        {/* Header */}
        <div className="drawer-header">
          <span className="drawer-title">AI Tools</span>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        
        {/* Tools grid */}
        <div className="mobile-tools-grid">
          {FEATURES.map(f => (
            <div
              key={f.id}
              className="mobile-tool-card"
              onClick={() => { onFeatureSelect(f); onClose(); }}
            >
              <div className={`feature-icon-wrap ${f.iconClass}`}>
                {f.icon}
              </div>
              <span className="mobile-tool-label">{f.name}</span>
            </div>
          ))}
        </div>
        
      </div>
    </>
  )
}
