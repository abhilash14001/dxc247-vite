import React from 'react';
import { useLocation } from 'react-router-dom';
import { ADMIN_BASE_PATH } from '../../utils/Constants';
import { UserThemeProvider } from './UserThemeProvider';
import { AdminThemeWrapper } from './AdminThemeProvider';

// Re-export the useTheme hook from UserThemeProvider for backward compatibility
export { useTheme } from './UserThemeProvider';

export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  
  // Detect if we're in admin routes
  const isAdminRoute = location.pathname.toLowerCase().startsWith(ADMIN_BASE_PATH);

  // Conditionally render the appropriate provider based on the route
  if (isAdminRoute) {
    return <AdminThemeWrapper>{children}</AdminThemeWrapper>;
  } else {
    return <UserThemeProvider>{children}</UserThemeProvider>;
  }
};

// User Theme Wrapper (for backward compatibility)
export const UserThemeWrapper = ({ children }) => {
  return <UserThemeProvider>{children}</UserThemeProvider>;
};

export default ThemeProvider;
