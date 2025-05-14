/**
 * Error handling utilities
 */

/**
 * Handle API errors with useful messages
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 * @returns {string} Formatted error message
 */
export const handleApiError = (error, operation = "操作") => {
  // Log detailed error for debugging
  console.error(`${operation}失败:`, error);

  // Check for network errors
  if (error.name === "TypeError" && error.message === "Failed to fetch") {
    return `无法连接到服务器，请检查您的网络连接并重试。`;
  }

  // Handle JSON parsing errors
  if (error.name === "SyntaxError" && error.message.includes("JSON")) {
    return `服务器返回了无效数据，请稍后再试。`;
  }

  // Return error message from API if available
  if (error.message) {
    return error.message;
  }

  // Fallback error message
  return `${operation}失败，请重试。`;
};
