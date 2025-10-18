import { loginSuccess as adminLoginSuccess, setPasswordChanged as adminSetPasswordChanged, setTransactionPasswordChanged as adminSetTransactionPasswordChanged } from "../admin/adminSlice";
import { navigate } from "../slices/navigationSlice";

const adminPasswordChangeMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only handle admin-specific actions to prevent infinite loops
  const handledActions = [
    adminLoginSuccess.type,
    adminSetPasswordChanged.type,
    adminSetTransactionPasswordChanged.type
  ];

  if (!handledActions.includes(action.type)) {
    return result;
  }

  // Handle admin login success - check for password change requirements
  if (action.type === adminLoginSuccess.type) {
    const state = store.getState();
    const adminState = state.admin;
    
    if (adminState.isAuthenticated && adminState.user) {
      // Check if admin needs to change password
      if (adminState.user.change_password === 1) {
        store.dispatch(navigate('/change-password'));
        return result;
      }
      // Check if admin needs to change transaction password
      else if (adminState.user.change_transaction_password === 1) {
        store.dispatch(navigate('/transaction-password'));
        return result;
      }
    }
  }

  // Handle admin password change completion actions
  if (action.type === adminSetPasswordChanged.type) {
    const state = store.getState();
    const adminState = state.admin;
    
    if (adminState.isAuthenticated && adminState.user) {
      // Check if transaction password change is needed
      if (adminState.user.change_transaction_password === 1) {
        store.dispatch(navigate('/transaction-password'));
        return result;
      } else {
        // Both passwords are changed, redirect to admin dashboard
        store.dispatch(navigate('/'));
        return result;
      }
    }
  }

  // Handle admin transaction password change completion actions
  if (action.type === adminSetTransactionPasswordChanged.type) {
    const state = store.getState();
    const adminState = state.admin;
    
    if (adminState.isAuthenticated) {
      // Admin transaction password changed, redirect to admin dashboard
      store.dispatch(navigate('/'));
      return result;
    }
  }

  return result;
};

export default adminPasswordChangeMiddleware;
