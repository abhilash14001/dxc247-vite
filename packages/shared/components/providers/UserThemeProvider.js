import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, resetTheme } from '../../store/slices/commonDataSlice';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Default theme values for user
const defaultUserTheme = {
  primary: '#0383C4',
  primary90: '#0383C4E6',
  primary65: '#0383C4A5',
  textPrimary: '#FFFFFF',
  secondary: '#000000',
  secondary70: '#000000B3',
  secondary85: '#000000D9',
  textSecondary: '#FFFFFF',
  news: ''
};

export const UserThemeProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const themeAppliedRef = useRef(false);
  
  const { liveModeData, theme: reduxTheme } = useSelector(state => state.commonData);
  const theme = reduxTheme;

  // Apply theme to document CSS variables
  const applyThemeToDocument = (themeData, force = false) => {
    if (!force && themeAppliedRef.current) {
      return;
    }
    
    const root = document.documentElement;
    
    
    // User theme variables
    root.style.setProperty('--bg-primary', themeData.primary);
    root.style.setProperty('--bg-primary90', themeData.primary90);
    root.style.setProperty('--bg-primary65', themeData.primary65);
    root.style.setProperty('--text-primary', themeData.textPrimary);
    root.style.setProperty('--bg-secondary', themeData.secondary);
    root.style.setProperty('--bg-secondary70', themeData.secondary70);
    root.style.setProperty('--bg-secondary85', themeData.secondary85);
    root.style.setProperty('--text-secondary', themeData.textSecondary);
    root.style.setProperty('--bg-news', themeData.news);
        
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
      // User theme from liveModeData
      const newTheme = {
        primary: matchingDomain.site_bg_color || defaultUserTheme.primary,
        primary90: matchingDomain.site_bg_color ? `${matchingDomain.site_bg_color}E6` : defaultUserTheme.primary90,
        primary65: matchingDomain.site_bg_color ? `${matchingDomain.site_bg_color}A5` : defaultUserTheme.primary65,
        textPrimary: '#FFFFFF', // Default white text for primary
        secondary: matchingDomain.site_menu_color || defaultUserTheme.secondary,
        secondary70: matchingDomain.site_menu_color ? `${matchingDomain.site_menu_color}B3` : defaultUserTheme.secondary70,
        secondary85: matchingDomain.site_menu_color ? `${matchingDomain.site_menu_color}D9` : defaultUserTheme.secondary85,
        textSecondary: '#FFFFFF', // Default white text for secondary
        news: '' // No news color field in the API
      };

      // Update Redux state
      dispatch(setTheme(newTheme));
      applyThemeToDocument(newTheme, true);
    } else {
      // Apply default theme if no matching domain
      applyThemeToDocument(theme, true);
    }
  }, [liveModeData, dispatch]); // Removed theme from dependencies to prevent infinite loop

  // Update theme function (for user settings)
  const updateTheme = async (newThemeData) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would typically make an API call to update theme
      // For now, we'll just update the local state
      const updatedTheme = {
        primary: newThemeData.primary_color || theme.primary,
        primary90: newThemeData.primary_color ? `${newThemeData.primary_color}E6` : theme.primary90,
        primary65: newThemeData.primary_color ? `${newThemeData.primary_color}A5` : theme.primary65,
        textPrimary: theme.textPrimary,
        secondary: newThemeData.secondary_color || theme.secondary,
        secondary70: newThemeData.secondary_color ? `${newThemeData.secondary_color}B3` : theme.secondary70,
        secondary85: newThemeData.secondary_color ? `${newThemeData.secondary_color}D9` : theme.secondary85,
        textSecondary: theme.textSecondary,
        news: theme.news
      };
      
      // Update Redux state
      dispatch(setTheme(updatedTheme));
      applyThemeToDocument(updatedTheme, true);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user theme:', error);
      setError('Failed to update theme');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset to default theme
  const resetThemeHandler = () => {
    // Update Redux state
    dispatch(resetTheme());
    applyThemeToDocument(defaultUserTheme, true);
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
