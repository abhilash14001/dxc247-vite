import { logout as adminLogout } from "../admin/adminSlice";

const tokenExpirationMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();
  const token = state.admin?.token;
  const isAdmin = state.admin?.isAdmin;
  const expiration = parseInt(state.admin?.tokenExpiresAt);

  // Only handle admin token expiration if we're on an admin route
  if (token && expiration && isAdmin) {
    const now = Date.now();
    
    if (now >= expiration) {
      // expired → logout immediately
      store.dispatch(adminLogout());
      
      window.location.href = '/login';    
    } else {
      // still valid → only set timer if not already set or if token changed
      const remainingTime = expiration - now;
      
      // Only set up timer if:
      // 1. No timer exists, OR
      // 2. Token has changed (login/logout), OR  
      // 3. This is a login action
      const shouldSetupTimer = !window.__logoutTimer || 
                               action.type === 'admin/loginSuccess' ||
                               action.type === 'admin/logout';

      if (shouldSetupTimer) {
        // Clear existing timer
        if (window.__logoutTimer) {
          clearTimeout(window.__logoutTimer);
        }

        // Set new timer only if remaining time is positive
        if (remainingTime > 0) {
          window.__logoutTimer = setTimeout(() => {
            store.dispatch(adminLogout());
            window.location.href = '/login';    
          }, remainingTime);
        }
      }
    }
  } else {
    // Not on admin route or no token - clear any existing timer
    if (window.__logoutTimer) {
      clearTimeout(window.__logoutTimer);
      window.__logoutTimer = null;
    }
  }

  return result;
};

export default tokenExpirationMiddleware;
