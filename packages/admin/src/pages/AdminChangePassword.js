import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPasswordChanged } from '@dxc247/shared/store/admin/adminSlice';
import { adminApi } from './adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faSpinner, faLock } from '@fortawesome/free-solid-svg-icons';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import './AdminLoginStyles.css';

const AdminChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.admin);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const userRef = useRef(user);

  // Update userRef when user changes
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Load CSS files like AdminLogin
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_MAIN_URL;

    const cssFiles = [
      `${baseUrl}/build/assets/login-4jY9LvNs.css`,
      "https://dzm0kbaskt4pv.cloudfront.net/v2/static/front/css/style.css",
    ];

    // Load each CSS file
    const loadCSS = (href) => {
      return new Promise((resolve, reject) => {
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) {
          resolve();
          return;
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.className = "login-style";
        link.onload = () => resolve();
        link.onerror = () => reject();
        document.head.appendChild(link);
      });
    };

    // Load CSS and show page when ready
    const initializePage = async () => {
      try {
        await Promise.all(cssFiles.map(loadCSS));
        setPageReady(true);
      } catch (error) {
        console.error("Failed to load CSS:", error);
        // Show page anyway after timeout
        setTimeout(() => {
          setPageReady(true);
        }, 1000);
      }
    };

    initializePage();

    // Cleanup function
    return () => {
      const loginStyles = document.querySelectorAll("link.login-style");
      loginStyles.forEach((link) => link.remove());
    };
  }, []);

  // Check if password change is needed
  useEffect(() => {
    if (userRef.current && userRef.current.change_password === 0) {
      // Password already changed, redirect to admin dashboard
      navigate('/');
    }
  }, [user, navigate]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.current_password.trim()) {
      newErrors.current_password = 'Current password is required';
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'New password must be at least 6 characters';
    }

    if (!formData.new_password_confirmation.trim()) {
      newErrors.new_password_confirmation = 'Please confirm your new password';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/change-password`, 'POST', formData);

      if (response.success) {
        // Password changed successfully
        Notify(response.message || 'Password changed successfully!', null, null, 'success');
        dispatch(setPasswordChanged());
        
        // Check if transaction password change is needed using useRef for safety
        if (userRef.current && userRef.current.change_transaction_password === 1) {
          // Redirect to transaction password page
          navigate('/transaction-password');
        } else {
          // Redirect to admin dashboard
          navigate('/');
        }
      } else {
        // Handle validation errors or other errors
        if (response.errors) {
          const errorMessages = [];
          for (let property in response.errors) {
            errorMessages.push(response.errors[property].join(", "));
          }
          Notify(errorMessages.join("\n"), null, null, 'danger');
        } else {
          Notify(response.message || 'Failed to change password', null, null, 'danger');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Handle API error response
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          Notify(errorData.message, null, null, 'danger');
        } else {
          Notify('Failed to change password', null, null, 'danger');
        }
      } else {
        Notify('An error occurred while changing password', null, null, 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading until CSS is ready
  if (!pageReady) {
    return (
      <div id="load">
        <div id="load-inner">
          <img src={`${import.meta.env.VITE_MAIN_URL}/uploads/sites_configuration/C3K6931720187871logo%20(1).png`} alt="Loading..." />
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <div className="wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="loginInner1">
                <div className="log-logo text-center">
                  <img
                    src={`${import.meta.env.VITE_MAIN_URL}/uploads/sites_configuration/C3K6931720187871logo%20(1).png`}
                    alt="Admin Logo"
                    className="logo-login"
                  />
                </div>
                <div className="featured-box-login featured-box-secundary default loginFrm">
                  <h2 className="text-center login-title">Change Password</h2>
                  <p className="text-center" style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
                    Please change your password to continue
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 input-group position-relative">
                      <input
                        name="current_password"
                        placeholder="Enter Current Password"
                        type="password"
                        className="form-control"
                        aria-required="true"
                        aria-invalid="false"
                        value={formData.current_password}
                        onChange={handleInputChange}
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      {errors.current_password && (
                        <small className="text-danger d-block mt-1">
                          {errors.current_password}
                        </small>
                      )}
                    </div>

                    <div className="mb-4 input-group position-relative">
                      <input
                        name="new_password"
                        placeholder="Enter New Password"
                        type="password"
                        className="form-control"
                        aria-required="true"
                        aria-invalid="false"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      {errors.new_password && (
                        <small className="text-danger d-block mt-1">
                          {errors.new_password}
                        </small>
                      )}
                    </div>

                    <div className="mb-4 input-group position-relative">
                      <input
                        name="new_password_confirmation"
                        placeholder="Confirm New Password"
                        type="password"
                        className="form-control"
                        aria-required="true"
                        aria-invalid="false"
                        value={formData.new_password_confirmation}
                        onChange={handleInputChange}
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      {errors.new_password_confirmation && (
                        <small className="text-danger d-block mt-1">
                          {errors.new_password_confirmation}
                        </small>
                      )}
                    </div>

                    <div className="form-group text-center mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            Changing Password...{" "}
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              className="ml-2"
                            />
                          </>
                        ) : (
                          <>
                            Change Password{" "}
                            <FontAwesomeIcon
                              icon={faKey}
                              className="ml-2"
                            />
                          </>
                        )}
                      </button>
                    </div>
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
  );
};

export default AdminChangePassword;
