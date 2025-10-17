import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Simple URL Blocking Middleware
 * Blocks URLs containing blocked sports or casino games
 */
const BlockUrlMiddleware = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const commonData = useSelector(state => state.commonData?.data);
  
  const blockedSports = commonData?.blocked_sports || [];
  const blockedCasinos = commonData?.blocked_casinos || [];

  useEffect(() => {
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
  }, [location, blockedSports, blockedCasinos, navigate]);

  return children;
};

export default BlockUrlMiddleware;
