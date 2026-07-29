import React from 'react';

const SettingSlider = ({ label, value, onChange, min=0, max=100, leftLabel, rightLabel }) => {
  return (
    <div className="setting-slider-row" style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span className="setting-label">{label}</span>
        <span className="slider-value">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} 
             onChange={e => onChange(Number(e.target.value))}
             className="ios-slider"
             style={{ '--val': ((value - min) / (max - min)) * 100 }} />
      {(leftLabel || rightLabel) && (
        <div className="slider-labels">
          <span>{leftLabel}</span><span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
};

export default SettingSlider;
