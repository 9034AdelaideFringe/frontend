
export { apiUrl } from './authService/api-config';
// Export authenticatedRequest and isApiResponseSuccess from auth-client
// Assuming isApiResponseSuccess is defined and exported in auth-client.js
export { authenticatedRequest, isApiResponseSuccess } from './authService/auth-client';
export { handleApiError } from './authService/error-handler';

// User management
// Assuming validateUserAndGetId is defined and exported in user-service.js
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