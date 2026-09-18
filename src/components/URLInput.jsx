import React from 'react';

export default function URLInput({ value, onChange, disabled }) {
  return (
    <div className="form-group">
      <label className="form-label">YouTube Video URL</label>
      <input
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={disabled}
      />
    </div>
  );
}
