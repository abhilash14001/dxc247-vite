import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsVerified, 
  selectShowModal, 
  selectPassword, 
  selectLoading, 
  selectError,
  selectVerificationTime,
  selectIsDirectAccess,
  showPasswordModal,
  hidePasswordModal,
  setPassword,
  clearError,
  verifyAdminPassword,
  checkVerificationExpiry,
  clearVerification,
  setDirectAccess
} from '../../store/admin/adminPasswordSlice';
import AdminPasswordModal from '../ui/AdminPasswordModal';
import useAdminPasswordMiddleware from '../middleware/AdminPasswordMiddleware';

const withAdminPasswordProtection = (WrappedComponent) => {
  return function AdminPasswordProtectedComponent(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const isVerified = useSelector(selectIsVerified);
    const showPasswordModalState = useSelector(selectShowModal);
    const password = useSelector(selectPassword);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const verificationTime = useSelector(selectVerificationTime);
    const isDirectAccess = useSelector(selectIsDirectAccess);
    
    const { user: adminUser } = useSelector(state => state.admin);

    // Check if current route is a settings route that needs protection
    const isSettingsRoute = location.pathname.includes('/settings/');

    useEffect(() => {
      if (!isSettingsRoute) {
        return;
      }

      // Mark as direct access and check verification
      dispatch(setDirectAccess(true));
      dispatch(checkVerificationExpiry());
    }, [isSettingsRoute, dispatch]);

    const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      if (!password.trim()) {
        dispatch(clearError());
        return;
      }
      
      const result = await dispatch(verifyAdminPassword(password));
      
      if (result.type === 'adminPassword/verifyPassword/fulfilled') {
        // Reset direct access state on successful verification
        dispatch(setDirectAccess(false));
        // Verification successful, component will re-render and show content
      }
    };

    const closeModal = () => {
      dispatch(hidePasswordModal());
      dispatch(setDirectAccess(false));
      // Redirect back to admin dashboard if user cancels
      navigate('/admin');
    };

    const handlePasswordChange = (value) => {
      dispatch(setPassword(value));
    };

    // Show password modal if not verified and on settings route
    if (isSettingsRoute && !isVerified) {
      // Show modal for direct access
      if (isDirectAccess) {
        return (
          <>
            <AdminPasswordModal
              show={true}
              password={password}
              setPassword={handlePasswordChange}
              loading={loading}
              error={error}
              onSubmit={handlePasswordSubmit}
              onClose={closeModal}
              onClearError={() => {
                dispatch(clearError());
              }}
            />
          </>
        );
      }
      // For menu clicks, show modal only if explicitly shown
      else if (showPasswordModalState) {
        return (
          <>
            <AdminPasswordModal
              show={showPasswordModalState}
              password={password}
              setPassword={handlePasswordChange}
              loading={loading}
              error={error}
              onSubmit={handlePasswordSubmit}
              onClose={closeModal}
              onClearError={() => {
                dispatch(clearError());
              }}
            />
          </>
        );
      }
    }

    // Render the protected component only if verified
    return <WrappedComponent {...props} />;
  };
};

export default withAdminPasswordProtection;
