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
const apiUrl = (endpoint) => {
  return `${API_BASE}${endpoint}`;
};

/**
 * Login with real backend
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise} Login result
 */
export const login = ({ email, password }) => {
  return fetch(apiUrl("/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include", // 重要！允许接收和发送cookies
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw err;
        });
      }
      return response.json();
    })
    .then((data) => {
      // 数据直接从后端返回，包含用户的所有信息（包括role）
      // 将整个用户对象存储在localStorage中
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("isLoggedIn", "true");

      // 在控制台输出用户角色，用于调试
      console.log("用户角色:", data.role);

      return data;
    });
};

/**
 * Register with real backend
 * @param {Object} userData - User data
 * @returns {Promise} Registration result
 */
export const register = ({ name, email, password }) => {
  return fetch(apiUrl("/signup"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include", // 添加这一行，以防后端设置cookie
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw err;
        });
      }
      return response.json();
    })
    .then((data) => {
      // 检查注册是否成功
      if (data.message === "ok" && data.data && data.data.userId) {
        // 自动登录获取完整用户信息
        return login({ email, password });
      } else {
        // 数据格式不是预期的
        throw new Error("Invalid response from signup API");
      }
    });
};

/**
 * Check if user is logged in
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
 * Logout
 */
export const logout = () => {
  return fetch(apiUrl("/logout"), {
    method: "POST",
    credentials: "include", // 重要！包含cookies
  })
    .then(() => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      return { success: true };
    })
    .catch((error) => {
      console.error("Logout error:", error);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      return { success: true };
    });
};

/**
 * Check if authenticated
 */
export const isAuthenticated = () => {
  // 只需检查用户信息是否存在
  // (JWT token由浏览器在cookie中自动处理)
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = getCurrentUser();
  return isLoggedIn === "true" && !!user;
};

/**
 * Create a request with authentication header
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch promise
 */
export const authenticatedRequest = (url, options = {}) => {
  // 不需要手动添加token，因为JWT在cookie中
  const authOptions = {
    ...options,
    credentials: "include", // 包含cookies
  };

  return fetch(apiUrl(url), authOptions).then((response) => {
    if (response.status === 401) {
      // Token expired or invalid, logout
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      return response.json().then((err) => {
        throw err;
      });
    }

    return response.json();
  });
};

/**
 * Handle API errors
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 * @returns {string} Formatted error message
 */
export const handleApiError = (error, operation = "操作") => {
  // 记录详细错误以便调试
  console.error(`${operation}失败:`, error);

  // 检查是否为网络错误
  if (error.name === "TypeError" && error.message === "Failed to fetch") {
    return `无法连接到服务器，请检查您的网络连接并重试。`;
  }

  // 处理JSON解析错误
  if (error.name === "SyntaxError" && error.message.includes("JSON")) {
    return `服务器返回了无效数据，请稍后再试。`;
  }

  // 返回API中的错误消息（如果有）
  if (error.message) {
    return error.message;
  }

  // 后备错误消息
  return `${operation}失败，请重试。`;
};

/**
 * 检查当前用户是否是管理员
 * @returns {boolean} 是否管理员
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  // 考虑到角色字段可能是大写或小写
  return (
    user &&
    (user.role === "ADMIN" ||
      user.role === "admin" ||
      user.role === "Administrator")
  );
};

/**
 * 获取当前用户角色
 * @returns {string|null} 用户角色
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};
