import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';

const AdminPasswordModal = ({
  show,
  password,
  setPassword,
  loading,
  error,
  onSubmit,
  onClose,
  onClearError
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show"
        style={{ display: 'block' }}
        tabIndex="-1"
        role="dialog"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-sm"
          role="document"
          style={{
            margin : "0 auto"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <FontAwesomeIcon icon={faLock} className="me-2" /> &nbsp;
              Admin Password Verification
            </h5>
            <button
              type="button"
              className="close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="adminPassword" className="form-label">
                  Enter Admin Password
                </label>
                <input
                  type="password"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  id="adminPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    console.log('Input focused, error:', error, 'onClearError:', !!onClearError);
                    if (error && onClearError) {
                      console.log('Clearing error...');
                      onClearError();
                    }
                  }}
                  placeholder="Enter your admin password"
                  disabled={loading}
                  autoFocus
                />
                {error && (
                  <div className="invalid-feedback">
                    {error}
                  </div>
                )}
              </div>
              
              <div className="alert alert-info">
                <small>
                  <strong>Security Notice:</strong> This action requires admin password verification for security purposes.
                </small>
              </div>
              
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !password.trim()}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPasswordModal;
