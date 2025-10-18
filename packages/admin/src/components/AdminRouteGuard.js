import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission } from '@dxc247/shared/utils/permissionUtils';

const AdminRouteGuard = ({ children, requiredPermission }) => {
  const navigate = useNavigate();
  const { isAuthenticated, token, loading, user } = useSelector(state => state.admin);

  useEffect(() => {
    // Don't redirect if still loading
    if (loading) {
      return;
    }

    // Check if user is not authenticated
    if (!isAuthenticated || !token) {
      // Redirect to login if not authenticated
      navigate('/login', { replace: true });
      return;
    }

    // Check for password change requirements for authenticated admin users
    if (isAuthenticated && user && token) {
      // Check if password change is needed
      if (user.change_password === 1) {
        navigate('/change-password', { replace: true });
        return;
      }
      // Check if transaction password change is needed (only after regular password is changed)
      else if (user.change_password === 0 && user.change_transaction_password === 1) {
        navigate('/transaction-password', { replace: true });
        return;
      }
      // If both password changes are needed, prioritize regular password first
      else if (user.change_password === 1 && user.change_transaction_password === 1) {
        navigate('/change-password', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, token, loading, navigate, user]);

  // Don't render children if not authenticated
  if (!loading && !isAuthenticated) {
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
      'client-list': '/users',
      'market-analysis': '/dashboard',
      'casino': '/casinos',
      'virtual': '/casinos',
      'casino-market': '/settings/casino-market',
      'account-statement': '/reports/account-statement',
      'client-p-l': '/reports/client-profit-loss',
      'sport-p-l': '/reports/sport-profit-loss',
      'profit-loss': '/reports/profit-loss',
      'match-p-l': '/reports/match-pl',
      'current-bet': '/reports/current-bet',
      'bet-history': '/reports/bet-history',
      'deleted-bet-history': '/reports/deleted-bet-history',
      'casino-result': '/reports/casino-result',
      'line-market-bet-history': '/reports/line-market-bet-history',
      'sports-market': '/settings/sports-market',
      'setting-casino-market': '/settings/casino-market',
      'match-history': '/settings/match-history',
      'manage-fancy': '/settings/manage-fancy',
      'fancy-history': '/settings/fancy-history',
      'site-configuration': '/settings/site-configuration',
      'manage-privilege': '/settings/multi-login',
      'manage-prefix': '/settings/manage-prefix',
      'block-market': '/settings/block-market',
      'client-tack': '/settings/client-tack',
      'banner-manager': '/settings/banner-manager',
      'block-ip': '/settings/block-ip'
    };
    
    // Find the first permission the user has and redirect to that page
    for (const permission of userPermissions) {
      if (permissionRoutes[permission]) {
        return <Navigate to={permissionRoutes[permission]} replace />;
      }
    }
    
    // If no specific permission found, redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRouteGuard;
