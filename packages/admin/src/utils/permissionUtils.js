/**
 * Check if user has a specific role
 * @param {Object} user - User object from Redux state
 * @param {string} role - Role to check
 * @returns {boolean} - True if user has role, false otherwise
 */
export const hasRole = (user, role) => {
  return user?.roles?.includes(role) || false;
};

/**
 * Permission check function with role-based access control
 * @param {Object} user - User object from Redux state
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission, false otherwise
 */
export const hasPermission = (user, permission) => {
  // If user doesn't have agent role, allow full access (no restrictions)
  if (!hasRole(user, 'agent')) {
    return true;
  }
  
  // If user has agent role, check for specific permission
  return user?.permissions?.includes(permission) || false;
};
