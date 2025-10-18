import { useLocation } from 'react-router-dom';
import UserRouteChangeListener from './UserRouteChangeListener';
import AdminRouteChangeListener from './AdminRouteChangeListener';
import { useIsAdmin } from '../hooks/useIsAdmin'; 
const RouteChangeListener = () => {
  const location = useLocation();
  const isAdmin = useIsAdmin();
  // Detect if we're in admin routes
  const isAdminRoute = isAdmin;

  // Conditionally render the appropriate listener based on the route
  if (isAdminRoute) {
    return <AdminRouteChangeListener />;
  } else {
    return <UserRouteChangeListener />;
  }
};

export default RouteChangeListener;
