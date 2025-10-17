import { loginSuccess, setPasswordChanged, setTransactionPasswordChanged } from "../slices/userSlice";
import { navigate } from "../slices/navigationSlice";

const userPasswordChangeMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only handle user-specific actions to prevent infinite loops
  const handledActions = [
    loginSuccess.type,
    setPasswordChanged.type,
    setTransactionPasswordChanged.type
  ];

  if (!handledActions.includes(action.type)) {
    return result;
  }

  // Handle user login success - check for password change requirements
  if (action.type === loginSuccess.type) {
    const state = store.getState();
    const userState = state.user;
    
    if (userState.isAuthenticated && userState.user) {
      // Check if user needs to change password
      if (userState.user.ch_pas === 1) {
        store.dispatch(navigate('/change-password'));
        return result;
      }
      // Check if user needs to change transaction password
      else if (userState.user.isTrPassChange === 1) {
        store.dispatch(navigate('/transaction-password'));
        return result;
      }
    }
  }

  // Handle user password change completion actions
  if (action.type === setPasswordChanged.type) {
    const state = store.getState();
    const userState = state.user;
    
    if (userState.isAuthenticated) {
      // Check if transaction password change is needed
      if (userState.user.isTrPassChange === 1) {
        // Dispatch navigation action to transaction password page
        store.dispatch(navigate('/transaction-password'));
        return result;
      } else {
        // Both passwords are changed, redirect to home
        store.dispatch(navigate('/'));
        return result;
      }
    }
  }

  // Handle user transaction password change completion actions
  if (action.type === setTransactionPasswordChanged.type) {
    const state = store.getState();
    const userState = state.user;
    
    if (userState.isAuthenticated) {
      // Transaction password changed, redirect to home
      store.dispatch(navigate('/'));
      return result;
    }
  }

  return result;
};

export default userPasswordChangeMiddleware;
