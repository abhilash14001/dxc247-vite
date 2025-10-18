import React from 'react';

import { UserThemeProvider } from './UserThemeProvider';
import { AdminThemeProvider } from './AdminThemeProvider';
// Re-export the useTheme hook from UserThemeProvider for backward compatibility
export { useTheme } from './UserThemeProvider';

export const ThemeProvider = ({ children }) => {
  

  };

// User Theme Wrapper (for backward compatibility)
export const UserThemeWrapper = ({ children }) => {
  return <UserThemeProvider>{children}</UserThemeProvider>;
};
export const AdminThemeWrapper = ({ children }) => {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
};
export default ThemeProvider;
