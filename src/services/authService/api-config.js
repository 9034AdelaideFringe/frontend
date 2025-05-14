/**
 * API configuration
 */

// Determine the base URL based on environment
// const API_BASE = import.meta.env.MODE === 'development'
//   ? '/api'  // Use proxy in development
//   : import.meta.env.VITE_APP_API_URL; // Use full URL in production
const API_BASE = "/api";

/**
 * Creates a full API URL based on the environment
 * @param {string} endpoint - The API endpoint
 * @returns {string} The complete URL
 */
export const apiUrl = (endpoint) => {
  return `${API_BASE}${endpoint}`;
};
