import supabase from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'

// 事件缓存
let eventsCache = null
let cachedEventMap = new Map()

/**
 * 获取所有事件
 * @returns {Promise<Array>} - 事件列表
 */
export async function getAllEvents() {
  try {
    // 如果有缓存并且不需要强制刷新，则返回缓存
    if (eventsCache) {
      return eventsCache
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    
    // 更新缓存
    eventsCache = data
    
    // 更新事件映射缓存，加快通过 ID 查询的速度
    data.forEach(event => {
      cachedEventMap.set(event.event_id, event)
    })
    
    return data
  } catch (error) {
    console.error('获取事件列表失败:', error)
    throw error
  }
}

/**
 * 获取精选事件
 * @param {number} limit - 返回事件的数量限制
 * @returns {Promise<Array>} - 精选事件列表
 */
export async function getFeaturedEvents(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'ACTIVE')  
      .order('date', { ascending: true }) // 按日期排序
      .limit(limit)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('获取精选事件失败:', error)
    throw error
  }
}

/**
 * 根据 ID 获取事件详情
 * @param {string} id - 事件 ID
 * @returns {Promise<Object>} - 事件详情
 */
export async function getEventById(id) {
  try {
    // 首先检查缓存映射
    if (cachedEventMap.has(id)) {
      return cachedEventMap.get(id)
    }
    
    // 如果没有在缓存中找到，则从 Supabase 获取
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_id', id)
      .single()
    
    if (error) throw error
    
    // 更新缓存
    cachedEventMap.set(id, data)
    
    return data
  } catch (error) {
    console.error(`获取事件 ${id} 详情失败:`, error)
    throw error
  }
}

/**
 * 创建新事件
 * @param {Object} eventData - 事件数据
 * @returns {Promise<Object>} - 创建的事件
 */
export async function createEvent(eventData) {
  try {
    const newEvent = {
      event_id: uuidv4(),
      ...eventData,
      status: 'ACTIVE'
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
    
    if (error) throw error
    
    // 清除缓存，保证下次获取事件时能获取到最新数据
    clearEventCache()
    
    return data[0]
  } catch (error) {
    console.error('创建事件失败:', error)
    throw error
  }
}

/**
 * 更新事件
 * @param {string} id - 事件 ID
 * @param {Object} eventData - 更新的事件数据
 * @returns {Promise<Object>} - 更新后的事件
 */
export async function updateEvent(id, eventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('event_id', id)
      .select()
    
    if (error) throw error
    
    // 清除缓存
    clearEventCache()
    
    return data[0]
  } catch (error) {
    console.error(`更新事件 ${id} 失败:`, error)
    throw error
  }
}

/**
 * 删除事件
 * @param {string} id - 要删除的事件 ID
 * @returns {Promise<boolean>} - 删除是否成功
 */
export async function deleteEvent(id) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_id', id)
    
    if (error) throw error
    
    // 清除缓存
    clearEventCache()
    
    return true
  } catch (error) {
    console.error(`删除事件 ${id} 失败:`, error)
    throw error
  }
}

/**
 * 清除事件缓存
 */
export function clearEventCache() {
  eventsCache = null
  cachedEventMap.clear()
}

/**
 * 上传图片
 * @param {File} file - 要上传的文件
 * @returns {Promise<string>} - 上传后的图片 URL
 */
export async function uploadImage(file) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `event-images/${fileName}`
    
    const { error: uploadError } = await supabase
      .storage
      .from('images')  // 确保在 Supabase 中创建了这个存储桶
      .upload(filePath, file)
    
    if (uploadError) throw uploadError
    
    // 获取上传后的公共 URL
    const { data } = supabase
      .storage
      .from('images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  } catch (error) {
    console.error('上传图片失败:', error)
    throw error
  }
}

/**
 * 映射事件数据
 * @param {Object} event - 原始事件数据
 * @returns {Object} - 映射后的事件数据
 */
export function mapEventData(event) {
  // Supabase 到前端的映射
  return {
    id: event.event_id,
    title: event.title,
    description: event.description,
    abstract: event.short_description,
    date: event.date,
    time: event.time,
    venue: event.venue,
    image: event.image,
    capacity: event.capacity,
    category: event.category,
    status: event.status
  }
}

/**
 * 为 API 请求准备事件数据
 * @param {Object} formData - 表单数据
 * @returns {Object} - API 格式的事件数据
 */
export function prepareEventDataForApi(formData) {
  // 前端到 Supabase 的映射
  return {
    title: formData.title,
    description: formData.description || '',
    short_description: formData.abstract || '',
    image: formData.image || '',
    date: formData.date || new Date().toISOString().split('T')[0],
    time: formData.time || '',
    venue: formData.venue || '',
    capacity: formData.capacity || 100,
    category: formData.category || '',
    created_by: formData.createdBy || getCurrentUserId()
  }
}

/**
 * 获取当前用户 ID
 * @returns {string|null} - 用户 ID
 */
function getCurrentUserId() {
  try {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    return user ? user.id : null
  } catch (error) {
    return null
  }
}