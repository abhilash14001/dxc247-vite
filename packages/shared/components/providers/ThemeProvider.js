import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserThemeProvider } from './UserThemeProvider';
import { AdminThemeWrapper } from './AdminThemeProvider';
import {useIsAdmin} from '../../hooks/useIsAdmin';
// Re-export the useTheme hook from UserThemeProvider for backward compatibility
export { useTheme } from './UserThemeProvider';

export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const isAdmin = useIsAdmin();
  // Detect if we're in admin routes
  const isAdminRoute = isAdmin;

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
