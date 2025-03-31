// 模拟用户数据
const users = [
  {
    id: '1',
    name: 'Tester',
    email: 'test@example.com',
    password: 'password123', // 实际项目中密码应该加密存储
    role: 'user'
  },
  {
    id: '2',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

// 模拟延迟时间 (毫秒)
const DELAY = 800;

/**
 * 模拟登录请求
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.email - 用户邮箱
 * @param {string} credentials.password - 用户密码
 * @returns {Promise} 登录结果
 */
export const login = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(user => user.email === email);
      
      if (!user) {
        reject({ message: '用户不存在' });
        return;
      }
      
      if (user.password !== password) {
        reject({ message: '密码错误' });
        return;
      }
      
      // 创建用户信息对象，不包含敏感数据如密码
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      
      // 模拟生成 token
      const token = `mock-jwt-token-${Math.random().toString(36).substring(2, 15)}`;
      
      // 存储在 localStorage 中
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // 返回登录成功响应
      resolve({ user: userInfo, token });
    }, DELAY);
  });
};

/**
 * 模拟注册请求
 * @param {Object} userData - 用户数据
 * @returns {Promise} 注册结果
 */
export const register = ({ name, email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查邮箱是否已存在
      const existingUser = users.find(user => user.email === email);
      
      if (existingUser) {
        reject({ message: '该邮箱已注册' });
        return;
      }
      
      // 创建新用户
      const newUser = {
        id: `${users.length + 1}`,
        name,
        email,
        password, // 实际项目中应加密
        role: 'user'
      };
      
      // 添加到用户数组
      users.push(newUser);
      
      // 创建用户信息对象（不含密码）
      const userInfo = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      
      // 模拟生成 token
      const token = `mock-jwt-token-${Math.random().toString(36).substring(2, 15)}`;
      
      // 存储在 localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // 返回注册成功响应
      resolve({ user: userInfo, token });
    }, DELAY);
  });
};

/**
 * 检查用户是否已登录
 * @returns {Object|null} 用户信息或 null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
};

/**
 * 登出
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return Promise.resolve({ success: true });
};

/**
 * 检查是否已认证
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  return !!token && !!user;
};

export const signin = async ({email, password}) => {
  const url = import.meta.env.VITE_API
  console.log(url);
  const user = {email, password}

  const response = await fetch(`${url}/login`, {
    method: 'POST',
    body: JSON.stringify(user)
  })

  if(!response.ok){
    console.error('login failed');
    throw new Error("login failed");
      
  }

  const result = await response.json()

  if(result.error){
    throw new Error(result.error)
  }

  console.log(result);
  

}