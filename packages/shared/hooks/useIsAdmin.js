import { useSelector } from 'react-redux';

/**
 * Custom hook for consistent admin detection
 * Uses current route path AND admin authentication status
 * @returns {boolean} true if current route is an admin route AND user is authenticated as admin
 */
export const useIsAdmin = () =>
  useSelector((state) => state.admin?.isAdmin || false);
