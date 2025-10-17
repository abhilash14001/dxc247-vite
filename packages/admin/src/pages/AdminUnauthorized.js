import React from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

const AdminUnauthorized = () => {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="fa fa-ban fa-5x text-danger"></i>
              </div>
              <h2 className="text-danger mb-3">Access Denied</h2>
              <p className="text-muted mb-4">
                You don't have permission to access this page. Please contact your administrator if you believe this is an error.
              </p>
              <Link 
                to={`${ADMIN_BASE_PATH}/`} 
                className="btn btn-primary"
              >
                <i className="fa fa-home"></i> Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUnauthorized;
