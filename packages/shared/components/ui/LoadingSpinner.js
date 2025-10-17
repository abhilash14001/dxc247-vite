import React from 'react';

const LoadingSpinner = ({ 
  size = 'default', 
  color = 'primary', 
  centered = false, 
  height = '400px',
  className = ''
}) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  const colorClass = color === 'primary' ? 'text-primary' : `text-${color}`;
  const centerClass = centered ? 'd-flex justify-content-center align-items-center' : '';
  
  const spinner = (
    <div className={`spinner-border ${sizeClass} ${colorClass} ${className}`} role="status">
    </div>
  );

  if (centered) {
    return (
      <div className={centerClass} style={{ height }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
