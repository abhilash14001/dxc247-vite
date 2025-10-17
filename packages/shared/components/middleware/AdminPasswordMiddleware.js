import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  showPasswordModal, 
  hidePasswordModal, 
  setPassword, 
  clearError,
  verifyAdminPassword,
  checkVerificationExpiry,
  setDirectAccess,
  selectShowModal,
  selectPassword,
  selectLoading,
  selectError,
  selectPendingRoute,
  selectIsVerified
} from '../../store/admin/adminPasswordSlice';

const useAdminPasswordMiddleware = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const showPasswordModalState = useSelector(selectShowModal);
  const password = useSelector(selectPassword);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const pendingRoute = useSelector(selectPendingRoute);
  const isVerified = useSelector(selectIsVerified);

  const handlePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      dispatch(clearError());
      return;
    }
    
    const result = await dispatch(verifyAdminPassword(password));
    
    if (result.type === 'adminPassword/verifyPassword/fulfilled') {
      // Navigate to the pending route
      if (pendingRoute) {
        navigate(pendingRoute);
      }
    }
  }, [dispatch, password, navigate, pendingRoute]);

  const checkAccess = useCallback((adminUser, targetRoute) => {
    // Reset direct access state for menu clicks
    dispatch(setDirectAccess(false));
    
    // Check if already verified
    if (isVerified) {
      navigate(targetRoute);
      return;
    }
    
    // Check verification expiry
    dispatch(checkVerificationExpiry());
    
    // Show password modal only if not verified
    dispatch(showPasswordModal(targetRoute));
  }, [dispatch, navigate, isVerified]);

  // Check for direct URL access to settings routes
  const checkDirectAccess = useCallback((currentPath) => {
    if (currentPath.includes('/settings/') && !isVerified) {
      dispatch(checkVerificationExpiry());
      
    }
  }, [dispatch, isVerified]);

  const closeModal = useCallback(() => {
    dispatch(hidePasswordModal());
  }, [dispatch]);

  const handlePasswordChange = useCallback((value) => {
    dispatch(setPassword(value));
  }, [dispatch]);

  return {
    showPasswordModal: showPasswordModalState,
    password,
    setPassword: handlePasswordChange,
    loading,
    error,
    handlePasswordSubmit,
    checkAccess,
    checkDirectAccess,
    closeModal,
    clearError: () => {
      console.log('clearError called from middleware');
      dispatch(clearError());
    }
  };
};

export default useAdminPasswordMiddleware;

