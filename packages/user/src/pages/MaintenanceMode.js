import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosFetch from "@dxc247/shared/utils/Constants";
import { setLiveModeData } from "@dxc247/shared/store/slices/commonDataSlice";

const MaintenanceMode = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const liveModeData = useSelector((state) => state.commonData.liveModeData);

  // Poll for domain-details to check if maintenance mode is turned off
  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const response = await axiosFetch("admin/domain-details", "GET");
        if (response && response.data) {
          const data = response.data?.data || response.data;
          dispatch(setLiveModeData(data));
          
          // If maintenance mode is turned off, redirect to login
          if (data.maintenance_mode === 0) {
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking maintenance status:", error);
      }
    };

    // Check immediately
    checkMaintenanceStatus();

  }, [dispatch, navigate]);

  return (
    <main>
      <div className="wrapper">
        <div className="login-page">
          <div className="login-box" style={{ maxWidth: '600px' }}>
            <div className="logo-login">
              <img
                src={
                  liveModeData?.logo ||
                  `${import.meta.env.VITE_MAIN_URL}/uploads/sites_configuration/C3K6931720187871logo (1).png`
                }
                alt="Logo"
              />
            </div>
            <div className="login-form mt-4">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="mb-4">
                  <i className="fas fa-tools fa-5x" style={{ color: '#ffc107' }}></i>
                </div>
                <h2 className="text-center mb-3" style={{ color: '#333' }}>
                  Site Under Maintenance
                </h2>
                <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  We're currently performing scheduled maintenance to improve your experience.
                  Please check back soon.
                </p>
                <p className="text-muted" style={{ fontSize: '14px' }}>
                  Thank you for your patience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MaintenanceMode;

