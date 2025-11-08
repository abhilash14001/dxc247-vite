import React, { lazy } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Lazy load layout components
const Header = lazy(() => import("@dxc247/shared/components/layouts/Header"));
const SidebarLayout = lazy(() => import("@dxc247/shared/components/layouts/SidebarLayout"));
const Footer = lazy(() => import("@dxc247/shared/components/layouts/Footer"));
const NavTabs = lazy(() => import("@dxc247/shared/components/NavTabs"));

const NotFound = () => {
  const location = useLocation();
  const { token } = useSelector(state => state.user || {});
  const isAuthenticated = !!token;

  return (
    <div>
      <Header />
      <div className="main-container">
        <SidebarLayout />
        <NavTabs />
        <div className="center-main-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 250px)',
          marginTop: '-500px',
          width: '100%',
          flex: 1
        }}>
          <style>{`
            .center-main-container {
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
          `}</style>
          <div style={{ 
            textAlign: 'center', 
            maxWidth: '600px', 
            width: '100%', 
            padding: '20px'
          }}>
            <div className="mb-4">
              <i className="fa fa-exclamation-triangle fa-5x text-warning"></i>
            </div>
            <h1 className="display-1 text-muted mb-3">404</h1>
            <h2 className="text-muted mb-3">Page Not Found</h2>
            <p className="text-muted mb-4">
              The page you are looking for (<code>{location.pathname}</code>) does not exist or has been moved.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {isAuthenticated ? (
                <Link 
                  to="/" 
                  className="btn btn-primary"
                >
                  <i className="fa fa-home"></i> Go to Home
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
      <Footer />
    </div>
  );
};

export default NotFound;

