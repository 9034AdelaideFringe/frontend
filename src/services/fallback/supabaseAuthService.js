import supabase from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'

/**
 * 使用 Supabase 实现的登录功能
 * @param {Object} credentials - 包含 email 和 password 的对象
 * @returns {Promise<Object>} - 用户数据
 */
export async function login(credentials) {
  try {
    // 首先在 users 表中查找匹配的用户
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .single()
    
    if (error) throw error
    
    // 在实际项目中应使用安全的密码比较，这里简化处理
    if (data && data.password === credentials.password) {
      // 登录成功，保存用户信息到 localStorage
      const userData = {
        id: data.user_id,
        email: data.email,
        name: data.name,
        role: data.role
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isLoggedIn', 'true')
      
      return userData
    } else {
      throw { message: 'Invalid credentials' }
    }
  } catch (error) {
    console.error('登录失败:', error)
    throw { message: error.message || 'Authentication failed' }
  }
}

/**
 * 使用 Supabase 实现的注销功能
 * @returns {Promise<Object>} - 注销结果
 */
export async function logout() {
  // 清除本地存储的用户数据
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
  
  // 在实际场景中，可能需要更新 Supabase 中的 session 状态
  return { success: true }
}

/**
 * 检查用户是否已认证
 * @returns {boolean} - 用户是否已认证
 */
export function isAuthenticated() {
  return localStorage.getItem('isLoggedIn') === 'true'
}

/**
 * 获取当前用户信息
 * @returns {Object|null} - 用户信息或 null
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 注册新用户
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object>} - 注册结果
 */
export async function register(userData) {
  try {
    // 创建一个带有 UUID 的新用户
    const newUser = {
      user_id: uuidv4(),
      email: userData.email,
      password: userData.password, // 实际应用中应该加密
      name: userData.name,
      role: 'USER' // 默认角色
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
    
    if (error) {
      console.error('注册用户失败:', error)
      throw error
    }
    
    // 注册成功后自动登录
    const loginData = {
      id: data[0].user_id,
      email: data[0].email,
      name: data[0].name,
      role: data[0].role
    }
    
    localStorage.setItem('user', JSON.stringify(loginData))
    localStorage.setItem('isLoggedIn', 'true')
    
    return loginData
  } catch (error) {
    console.error('注册失败:', error)
    throw { message: error.message || 'Registration failed' }
  }
}