import { useLocation } from 'react-router-dom';
import { ADMIN_BASE_PATH } from '../utils/Constants';
import UserRouteChangeListener from './UserRouteChangeListener';
import AdminRouteChangeListener from './AdminRouteChangeListener';

const RouteChangeListener = () => {
  const location = useLocation();

  // Detect if we're in admin routes
  const isAdminRoute = location.pathname.toLowerCase().startsWith(ADMIN_BASE_PATH);

  // Conditionally render the appropriate listener based on the route
  if (isAdminRoute) {
    return <AdminRouteChangeListener />;
  } else {
    return <UserRouteChangeListener />;
  }
};

export default RouteChangeListener;
