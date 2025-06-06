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
  const user = getCurrentUser();
  return isLoggedIn === "true" && !!user;
};


/**
 * Update user profile
 * @param {Object} updateData - User data to update
 * @param {string} [updateData.name] - User's new name
 * @param {string} [updateData.currentPassword] - Current password (required for password change)
 * @param {string} [updateData.newPassword] - New password
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (updateData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.user_id) {
      throw new Error("用户未登录或无法获取用户ID");
    }
    
    console.log("[user-service.js] 发送更新用户资料请求:", updateData);
    
    // 构建请求体，根据API要求格式
    const requestBody = {
      name: updateData.name
    };
    
    // 如果要更改密码，使用正确的字段名
    if (updateData.newPassword) {
      // 需要当前密码验证
      if (!updateData.currentPassword) {
        throw new Error("更改密码需要提供当前密码");
      }
      requestBody.password = updateData.newPassword;
      requestBody.current_password = updateData.currentPassword; 
    } else if (updateData.currentPassword) {
      // 如果提供了当前密码但不是更改密码，保留当前密码字段用于验证
      requestBody.current_password = updateData.currentPassword;
      // 不设置 password 字段，因为不是在更改密码
    }
    
    console.log("[user-service.js] 更新用户资料请求体:", JSON.parse(JSON.stringify(requestBody)));
    
    // 使用正确的API端点路径并确保包含credentials: 'include'
    const data = await authRequest("/user", {
      method: "POST",
      body: JSON.stringify(requestBody),
      credentials: 'include', // 确保包含凭据
    });
    
    console.log("[user-service.js] 更新用户资料API响应:", data);
    
    // 更新成功后，更新本地存储的用户信息
    if (data && (data.message === "ok" || data.success)) {
      const updatedUser = {
        ...currentUser,
        name: updateData.name // 只更新名称，密码不存储在本地
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("[user-service.js] 已更新本地用户信息");
      
      return updatedUser;
    } else {
      throw new Error(data?.message || "更新用户资料失败");
    }
  } catch (error) {
    console.error("[user-service.js] 更新用户资料错误:", error);
    
    // 如果是网络错误，允许本地更新UI
    if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("API端点不存在"))) {
      console.log("[user-service.js] API请求失败，仅更新本地数据");
      const currentUser = getCurrentUser();
      if (currentUser && updateData.name) {
        const updatedUser = { ...currentUser, name: updateData.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        throw new Error("服务器连接失败，但已更新本地显示。下次登录后可能会重置。");
      }
    }
    
    // 返回格式化的错误信息
    const errorMessage = handleApiError(error, "更新用户资料");
    throw new Error(errorMessage);
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Password data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Result
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    // 使用通用的更新资料函数来更改密码
    return await updateUserProfile({ currentPassword, newPassword });
  } catch (error) {
    console.error("更改密码错误:", error);
    throw error;
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
      throw new Error("用户未登录或无法获取用户ID");
    }
    
    const data = await authRequest("/user/delete", {
      method: "DELETE",
      body: JSON.stringify({ 
        user_id: currentUser.user_id,
        password 
      }),
    });
    
    // 成功删除后清除本地存储
    if (data.message === "ok" || data.success) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    }
    
    return { success: true, message: "账号已成功删除" };
  } catch (error) {
    console.error("删除账号错误:", error);
    const errorMessage = handleApiError(error, "删除账号");
    throw new Error(errorMessage);
  }
};
