import React from 'react';

const SegmentedControl = ({ options, value, onChange }) => {
  const activeIndex = options.indexOf(value);
  const segmentWidth = 100 / options.length;

  return (
    <div className="segmented-control" style={{ '--active-index': activeIndex, '--options-count': options.length }}>
      <div className="segment-highlight" />
      {options.map(opt => (
        <button 
          key={opt}
          type="button"
          className={`segment ${value === opt ? 'active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
