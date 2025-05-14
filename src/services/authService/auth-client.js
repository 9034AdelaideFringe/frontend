/**
 * Authentication API client
 */
import { apiUrl } from './api-config';
import { handleApiError } from './error-handler';

/**
 * Make a request to the authentication API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise} API response
 */
export const authRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include', // Allow sending and receiving cookies
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(apiUrl(endpoint), requestOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // Check for error messages in the response body
    if (data.error || data.message === "error") {
      throw new Error(data.error || "Operation failed");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a request with authentication header
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch promise
 */
export const authenticatedRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(apiUrl(endpoint), {
      ...options,
      credentials: "include", // Include cookies for JWT
    });

    if (response.status === 401) {
      // Token expired or invalid, trigger logout
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
