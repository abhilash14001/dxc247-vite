import React from 'react';

const ToggleSwitch = ({ checked, onChange, disabled = false, size = 'medium' }) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const sizeClasses = {
    small: 'toggle-switch-small',
    medium: 'toggle-switch-medium',
    large: 'toggle-switch-large'
  };

  return (
    <div className={`toggle-switch ${sizeClasses[size]} ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
        className="toggle-input"
        id={`toggle-${Math.random().toString(36).substr(2, 9)}`}
      />
      <label 
        htmlFor={`toggle-${Math.random().toString(36).substr(2, 9)}`}
        className="toggle-label"
      >
        <span className="toggle-slider"></span>
      </label>
      <style jsx>{`
        .toggle-switch {
          position: relative;
          display: inline-block;
        }

        .toggle-input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-label {
          display: block;
          width: 50px;
          height: 24px;
          background-color: #ccc;
          border-radius: 24px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .toggle-label:hover {
          background-color: #bbb;
        }

        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-input:checked + .toggle-label {
          background-color: #007bff;
        }

        .toggle-input:checked + .toggle-label .toggle-slider {
          transform: translateX(26px);
        }

        .toggle-input:focus + .toggle-label {
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }

        .toggle-switch.disabled .toggle-label {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .toggle-switch.disabled .toggle-label:hover {
          background-color: #ccc;
        }

        /* Size variations */
        .toggle-switch-small .toggle-label {
          width: 40px;
          height: 20px;
        }

        .toggle-switch-small .toggle-slider {
          width: 16px;
          height: 16px;
          top: 2px;
          left: 2px;
        }

        .toggle-switch-small .toggle-input:checked + .toggle-label .toggle-slider {
          transform: translateX(20px);
        }

        .toggle-switch-large .toggle-label {
          width: 60px;
          height: 30px;
        }

        .toggle-switch-large .toggle-slider {
          width: 26px;
          height: 26px;
          top: 2px;
          left: 2px;
        }

        .toggle-switch-large .toggle-input:checked + .toggle-label .toggle-slider {
          transform: translateX(30px);
        }
      `}</style>
    </div>
  );
};

export default ToggleSwitch;
