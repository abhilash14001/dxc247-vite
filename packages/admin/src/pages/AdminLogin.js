import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import {
  faUser,
  faLock,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { loginSuccess, setAuthLoading, logout } from "@dxc247/shared/store/admin/adminSlice";
import { setLiveModeData, setServerPublicKey } from "@dxc247/shared/store/slices/commonDataSlice";
import { useGameNames } from "@dxc247/shared/store/admin/useGameNames";
import Notify from "@dxc247/shared/utils/Notify";

function AdminLogin() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, token, tokenExpiresAt, user } = useSelector(state => state.admin);
  const { liveModeData, serverPublicKey } = useSelector(state => state.commonData);
  const { fetchGameNames } = useGameNames();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "1",
  });
  const [cssLoaded, setCssLoaded] = useState(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/AdminLogin.css';
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
    preloadLink.href = 'assets/css/AdminLogin.css';
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
    // Simplified initialization - fetch public key and live mode data
    // Only run once on mount, not when dependencies change
    let isMounted = true;
    
    const initializePage = async () => {
      try {
        
        // Fetch public key if not already stored
        if (!serverPublicKey) {
          const keyResponse = await adminApi('/p-key-get', 'GET');
          
          if (isMounted && keyResponse && keyResponse.publicKey) {
            dispatch(setServerPublicKey(keyResponse.publicKey));
          } else if (isMounted) {
            console.warn("⚠️ Failed to fetch public key, will use fallback");
          }
        }

        // Fetch live mode data - check if already exists (handle both object and array)
        const hasLiveModeData = liveModeData && (
          (Array.isArray(liveModeData) && liveModeData.length > 0) ||
          (!Array.isArray(liveModeData) && Object.keys(liveModeData).length > 0)
        );
        
        if (!hasLiveModeData) {
          const liveModeResponse = await adminApi(`${ADMIN_BASE_PATH}/domain-details`, 'GET');
          if (isMounted && liveModeResponse) {
            dispatch(setLiveModeData(liveModeResponse));
          }
        }
      } catch (error) {
        console.error('Failed to initialize page:', error);
        // Don't block page if initialization fails
      } finally {
        // Always set loading to false after initialization completes
        if (isMounted) {
          dispatch(setAuthLoading(false));
        }
      }
    };

    initializePage();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Check authentication and token validity
  useEffect(() => {
    // Only run this effect when we're actually on the login page
    if (location.pathname !== '/login') {
      redirectingRef.current = false; // Reset redirect flag when not on login page
      return;
    }

    // Wait for loading to complete before making redirect decisions
    if (loading) {
      return;
    }

    // Prevent multiple simultaneous redirects
    if (redirectingRef.current) {
      return;
    }

    // Only redirect if authenticated AND token is valid AND we have all required data
    if (isAuthenticated && token && tokenExpiresAt && user) {
      const now = Date.now();
      const expiration = parseInt(tokenExpiresAt);
      
      // Check if token is still valid
      if (now < expiration) {
        let timeoutId = null;
        
        // Check for password change requirements first
        if (user.change_password === 1) {
          // Only navigate if not already on the target page to prevent loops
          if (location.pathname !== '/change-password') {
            redirectingRef.current = true;
            navigate('/change-password', { replace: true });
            // Reset after navigation completes
            timeoutId = setTimeout(() => { redirectingRef.current = false; }, 500);
          }
        }
        else if (user.change_password === 0 && user.change_transaction_password === 1) {
          // Only navigate if not already on the target page to prevent loops
          if (location.pathname !== '/transaction-password') {
            redirectingRef.current = true;
            navigate('/transaction-password', { replace: true });
            // Reset after navigation completes
            timeoutId = setTimeout(() => { redirectingRef.current = false; }, 500);
          }
        }
        else {
          // If no password changes needed, redirect to dashboard
          // Only navigate if not already on dashboard to prevent loops
          if (location.pathname !== '/' && location.pathname !== '/dashboard') {
            redirectingRef.current = true;
            navigate('/', { replace: true });
            // Reset after navigation completes
            timeoutId = setTimeout(() => { redirectingRef.current = false; }, 500);
          }
        }
        
        // Cleanup timeout on unmount
        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
      } else {
        // Token expired - dispatch logout to clear state
        dispatch(logout());
      }
    }
    
  }, [isAuthenticated, token, tokenExpiresAt, user, navigate, dispatch, location.pathname, loading]);

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
         const data = await adminApi(`${ADMIN_BASE_PATH}/login`, "POST", formData, true);

      

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
                          className="btn login-button-default btn-primary btn-block"
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
  );
}

export default AdminLogin;
