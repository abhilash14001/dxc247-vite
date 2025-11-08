import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminNotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.admin || {});

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="fa fa-exclamation-triangle fa-5x text-warning"></i>
              </div>
              <h1 className="display-1 text-muted mb-3">404</h1>
              <h2 className="text-muted mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">
                The page you are looking for (<code>{location.pathname}</code>) does not exist or has been moved.
              </p>
              <div className="d-flex justify-content-center gap-3">
                {isAuthenticated ? (
                  <Link 
                    to="/" 
                    className="btn btn-primary"
                  >
                    <i className="fa fa-home"></i> Go to Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="btn btn-primary"
                  >
                    <i className="fa fa-sign-in-alt"></i> Go to Login
                  </Link>
                )}
                <button 
                  onClick={() => window.history.back()} 
                  className="btn btn-secondary"
                >
                  <i className="fa fa-arrow-left"></i> Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound;

