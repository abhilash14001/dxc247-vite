import { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { hasPermission } from '@dxc247/shared/utils/permissionUtils';

const AdminRouteGuard = ({ children, requiredPermission }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token, loading, user } = useSelector(state => state.admin);

  useEffect(() => {
    // Don't redirect if still loading
    if (loading) {
      return;
    }

    // If on login page and already authenticated, redirect to admin dashboard
    if (location.pathname.includes(`${ADMIN_BASE_PATH}/login`) && isAuthenticated && token) {
      
      navigate(ADMIN_BASE_PATH, { replace: true });
      return;
    }

    // Check if user is not authenticated
    if (!isAuthenticated || !token) {
      // Redirect to login if not authenticated and on admin pages
      if (location.pathname.startsWith(ADMIN_BASE_PATH) && !location.pathname.includes(`${ADMIN_BASE_PATH}/login`)) {
        
        navigate(`${ADMIN_BASE_PATH}/login`, { replace: true });
      }
    }

    // Check for password change requirements for authenticated admin users
    if (isAuthenticated && user && token) {
      const currentPath = location.pathname;
      const allowedRoutes = [`${ADMIN_BASE_PATH}/login`, `${ADMIN_BASE_PATH}/change-password`, `${ADMIN_BASE_PATH}/transaction-password`];
      const isAllowedRoute = allowedRoutes.includes(currentPath);
      
      // Special protection for transaction password success page
      if (currentPath === `${ADMIN_BASE_PATH}/transaction-password`) {
        // If tr_password === 1, redirect to admin dashboard (transaction password already set)
        if (user.tr_password === 1) {
          navigate(ADMIN_BASE_PATH, { replace: true });
          return;
        }
        // If change_transaction_password === 0, redirect to admin dashboard (already completed)
        if (user.change_transaction_password === 0) {
          navigate(ADMIN_BASE_PATH, { replace: true });
          return;
        }
      }
      
      // Check if password change is needed
      if (user.change_password === 1 && !isAllowedRoute) {
        if (currentPath !== `${ADMIN_BASE_PATH}/change-password`) {
          navigate(`${ADMIN_BASE_PATH}/change-password`, { replace: true });
        }
      }
      // Check if transaction password change is needed (only after regular password is changed)
      else if (user.change_password === 0 && user.change_transaction_password === 1 && !isAllowedRoute) {
        if (currentPath !== `${ADMIN_BASE_PATH}/transaction-password`) {
          navigate(`${ADMIN_BASE_PATH}/transaction-password`, { replace: true });
        }
      }
      // If both password changes are needed, prioritize regular password first
      else if (user.change_password === 1 && user.change_transaction_password === 1 && !isAllowedRoute) {
        if (currentPath !== `${ADMIN_BASE_PATH}/change-password`) {
          navigate(`${ADMIN_BASE_PATH}/change-password`, { replace: true });
        }
      }
    }
  }, [isAuthenticated, token, loading, location.pathname, navigate, user]);

  // Don't render children if not authenticated and not on login page
  if (!loading && !isAuthenticated && !location.pathname.includes(`${ADMIN_BASE_PATH}/login`)) {
    return null;
  }

  if(!user){
    return children;
  }
  // If no specific permission required, allow access
  if (!requiredPermission || user.role !== 6) {
    return children;
  }

  // Check if user has the required permission
  if (!hasPermission(user, requiredPermission)) {
    // Find the first page the user has permission for
    const userPermissions = user?.permissions || [];
    
    // Define permission to route mapping
    const permissionRoutes = {
      'client-list': `${ADMIN_BASE_PATH}/users`,
      'market-analysis': `${ADMIN_BASE_PATH}/dashboard`,
      'casino': `${ADMIN_BASE_PATH}/casinos`,
      'virtual': `${ADMIN_BASE_PATH}/casinos`,
      'casino-market': `${ADMIN_BASE_PATH}/settings/casino-market`,
      'account-statement': `${ADMIN_BASE_PATH}/reports/account-statement`,
      'client-p-l': `${ADMIN_BASE_PATH}/reports/client-profit-loss`,
      'sport-p-l': `${ADMIN_BASE_PATH}/reports/sport-profit-loss`,
      'profit-loss': `${ADMIN_BASE_PATH}/reports/profit-loss`,
      'match-p-l': `${ADMIN_BASE_PATH}/reports/match-pl`,
      'current-bet': `${ADMIN_BASE_PATH}/reports/current-bet`,
      'bet-history': `${ADMIN_BASE_PATH}/reports/bet-history`,
      'deleted-bet-history': `${ADMIN_BASE_PATH}/reports/deleted-bet-history`,
      'casino-result': `${ADMIN_BASE_PATH}/reports/casino-result`,
      'line-market-bet-history': `${ADMIN_BASE_PATH}/reports/line-market-bet-history`,
      'sports-market': `${ADMIN_BASE_PATH}/settings/sports-market`,
      'setting-casino-market': `${ADMIN_BASE_PATH}/settings/casino-market`,
      'match-history': `${ADMIN_BASE_PATH}/settings/match-history`,
      'manage-fancy': `${ADMIN_BASE_PATH}/settings/manage-fancy`,
      'fancy-history': `${ADMIN_BASE_PATH}/settings/fancy-history`,
      'site-configuration': `${ADMIN_BASE_PATH}/settings/site-configuration`,
      'manage-privilege': `${ADMIN_BASE_PATH}/settings/multi-login`,
      'manage-prefix': `${ADMIN_BASE_PATH}/settings/manage-prefix`,
      'block-market': `${ADMIN_BASE_PATH}/settings/block-market`,
      'client-tack': `${ADMIN_BASE_PATH}/settings/client-tack`,
      'banner-manager': `${ADMIN_BASE_PATH}/settings/banner-manager`,
      'block-ip': `${ADMIN_BASE_PATH}/settings/block-ip`
    };
    
    // Find the first permission the user has and redirect to that page
    for (const permission of userPermissions) {
      if (permissionRoutes[permission]) {
        return <Navigate to={permissionRoutes[permission]} replace />;
      }
    }
    
    // If no specific permission found, redirect to unauthorized
    return <Navigate to={`${ADMIN_BASE_PATH}/unauthorized`} replace />;
  }

  return children;
};

export default AdminRouteGuard;
