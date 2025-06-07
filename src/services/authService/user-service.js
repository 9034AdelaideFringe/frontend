/**
 * User service for managing user state
 */
import { authRequest } from './auth-client';
import { handleApiError } from './error-handler';

/**
 * Login with credentials
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise} Login result
 */
export const login = async ({ email, password }) => {
  console.log('用户服务：开始登录');
  try {
    // 不包含凭据的登录请求，明确指定 credentials: 'omit'
    const response = await authRequest('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'omit' 
    });

    console.log("Login API response:", response);
    
    // 处理API返回的数组格式
    let userData = null;
    
    // 情况1: 响应格式为 {data: [{user对象}], message: "ok"}
    if (response.message === "ok" && Array.isArray(response.data) && response.data.length > 0) {
      userData = response.data[0];
      console.log("Extracted user data from array:", userData);
    } 
    // 情况2: 响应格式为 {data: {user对象}, message: "ok"} 
    else if (response.message === "ok" && response.data && !Array.isArray(response.data)) {
      userData = response.data;
      console.log("Extracted user data from object:", userData);
    }
    // 情况3: 响应直接是用户对象 (兼容原来的情况)
    else if (response.email) {
      userData = response;
    }
    
    // 验证提取的用户数据
    if (!userData || !userData.email) {
      console.error("Invalid user data format:", response);
      throw new Error("Invalid user data received");
    }

    // 如果后端返回token，存储它
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      console.log('Token已存储');
    }
    
    // 存储用户信息
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
    console.log("用户角色:", userData.role || "未知");
    
    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - User data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise} Registration result
 */
export const register = async ({ name, email, password }) => {
  // Validate password requirements
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return Promise.reject(
      new Error("Password must be at least 8 characters long and include both letters and numbers.")
    );
  }
  
  try {
    // 添加调试信息，查看发送的请求体
    console.log("Sending registration request:", { email, password, name });
    
    const data = await authRequest("/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    
    // 添加调试信息，查看完整响应
    console.log("Registration API response:", data);
    
    // 修改验证逻辑，适应API返回的数据格式
    if (data.message === "ok") {
      // 检查data是否为数组
      if (Array.isArray(data.data) && data.data.length > 0) {
        // 如果是数组，取第一个元素
        const userData = data.data[0];
        // 检查user_id字段，而不是userId
        if (userData.user_id) {
          console.log("Registration successful, proceeding to login");
          // 自动登录获取完整用户信息
          return login({ email, password });
        }
      } else if (data.data && data.data.user_id) {
        // 如果data不是数组但有user_id，也是有效的
        console.log("Registration successful with non-array response");
        return login({ email, password });
      }
    }
    
    // 如果上述条件都不满足，则抛出错误
    console.error("Invalid API response structure:", data);
    throw new Error("Invalid response from signup API");
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User info or null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

/**
 * Logout current user
 * @returns {Promise} Logout result
 */
export const logout = async () => {
  try {
    await authRequest("/signout", {
      method: "GET",
    });
    
    // Clear local storage regardless of API response
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    
    // Clear local storage even on error
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    
    return { success: true };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  // Check if user info exists
  // (JWT token is handled automatically in cookies)
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = getCurrentUser(); // getCurrentUser is defined within this file
  return isLoggedIn === "true" && !!user;
};


/**
 * Update user profile
 * @param {Object} updateData - User data to update
 * @param {string} [updateData.name] - User's new name
 * @param {string} [updateData.currentPassword] - Current password (required for password change or name change with this API)
 * @param {string} [updateData.newPassword] - New password
 * @returns {Promise<Object>} Updated user data or API response data
 */
export const updateUserProfile = async (updateData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.user_id || !currentUser.email) {
      throw new Error("User not logged in or unable to get user ID/email");
    }

    console.log("[user-service.js] Sending update user profile request:", updateData);

    let hardcodedUrl;
    let requestBody;

    // Determine which endpoint and request body to use based on provided data
    const updatingName = updateData.name !== undefined && updateData.name !== null; // Allow empty string name update
    const updatingPassword = !!updateData.newPassword; // Check for truthiness of newPassword

    if (updatingName && updatingPassword) {
        // Case 3: Update both name and password via /profile endpoint
        hardcodedUrl = "https://changusers.tj15982183241.workers.dev/api/user/profile";
        if (!updateData.currentPassword) {
            throw new Error("Current password is required to update both username and password");
        }
        requestBody = {
            email: currentUser.email,
            currentPassword: updateData.currentPassword,
            newName: updateData.name,
            newPassword: updateData.newPassword,
        };
        console.log("[user-service.js] Preparing to call /profile endpoint");

    } else if (updatingName) {
        // Case 1: Update name only via /name endpoint
        hardcodedUrl = "https://changusers.tj15982183241.workers.dev/api/user/name";
        // Current password is NOT required for this endpoint based on test.html
        requestBody = {
            email: currentUser.email,
            newName: updateData.name,
        };
         console.log("[user-service.js] Preparing to call /name endpoint");

    } else if (updatingPassword) {
        // Case 2: Update password only via /password endpoint
        hardcodedUrl = "https://changusers.tj15982183241.workers.dev/api/user/password";
         if (!updateData.currentPassword) {
            throw new Error("Current password is required to change password");
        }
        requestBody = {
            email: currentUser.email,
            currentPassword: updateData.currentPassword,
            newPassword: updateData.newPassword,
        };
         console.log("[user-service.js] Preparing to call /password endpoint");

    } else {
        // Neither name nor password provided
        throw new Error("No information provided for update (new username or new password)");
    }

    console.log("[user-service.js] Update user profile request body:", JSON.parse(JSON.stringify(requestBody)));

    // Use fetch directly with hardcoded URL and manual headers, matching test.html
    const headers = {
      'Content-Type': 'application/json',
      // No Authorization header or credentials: 'include' based on test.html working
    };

    console.log("[user-service.js] Sending PATCH request using hardcoded URL:", hardcodedUrl);
    console.log("[user-service.js] Request headers:", headers); // Log headers for debugging

    const response = await fetch(hardcodedUrl, {
      method: "PATCH", // Use PATCH method
      headers: headers,
      body: JSON.stringify(requestBody),
      // Use default credentials: 'omit'
    });

    // --- Inline response handling based on backend structure ---
    let responseData = null;
    try {
        responseData = await response.json();
        console.log("[user-service.js] API response:", responseData);
    } catch (jsonError) {
        console.error("[user-service.js] Failed to parse API response JSON:", jsonError);
        // If JSON parsing fails, still proceed to check response.ok
    }


    if (response.ok) { // Check for successful HTTP status (2xx)
        // Backend returns { status: 'success', message: '...', data: { user_id, email, name, updated_at } } on success
        if (responseData && responseData.status === 'success') {
            const updatedUser = { ...currentUser }; // Start with current user data
            let localUserUpdated = false;

            // Update name in local storage if the API response contains updated user data with a name
            if (responseData.data && responseData.data.name !== undefined) {
                 updatedUser.name = responseData.data.name;
                 localStorage.setItem("user", JSON.stringify(updatedUser));
                 console.log("[user-service.js] Local user info updated (name)");
                 localUserUpdated = true;
            } else {
                 // If API didn't return updated user data, but the call was successful
                 // (e.g., password update), log success.
                 console.log(`[user-service.js] Update successful (${hardcodedUrl.split('/').pop()})`);
                 localUserUpdated = true; // Consider it locally updated for success reporting
            }

            if (!localUserUpdated) {
                 console.warn("[user-service.js] Update successful, but API response format unknown or did not return updated user data. Local user info may not be fully synced.");
            }

            // Return the API response data on success
            return responseData;

        } else {
            // Response status is 2xx, but backend status is not 'success' - unexpected format
            const errorMessage = responseData?.message || responseData?.error || `Update user profile (${hardcodedUrl.split('/').pop()}) failed with unexpected success response format`;
            console.error("[user-service.js] Unexpected successful API response format:", responseData);
            const error = new Error(errorMessage);
            error.response = response; // Attach response for potential further inspection
            error.responseData = responseData;
            throw error;
        }

    } else { // Non-2xx HTTP status
        // Backend returns { error: '...', message: '...' } on failure
        const errorMessage = responseData?.message || responseData?.error || `Update user profile (${hardcodedUrl.split('/').pop()}) failed with status ${response.status}`;
        console.error("[user-service.js] API error response:", responseData);
        const error = new Error(errorMessage);
        // Attach response details to the error object
        error.response = response;
        error.responseData = responseData;
        throw error;
    }
    // --- End inline response handling ---

  } catch (error) {
    console.error("[user-service.js] Update user profile error:", error);

    // Log more detailed error information if available
    if (error.response) { // If the error object includes response info
        console.error("[user-service.js] API error response status:", error.response.status);
        // responseData is already logged above if available
    } else if (error.message) {
         console.error("[user-service.js] Error message:", error.message);
    }

    // handleApiError can be used for more detailed error mapping if needed elsewhere
    // const errorMessage = handleApiError(error, "Update user profile");
    throw error; // Re-throw the error for the component to handle
  }
};


/**
 * Delete user account
 * @param {string} password - User's current password for confirmation
 * @returns {Promise<Object>} Result
 */
export const deleteAccount = async (password) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.user_id) {
      throw new Error("User not logged in or unable to get user ID");
    }

    const data = await authRequest("/user/delete", {
      method: "DELETE",
      body: JSON.stringify({
        user_id: currentUser.user_id,
        password
      }),
    });

    // Clear local storage on successful deletion
    if (data.message === "ok" || data.success) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    }

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    console.error("Delete account error:", error);
    const errorMessage = handleApiError(error, "Delete account");
    throw new Error(errorMessage);
  }
};
