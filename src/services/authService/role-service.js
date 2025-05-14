/**
 * User role management
 */
import { getCurrentUser } from './user-service';

/**
 * Check if current user is an admin
 * @returns {boolean} Admin status
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  // Check for different possible role formats
  return (
    user &&
    (user.role === "ADMIN" ||
      user.role === "admin" ||
      user.role === "Administrator")
  );
};

/**
 * Get current user role
 * @returns {string|null} User role
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

/**
 * Check if user has required role
 * @param {string|Array} requiredRoles - Role(s) required for access
 * @returns {boolean} Has required role
 */
export const hasRole = (requiredRoles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.some(role => 
      role.toLowerCase() === userRole.toLowerCase()
    );
  }
  
  return requiredRoles.toLowerCase() === userRole.toLowerCase();
};
