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
  
  // Get admin user to check if superadmin
  const { user: adminUser } = useSelector(state => state.admin);
  const isSuperAdmin = adminUser?.role === 1;
  
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
    // Only apply password middleware to superadmin (role === 1)
    // For non-superadmin users, navigate directly without password check
    if (!isSuperAdmin) {
      navigate(targetRoute);
      return;
    }
    
    // Reset direct access state for menu clicks
    dispatch(setDirectAccess(false));
    
    // Check if already verified
    if (isVerified) {
      navigate(targetRoute);
      return;
    }
    
    // Check verification expiry
    dispatch(checkVerificationExpiry());
    
    // Show password modal only if not verified (superadmin only)
    dispatch(showPasswordModal(targetRoute));
  }, [dispatch, navigate, isVerified, isSuperAdmin]);

  // Check for direct URL access to settings routes (superadmin only)
  const checkDirectAccess = useCallback((currentPath) => {
    // Only check for superadmin users
    if (!isSuperAdmin) {
      return;
    }
    
    if (currentPath.includes('/settings/') && !isVerified) {
      dispatch(checkVerificationExpiry());
      
    }
  }, [dispatch, isVerified, isSuperAdmin]);

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
      dispatch(clearError());
    }
  };
};

export default useAdminPasswordMiddleware;

