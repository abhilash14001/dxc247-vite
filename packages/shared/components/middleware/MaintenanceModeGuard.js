import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosFetch from '../../utils/Constants';
import { setLiveModeData } from '../../store/slices/commonDataSlice';

/**
 * Maintenance Mode Guard Middleware
 * Redirects users to maintenance page if maintenance_mode is 1
 */
const MaintenanceModeGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get live mode data from Redux store
  const liveModeData = useSelector((state) => state.commonData.liveModeData);

  // Refetch domain-details when on maintenance page to check if maintenance mode is turned off
  useEffect(() => {
    if (location.pathname === '/maintenance') {
      const refetchDomainDetails = async () => {
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
          console.error("Error refetching domain details:", error);
        }
      };

      // Refetch immediately when on maintenance page
      refetchDomainDetails();

   
    }
  }, [location.pathname, dispatch, navigate]);

  useEffect(() => {
    // Check if maintenance mode is enabled
    if (liveModeData && liveModeData.maintenance_mode === 1) {
      // Allow access to maintenance page itself
      if (location.pathname !== '/maintenance') {
        navigate('/maintenance', { replace: true });
      }
    } else if (liveModeData && liveModeData.maintenance_mode === 0 && location.pathname === '/maintenance') {
      // If maintenance mode is turned off and we're on maintenance page, redirect to login
      navigate('/login', { replace: true });
    }
  }, [liveModeData, location.pathname, navigate]);

  // If maintenance mode is enabled and not on maintenance page, don't render children
  // Wait for liveModeData to be available before blocking
  if (liveModeData && liveModeData.maintenance_mode === 1 && location.pathname !== '/maintenance') {
    return null;
  }

  return children;
};

export default MaintenanceModeGuard;

