import React from 'react';

export default function Loading({ dark = false, className = '' }) {
  return (
    <div className={`spinner ${dark ? 'spinner-dark' : ''} ${className}`} aria-hidden="true" />
  );
}
