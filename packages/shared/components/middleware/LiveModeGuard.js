import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { axiosFetch } from '../../utils/Constants';
import { logout as userLogout } from '../../store/slices/userSlice';
import { resetCommonDataState } from '../../store/slices/commonDataSlice';

const LiveModeGuard = ({ children }) => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [inspectRedirectUrl, setInspectRedirectUrl] = useState('');
  const location = useLocation();
  const ipBlockedRef = useRef(false); // Track if IP has been blocked to avoid multiple calls
  const dispatch = useDispatch();

  // Get live mode data from Redux store
  const liveModeData = useSelector((state) => state.commonData.liveModeData);
  const currentDomain = window.location.hostname;

  // Function to handle inspection detection and block IP
  const handleInspectionDetected = useCallback(async () => {
    if (ipBlockedRef.current) return; // Already processed

    // Function to get user's IP address
    const getUserIP = async () => {
      try {
        // Try to get IP from a simple service
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('Error fetching IP:', error);
        // Fallback: try alternative service
        try {
          const response = await fetch('https://api64.ipify.org?format=json');
          const data = await response.json();
          return data.ip;
        } catch (fallbackError) {
          console.error('Error fetching IP from fallback service:', fallbackError);
          return null;
        }
      }
    };

    // Function to block IP via API and logout user
    const blockUserIP = async (ipAddress) => {
      if (!ipAddress || ipBlockedRef.current) {
        return; // Skip if no IP or already blocked
      }

      try {
        ipBlockedRef.current = true; // Mark as blocked to prevent duplicate calls
        const response = await axiosFetch('block-ip', 'POST', null, { ip: ipAddress });
        
        if (response && response.success) {
          console.log('IP blocked successfully:', ipAddress);
          
          // Logout user after IP is blocked
          try {
            // Call logout API
            await axiosFetch('logout', 'POST');
            
            // Clear Redux state
            dispatch(resetCommonDataState());
            dispatch(userLogout());
            
            // Clear localStorage
            localStorage.clear();
            
            // Redirect to login page
            window.location.href = '/login';
          } catch (logoutError) {
            console.error('Error during logout:', logoutError);
            // Even if logout fails, still redirect to login
            window.location.href = '/login';
          }
        } else {
          console.warn('Failed to block IP:', response?.message || 'Unknown error');
          // Still logout even if IP blocking fails
          try {
            await axiosFetch('logout', 'POST');
            dispatch(resetCommonDataState());
            dispatch(userLogout());
            localStorage.clear();
            window.location.href = '/login';
          } catch (logoutError) {
            console.error('Error during logout:', logoutError);
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error blocking IP:', error);
        // Logout even if IP blocking API fails
        try {
          await axiosFetch('logout', 'POST');
          dispatch(resetCommonDataState());
          dispatch(userLogout());
          localStorage.clear();
          window.location.href = '/login';
        } catch (logoutError) {
          console.error('Error during logout:', logoutError);
          window.location.href = '/login';
        }
      }
    };

    // Get user's IP and block it
    const userIP = await getUserIP();
    if (userIP) {
      // Block IP and logout (wait for it to complete)
      await blockUserIP(userIP);
    } else {
      // Even if IP fetch fails, still logout
      try {
        await axiosFetch('logout', 'POST');
        dispatch(resetCommonDataState());
        dispatch(userLogout());
        localStorage.clear();
        window.location.href = '/login';
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
        window.location.href = '/login';
      }
    }
  }, [dispatch]);

  useEffect(() => {
    // Check if current domain has live mode enabled from Redux store
    if (liveModeData) {
      // liveModeData is a single object (not an array) based on how it's used in UserThemeProvider
      const matchingDomain = liveModeData;
      
      if (matchingDomain) {
        setIsLiveMode(matchingDomain.side_live_mode === 1);
        setInspectRedirectUrl(matchingDomain.user_inspect_redirect || '');
      }
    }
  }, [liveModeData, currentDomain]);

  useEffect(() => {
    if (!isLiveMode) return;

    let detectionIntervals = [];
    let isRedirecting = false;
    let consecutiveDetections = 0;
    const requiredConsecutiveDetections = 3; // Require 3 consecutive detections to avoid false positives
    let lastWindowSize = { outerHeight: window.outerHeight, outerWidth: window.outerWidth, innerHeight: window.innerHeight, innerWidth: window.innerWidth };

    // Method 1: Window size detection - Only for devtools (more specific)
    const windowSizeDetection = () => {
      const threshold = 160; // Devtools typically add at least 160px
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthDiff = window.outerWidth - window.innerWidth;
      
      // Check if window size changed significantly (devtools opened)
      const sizeChanged = 
        Math.abs(window.outerHeight - lastWindowSize.outerHeight) > 50 ||
        Math.abs(window.outerWidth - lastWindowSize.outerWidth) > 50 ||
        Math.abs(window.innerHeight - lastWindowSize.innerHeight) > 50 ||
        Math.abs(window.innerWidth - lastWindowSize.innerWidth) > 50;
      
      // Only trigger if size difference indicates devtools AND size actually changed
      if ((heightDiff > threshold || widthDiff > threshold) && sizeChanged) {
        consecutiveDetections++;
        lastWindowSize = {
          outerHeight: window.outerHeight,
          outerWidth: window.outerWidth,
          innerHeight: window.innerHeight,
          innerWidth: window.innerWidth
        };
        
        if (consecutiveDetections >= requiredConsecutiveDetections && !isRedirecting) {
          isRedirecting = true;
          handleInspectionDetected();
        }
      } else {
        // Reset counter if no devtools detected
        consecutiveDetections = 0;
        lastWindowSize = {
          outerHeight: window.outerHeight,
          outerWidth: window.outerWidth,
          innerHeight: window.innerHeight,
          innerWidth: window.innerWidth
        };
      }
    };

    // Method 2: Console detection - Specific to devtools
    const consoleDetection = () => {
      let devtools = false;
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: function() {
          devtools = true;
          consecutiveDetections++;
          if (consecutiveDetections >= requiredConsecutiveDetections && !isRedirecting) {
            isRedirecting = true;
            handleInspectionDetected();
          }
        }
      });
      console.clear();
      
      // Reset if no devtools detected
      if (!devtools) {
        consecutiveDetections = Math.max(0, consecutiveDetections - 1);
      }
    };

    // Method 3: Debugger detection - Specific to devtools
    const debuggerDetection = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        consecutiveDetections++;
        if (consecutiveDetections >= requiredConsecutiveDetections && !isRedirecting) {
          isRedirecting = true;
          handleInspectionDetected();
        }
      } else {
        consecutiveDetections = Math.max(0, consecutiveDetections - 1);
      }
    };

    // Start all detection methods
    detectionIntervals.push(setInterval(windowSizeDetection, 200)); // Slower check to avoid false positives
    detectionIntervals.push(setInterval(consoleDetection, 500));
    detectionIntervals.push(setInterval(debuggerDetection, 1000));

    // Cleanup
    return () => {
      detectionIntervals.forEach(interval => clearInterval(interval));
    };
  }, [isLiveMode, handleInspectionDetected]);

  // Additional protection methods - Keyboard shortcuts for devtools
  useEffect(() => {
    if (!isLiveMode) return;

    let isRedirecting = false;

    // Disable right-click context menu
    const disableContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable only developer tools shortcuts
    const disableKeyboardShortcuts = (e) => {
      // Only block F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        handleInspectionDetected();
        return false;
      }

      // Only block Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        e.stopPropagation();
        handleInspectionDetected();
        return false;
      }

      // Only block Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        e.stopPropagation();
        handleInspectionDetected();
        return false;
      }

      // Only block Ctrl+Shift+C (Element selector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        e.stopPropagation();
        handleInspectionDetected();
        return false;
      }

      // Only block Ctrl+U (View source)
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        e.stopPropagation();
        handleInspectionDetected();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableKeyboardShortcuts);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
    };
  }, [isLiveMode, handleInspectionDetected]);

  return children;
};

export default LiveModeGuard;