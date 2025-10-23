import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactionPasswordChanged } from '@dxc247/shared/store/admin/adminSlice';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

const AdminTransactionPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.admin);
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState('');
  const [cssLoaded, setCssLoaded] = useState(false);

  // Load CSS files and remove all.css for this page only
  useEffect(() => {
    // Remove all.css file for this page only
    const allCssLink = document.querySelector('link[href*="all.css"]');
    if (allCssLink) {
      allCssLink.remove();
    }

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
        setCssLoaded(true);
      } catch (error) {
        console.error("Failed to load CSS:", error);
        // Show page anyway after timeout
        setTimeout(() => {
          setPageReady(true);
          setCssLoaded(true);
        }, 1000);
      }
    };

    initializePage();

    // Cleanup function
    return () => {
      const loginStyles = document.querySelectorAll("link.login-style");
      loginStyles.forEach((link) => link.remove());
      // Restore all.css when leaving this page
      if (allCssLink) {
        document.head.appendChild(allCssLink);
      }
    };
  }, []);

  // Get transaction password from user state
  useEffect(() => {
    if (user && user.t_pswd) {
      setTransactionPassword(user.t_pswd);
    }
  }, [user]);

  const handleBack = async () => {
    setLoading(true);
    
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/user/update-transaction-password`, 'POST');

      if (response.success) {
        // Update Redux state
        dispatch(setTransactionPasswordChanged());
        navigate('/');
      }
    } catch (error) {
      console.error('Error updating transaction password status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading until CSS is ready
  if (!cssLoaded) {
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f8fb' }}>
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="text-center container">
          <h1>
            <span style={{ color: '#28a745' }}>
              Success! Your password has been updated successfully.
            </span>
          </h1>
          <h1>
            Your transaction password is{' '}
            <span 
              style={{ 
                color: '#17a2b8',
                backgroundColor: '#f8f9fa',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                fontFamily: 'monospace',
                fontSize: '1.2em'
              }}
            >
              {transactionPassword || 'N/A'}
            </span>
            .
          </h1>
          <h2>
            Please remember this transaction password, from now on all transaction of the website can be done only with this password and keep one thing in mind, do not share this password with anyone.
          </h2>
          <h2 style={{ marginTop: '1rem', color: '#343a40' }}>
            Thank you, Team {window.location.hostname}
          </h2>
          
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginTop: '3rem' }}>
              <span style={{ color: '#28a745' }}>
                Success! आपका पासवर्ड बदला जा चुका है।
              </span>
            </h1>
            <h1>
              आपका लेनदेन पासवर्ड{' '}
              <span 
                style={{ 
                  color: '#17a2b8',
                  backgroundColor: '#f8f9fa',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '1.2em'
                }}
              >
                {transactionPassword || 'N/A'}
              </span>{' '}
              है।
            </h1>
            <h2>
              कृपया इस लेन-देन के पासवर्ड को याद रखें, अब से वेबसाइट के सभी हस्तांतरण केवल इस पासवर्ड से किए जा सकते हैं और एक बात का ध्यान रखें, इस पासवर्ड को किसी के साथ साझा न करें।
            </h2>
            <h2 style={{ marginTop: '1rem', color: '#343a40' }}>
              धन्यवाद, टीम {window.location.hostname}
            </h2>
          </div>
          
          <button 
            type="button" 
            className="btn login-button-default btn-primary"
            onClick={handleBack}
            disabled={loading}
      
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Updating...
              </>
            ) : (
              <>
                <i className="text-align-center fas fa-home login-button-default mr-2"></i>
                Back to Admin Dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionPassword;
