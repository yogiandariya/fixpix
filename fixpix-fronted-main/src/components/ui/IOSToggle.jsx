import React from 'react';

const IOSToggle = ({ value, onChange, label, sublabel }) => {
  return (
    <div className="setting-row">
      <div>
        <div className="setting-label">{label}</div>
        {sublabel && <div className="setting-sublabel">{sublabel}</div>}
      </div>
      <div 
        className={`ios-toggle ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
      />
    </div>
  );
};

export default IOSToggle;
