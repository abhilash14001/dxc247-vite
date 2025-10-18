import React from 'react';

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes",
  cancelText = "No",
  type = "warning" // warning, danger, info
}) => {
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

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (onHide) {
      onHide();
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div 
        className="modal fade show" 
        style={{ display: 'block' }} 
        tabIndex="-1" 
        role="dialog"
        onClick={handleClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered modal-sm" 
          style={{
            margin : "0 auto"
            
          }}
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                <span className="confirm-icon me-2">{getIcon()}</span>
                {title}
              </h4>
              <button
                type="button"
                className="close"
                onClick={handleClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`btn btn-${type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'primary'}`}
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
