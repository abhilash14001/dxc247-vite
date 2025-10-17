import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LiveModeGuard = ({ children }) => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [inspectRedirectUrl, setInspectRedirectUrl] = useState('');
  const location = useLocation();

  // Get live mode data from Redux store
  const liveModeData = useSelector((state) => state.commonData.liveModeData);
  const currentDomain = window.location.hostname;

  useEffect(() => {
    // Check if current domain has live mode enabled from Redux store
    if (liveModeData) {
      const matchingDomain = liveModeData
      
      if (matchingDomain) {
        setIsLiveMode(matchingDomain.side_live_mode === 1);
        setInspectRedirectUrl(matchingDomain.user_inspect_redirect || '');
      }
    }
  }, [liveModeData, currentDomain]);

  useEffect(() => {
    if (!isLiveMode || !inspectRedirectUrl) return;

    let detectionIntervals = [];
    let isRedirecting = false;
    let warningCount = 0;
    const maxWarnings = 3; // Allow 3 warnings before redirect

    // Method 1: Window size detection (most reliable)
    const windowSizeDetection = () => {
      const threshold = 160;
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthDiff = window.outerWidth - window.innerWidth;
      
      if (heightDiff > threshold || widthDiff > threshold) {
        warningCount++;
        if (warningCount >= maxWarnings && !isRedirecting) {
          isRedirecting = true;
          window.location.href = inspectRedirectUrl;
        }
      }
    };

    // Method 2: Console detection
    const consoleDetection = () => {
      let devtools = false;
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: function() {
          devtools = true;
          warningCount++;
          if (warningCount >= maxWarnings && !isRedirecting) {
            isRedirecting = true;
            window.location.href = inspectRedirectUrl;
          }
        }
      });
      console.log(element);
      console.clear();
    };

    // Method 3: Debugger detection
    const debuggerDetection = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        warningCount++;
        if (warningCount >= maxWarnings && !isRedirecting) {
          isRedirecting = true;
          window.location.href = inspectRedirectUrl;
        }
      }
    };

    // Start all detection methods
    detectionIntervals.push(setInterval(windowSizeDetection, 100));
    detectionIntervals.push(setInterval(consoleDetection, 500));
    detectionIntervals.push(setInterval(debuggerDetection, 1000));

    // Cleanup
    return () => {
      detectionIntervals.forEach(interval => clearInterval(interval));
    };
  }, [isLiveMode, inspectRedirectUrl]);

  // Additional protection methods
  useEffect(() => {
    if (!isLiveMode || !inspectRedirectUrl) return;

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
        return false;
      }

      // Only block Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Only block Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Only block Ctrl+Shift+C (Element selector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Only block Ctrl+U (View source)
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        e.stopPropagation();
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
  }, [isLiveMode, inspectRedirectUrl]);

  // Blur detection (when user switches tabs)
  useEffect(() => {
    if (!isLiveMode || !inspectRedirectUrl) return;

    let startTime = Date.now();
    let isRedirecting = false;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        startTime = Date.now();
      } else {
        const timeDiff = Date.now() - startTime;
        // If user was away for more than 5 seconds, redirect
        if (timeDiff > 5000 && !isRedirecting) {
          isRedirecting = true;
          window.location.href = inspectRedirectUrl;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLiveMode, inspectRedirectUrl]);

  return children;
};

export default LiveModeGuard;