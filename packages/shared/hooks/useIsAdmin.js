import { useSelector } from 'react-redux';
import { ADMIN_BASE_PATH } from '../utils/Constants';
/**
 * Custom hook for consistent admin detection
 * Uses current route path AND admin authentication status
 * @returns {boolean} true if current route is an admin route AND user is authenticated as admin
 */
export const useIsAdmin = () =>
  useSelector((state) => state.admin?.isAdmin && window.location.pathname.includes(ADMIN_BASE_PATH) || false);
