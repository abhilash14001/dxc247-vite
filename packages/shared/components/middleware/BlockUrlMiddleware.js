import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Simple URL Blocking Middleware
 * Blocks URLs containing blocked sports or casino games
 * This middleware depends on common_detail_data API which is fetched on every login
 */
const BlockUrlMiddleware = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const commonData = useSelector(state => state.commonData?.data);
  
  // Memoize blocked arrays to prevent unnecessary re-renders
  // These come from common_detail_data API response
  // Use JSON.stringify to properly detect array changes
  const blockedSports = useMemo(() => {
    const sports = commonData?.blocked_sports || [];
    return Array.isArray(sports) ? sports : [];
  }, [commonData?.blocked_sports ? JSON.stringify(commonData.blocked_sports) : null]);
  
  const blockedCasinos = useMemo(() => {
    const casinos = commonData?.blocked_casinos || [];
    return Array.isArray(casinos) ? casinos : [];
  }, [commonData?.blocked_casinos ? JSON.stringify(commonData.blocked_casinos) : null]);

  useEffect(() => {
    // Only check if we have commonData (data is loaded)
    if (!commonData) {
      return;
    }
    
    const currentUrl = (location.pathname + location.search).toLowerCase();
    
    // Check for blocked sports
    for (const sport of blockedSports) {
      if (currentUrl.includes(sport.toLowerCase())) {
        console.warn(`Blocked: ${sport} not allowed`);
        navigate('/');
        return;
      }
    }
    
    // Check for blocked casinos
    for (const casino of blockedCasinos) {
      if (currentUrl.includes(casino.toLowerCase())) {
        console.warn(`Blocked: ${casino} not allowed`);
        navigate('/');
        return;
      }
    }
  }, [location, blockedSports, blockedCasinos, navigate, commonData]);

  return children;
};

export default BlockUrlMiddleware;
