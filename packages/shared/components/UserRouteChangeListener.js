import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../store/slices/navigationSlice';

const UserRouteChangeListener = () => {
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
      
      if (userState.isAuthenticated) {
        // For regular users, only check password change (not transaction password)
        if (userState.user && userState.user.ch_pas === 1 && !isAllowedRoute) {
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

export default UserRouteChangeListener;
