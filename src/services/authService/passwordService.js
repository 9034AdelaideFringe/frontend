/**
 * Password management service
 */
import { authRequest } from './auth-client';
import { handleApiError } from './error-handler';

/**
 * Request password reset
 * @param {string} email - User's email address
 * @returns {Promise<void>}
 */
export const requestPasswordReset = async (email) => {
  try {
    // In a real application, this would call a backend API
    return await authRequest("/request-password-reset", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Verify password reset token
 * @param {string} token - Password reset token
 * @returns {Promise<boolean>}
 */
export const verifyResetToken = async (token) => {
  try {
    // In a real application, this would call a backend API
    const response = await authRequest("/verify-reset-token", {
      method: "POST",
      body: JSON.stringify({ token })
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const resetPassword = async (token, newPassword) => {
  try {
    // Validate password requirements
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error("Password must be at least 8 characters long and include both letters and numbers.");
    }
    
    // In a real application, this would call a backend API
    await authRequest("/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword })
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Change password for authenticated user
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    // Validate password requirements
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error("Password must be at least 8 characters long and include both letters and numbers.");
    }
    
    // In a real application, this would call a backend API
    await authRequest("/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword })
    });
  } catch (error) {
    throw error;
  }
};