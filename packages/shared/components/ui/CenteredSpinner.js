import React from 'react';

const CenteredSpinner = ({ 
  size = '40px', 
  color = '#007bff', 
  fullScreen = false,
  className = '',
  style = {}
}) => {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `4px solid #f3f3f3`,
    borderTop: `4px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin-spinner 1s linear infinite',
    display: 'inline-block'
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      zIndex: 9999
    }),
    ...style
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
      <div className={`centered-spinner ${className}`} style={containerStyle}>
        <div className="spinner" style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default CenteredSpinner;
