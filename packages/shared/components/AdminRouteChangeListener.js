import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../store/slices/navigationSlice';

const AdminRouteChangeListener = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the redirect to prevent rapid-fire redirects
    timeoutRef.current = setTimeout(() => {
      const currentPath = location.pathname;
      
      // Allowed routes when password change is required
      const allowedRoutes = ['/login', '/change-password', '/transaction-password'];
      const isAllowedRoute = allowedRoutes.includes(currentPath);
      
      // For admin users, check both password and transaction password
      if (userState.isAuthenticated && userState.user) {
        // First check if password change is needed
        if (userState.user.ch_pas === 1 && !isAllowedRoute) {
          // Only redirect if not already on the target page
          if (currentPath !== '/change-password') {
            dispatch(navigate('/change-password'));
          }
        }
        // Only check transaction password if regular password is already changed
        else if (userState.user.ch_pas === 0 && userState.user.isTrPassChange === 1 && !isAllowedRoute) {
          // Only redirect if not already on the target page
          if (currentPath !== '/transaction-password') {
            dispatch(navigate('/transaction-password'));
          }
        }
        // If both password changes are needed, prioritize regular password first
        else if (userState.user.ch_pas === 1 && userState.user.isTrPassChange === 1 && !isAllowedRoute) {
          // Only redirect if not already on the target page
          if (currentPath !== '/change-password') {
            dispatch(navigate('/change-password'));
          }
        }
      }
    }, 100); // 100ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, userState.isAuthenticated, userState.user, dispatch]);

  return null;
};

export default AdminRouteChangeListener;
