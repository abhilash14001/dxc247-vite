import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAdminTheme, resetAdminTheme } from '../../store/slices/commonDataSlice';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Default theme values for admin
const defaultAdminTheme = {
  primary: '#A26C6C',
  secondary: '#A26C6C',
  gradient: {
    from: '#A26C6C',
    to: '#A26C6C'
  }
};

export const AdminThemeProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const themeAppliedRef = useRef(false);
  
  const { liveModeData, adminTheme: reduxAdminTheme } = useSelector(state => state.commonData);
  const theme = reduxAdminTheme;

  // Apply theme to document CSS variables
  const applyThemeToDocument = (themeData, force = false) => {
    if (!force && themeAppliedRef.current) {
      return;
    }
    
    const root = document.documentElement;
    
    
    // Admin theme variables - use !important to override existing styles
    root.style.setProperty('--theme1-bg', themeData.primary, 'important');
    root.style.setProperty('--theme2-bg', themeData.secondary, 'important');
    root.style.setProperty('--bg-primary', themeData.primary, 'important');
    root.style.setProperty('--theme-gradient-from', themeData.gradient?.from || themeData.primary, 'important');
    root.style.setProperty('--theme-gradient-to', themeData.gradient?.to || themeData.secondary, 'important');
        
    themeAppliedRef.current = true;
  };

  // Load theme from liveModeData
  useEffect(() => {
    
    // Reset theme applied flag when liveModeData changes
    themeAppliedRef.current = false;
    
    if (!liveModeData) {
      // Apply default theme if no liveModeData
      applyThemeToDocument(theme, true);
      return;
    }

    // liveModeData is a single object, not an array
    const matchingDomain = liveModeData;
    
    if (matchingDomain) {
      // Admin theme from liveModeData
      const newTheme = {
        primary: matchingDomain.site_bg_color || defaultAdminTheme.primary,
        secondary: matchingDomain.site_menu_color || defaultAdminTheme.secondary,
        gradient: {
          from: matchingDomain.site_bg_color || defaultAdminTheme.primary,
          to: matchingDomain.site_menu_color || defaultAdminTheme.secondary
        }
      };

      // Update Redux state
      dispatch(setAdminTheme(newTheme));
      applyThemeToDocument(newTheme, true);
    } else {
      // Apply default theme if no matching domain
      applyThemeToDocument(theme, true);
    }
  }, [liveModeData, dispatch]); // Removed theme from dependencies to prevent infinite loop

  // Update theme function (for admin settings)
  const updateTheme = async (newThemeData) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would typically make an API call to update theme
      // For now, we'll just update the local state
      const updatedTheme = {
        primary: newThemeData.primary_color || theme.primary,
        secondary: newThemeData.secondary_color || theme.secondary,
        gradient: {
          from: newThemeData.gradient_from || newThemeData.primary_color || theme.gradient?.from || theme.primary,
          to: newThemeData.gradient_to || newThemeData.secondary_color || theme.gradient?.to || theme.secondary
        }
      };
      
      // Update Redux state
      dispatch(setAdminTheme(updatedTheme));
      applyThemeToDocument(updatedTheme, true);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating admin theme:', error);
      setError('Failed to update theme');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset to default theme
  const resetThemeHandler = () => {
    // Update Redux state
    dispatch(resetAdminTheme());
    applyThemeToDocument(defaultAdminTheme, true);
  };

  const value = {
    theme,
    loading,
    error,
    updateTheme,
    resetTheme: resetThemeHandler,
    applyThemeToDocument
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Admin Theme Wrapper (simplified - CSS now loaded in index.html)
export const AdminThemeWrapper = ({ children }) => {
  return (
    <AdminThemeProvider>
      {children}
    </AdminThemeProvider>
  );
};
