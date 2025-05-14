/**
 * Authentication service - Main export file
 */

// Export all authentication-related functions
export { apiUrl } from './authService/api-config';
export { authenticatedRequest } from './authService/auth-client';
export { handleApiError } from './authService/error-handler';

// User management
export { 
  login, 
  register, 
  getCurrentUser, 
  logout, 
  isAuthenticated 
} from './authService/user-service';

// Role management
export { 
  isAdmin, 
  getUserRole, 
  hasRole 
} from './authService/role-service';

// Password management
export { 
  requestPasswordReset, 
  verifyResetToken, 
  resetPassword,
  changePassword
} from './authService/passwordService';