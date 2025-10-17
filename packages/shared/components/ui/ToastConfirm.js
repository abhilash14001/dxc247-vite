import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';

const ToastConfirm = ({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  type = "warning" // warning, danger, info
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '🗑️';
      case 'info':
        return 'ℹ️';
      case 'warning':
      default:
        return '⚠️';
    }
  };

  const confirmModal = () => {
    const modalElement = document.createElement('div');
    modalElement.id = 'toast-confirm-modal';
    document.body.appendChild(modalElement);

    const ModalContent = () => {
      useEffect(() => {
        const handleEscape = (e) => {
          if (e.key === 'Escape') {
            handleCancel();
          }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        return () => {
          document.removeEventListener('keydown', handleEscape);
          document.body.style.overflow = 'unset';
        };
      }, []);

      return createPortal(
        <div className="toast-confirm-overlay" onClick={handleCancel}>
          <div className="toast-confirm-container" data-type={type} onClick={(e) => e.stopPropagation()}>
            <div className="toast-confirm-header">
              <div className="toast-confirm-header-left">
                <span className="toast-confirm-icon">{getIcon()}</span>
                <span className="toast-confirm-title">{title}</span>
              </div>
              <button 
                className="toast-confirm-close"
                onClick={handleCancel}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="toast-confirm-message">{message}</div>
            <div className="toast-confirm-actions">
              <button
                className={`btn btn-${type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'primary'}`}
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>,
        modalElement
      );
    };

    // Clean up function
    const cleanup = () => {
      const modal = document.getElementById('toast-confirm-modal');
      if (modal) {
        document.body.removeChild(modal);
      }
    };

    // Render the modal
    const root = createRoot(modalElement);
    root.render(<ModalContent />);

    return { cleanup };
  };

  return { show: confirmModal };
};

// Hook for easier usage
export const useToastConfirm = () => {
  const showConfirm = (options) => {
    return new Promise((resolve) => {
      let cleanupFunction = null;
      
      const { show } = ToastConfirm({
        ...options,
        onConfirm: () => {
          if (options.onConfirm) {
            options.onConfirm();
          }
          if (cleanupFunction) {
            cleanupFunction();
          }
          resolve(true);
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
          if (cleanupFunction) {
            cleanupFunction();
          }
          resolve(false);
        }
      });
      
      const result = show();
      cleanupFunction = result.cleanup;
    });
  };

  return { showConfirm };
};

export default ToastConfirm;
