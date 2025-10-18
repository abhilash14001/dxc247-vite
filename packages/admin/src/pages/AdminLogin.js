import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import {
  faUser,
  faLock,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { adminApi } from "../utils/api";
import { loginSuccess, setAuthLoading } from "@dxc247/shared/store/admin/adminSlice";
import { setLiveModeData } from "@dxc247/shared/store/slices/commonDataSlice";
import { useGameNames } from "@dxc247/shared/store/admin/useGameNames";
import AdminRouteGuard from "../components/AdminRouteGuard";
import Notify from "@dxc247/shared/utils/Notify";

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.admin);
  const { liveModeData } = useSelector(state => state.commonData);
  const { fetchGameNames } = useGameNames();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "1",
  });
  const [cssLoaded, setCssLoaded] = useState(false);
  

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/pages/AdminLogin.css';
    link.media = 'all';
    link.crossOrigin = 'anonymous';
    
    // Track when CSS is loaded
    link.onload = () => {
      setCssLoaded(true);
    };
    
    link.onerror = () => {
      console.warn('Failed to load AdminLogin.css, showing form anyway');
      setCssLoaded(true);
    };
    
    // Preload for faster loading
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/src/pages/AdminLogin.css';
    preloadLink.as = 'style';
    preloadLink.onload = () => {
      document.head.appendChild(link);
    };
    
    preloadLink.onerror = () => {
      // If preload fails, try direct loading
      document.head.appendChild(link);
    };
    
    document.head.appendChild(preloadLink);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(preloadLink)) {
        document.head.removeChild(preloadLink);
      }
    };
  }, []);

  useEffect(() => {
    
    // Simplified initialization - no CSS loading, just fetch live mode data
    const initializePage = async () => {
      dispatch(setAuthLoading(false));

      try {
        if(liveModeData && liveModeData.length > 0) return;
        const liveModeResponse = await adminApi(`${ADMIN_BASE_PATH}/domain-details`, 'GET');
        if (liveModeResponse.success && liveModeResponse.data) {
          dispatch(setLiveModeData(liveModeResponse.data));
        }
      } catch (error) {
        console.error('Failed to fetch live mode data:', error);
        // Don't block page if live mode data fetch fails
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
     
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
      
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Notify("Username is required", null, null, 'danger');
      return false;
    }

    if (!formData.password.trim()) {
      Notify("Password is required", null, null, 'danger');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    

    try {
         const data = await adminApi(`${ADMIN_BASE_PATH}/login`, "POST", formData);

      

      if (data.success) {
        
        Notify(data.message || "Login successful!", null, null, 'success');
        // Use Redux login action
        
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        
        
        // Fetch game names after successful login
        try {
          await fetchGameNames();
          
        } catch (error) {
          console.error('Failed to fetch game names after login:', error);
          // Don't block navigation if game names fetch fails
        }

        // Fetch live mode data after successful login
    
        
        navigate('/');
      } else {
        
        Notify(data.message || "Login failed", null, null, 'danger');
      }
    } catch (error) {
      console.error("Admin Login - Error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      Notify(errorMessage, null, null, 'danger');
    } finally {
      
    }
  };

  // Loading component
  const LoadingScreen = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #e3e3e3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <div style={{
        fontSize: '16px',
        color: '#666',
        fontWeight: '500'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // Show loading screen until CSS is loaded
  if (!cssLoaded) {
    return <LoadingScreen />;
  }

  return (
    <AdminRouteGuard>
      <div id="app">
      {/* Loading Screen - Removed, show login immediately */}
      
      <div className="login" style={{ display: 'flex' }}>
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="loginInner1">
                  <div className="log-logo text-center">
                    <img
                      src={liveModeData?.logo || 'https://admin.dmt77.com/uploads/sites_configuration/C3K6931720187871logo%20(1).png'}
                      alt="Admin Logo"
                      className="logo-login"
                    />
                  </div>
                  <div className="featured-box-login featured-box-secundary default loginFrm">
                    <h2 className="text-center login-title">Sign In</h2>

                    <form onSubmit={handleSubmit}>
                      <input type="hidden" name="role" id="role" value="1" />

                      <div className="mb-4 input-group position-relative">
                        <input
                          name="username"
                          placeholder="Enter User Name"
                          type="text"
                          className="form-control"
                          aria-required="true"
                          aria-invalid="false"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={loading}
                          autoComplete="username"
                        />
                      </div>

                      <div className="mb-4 input-group position-relative">
                        <input
                          name="password"
                          placeholder="Enter Password"
                          type="password"
                          className="form-control"
                          aria-required="true"
                          aria-invalid="false"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={loading}
                          autoComplete="current-password"
                        />
                      </div>

                      <div className="form-group text-center mb-3">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="btn btn-primary btn-block"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              Signing In...{" "}
                            </>
                          ) : (
                            <>
                              Sign In{" "}
                              <FontAwesomeIcon
                                icon={faSignInAlt}
                                className="loginicon ml-2 fas fa-sign-in-alt"
                              />
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-success"
                        id="btn_submit"
                        style={{ display: "none" }}
                      >
                        Login
                      </button>
                    </form>
                  </div>

                  <p className="mt-3 pt-1 text-center">
                    <a href="mailto:info@Dxc247.Com" className="mail-link">
                      info@Dxc247.Com <span className="ml-1"></span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminRouteGuard>
  );
}

export default AdminLogin;
