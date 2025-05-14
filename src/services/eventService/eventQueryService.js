import { getApiUrl, handleApiResponse, getRequestOptions } from './config/apiConfig';
import { mapEventData } from './eventMapper';

// 事件数据缓存
let eventsCache = [];
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 缓存有效期：5分钟

/**
 * 获取所有活动
 * @param {boolean} [forceRefresh=false] - 是否强制刷新缓存
 * @returns {Promise<Array>} 格式化后的事件列表
 */
export const getAllEvents = async (forceRefresh = false) => {
  const now = Date.now();
  
  if (!forceRefresh && eventsCache.length > 0 && (now - lastFetchTime) < CACHE_TTL) {
    return eventsCache;
  }
  
  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
    
    // 使用API助手构建URL, 现在会正确添加/api前缀
    const apiUrl = getApiUrl('/event');
    console.log(`尝试获取事件数据: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      ...getRequestOptions(),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const result = await handleApiResponse(response, '获取事件');
    
    if (result.message === 'ok' && Array.isArray(result.data)) {
      eventsCache = result.data.map(mapEventData);
      lastFetchTime = now;
      return eventsCache;
    } else {
      console.error('无效的API响应格式:', result);
      return [];
    }
  } catch (error) {
    console.error('获取事件数据失败:', error);
    return []; // 返回空数组
  }
};

/**
 * 获取精选活动（使用真实数据的前3个）
 * @returns {Promise<Array>} 精选事件列表
 */
export const getFeaturedEvents = async () => {
  try {
    const allEvents = await getAllEvents();
    // 按创建时间排序，获取最新的3个活动
    return allEvents
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
};

/**
 * 通过ID获取单个活动（从缓存中查找）
 * @param {string} id - 活动ID
 * @returns {Promise<Object>} 格式化后的事件对象
 */
export const getEventById = async (id) => {
  try {
    // 先尝试从现有缓存中查找
    if (eventsCache.length > 0) {
      const cachedEvent = eventsCache.find(event => event.id === id);
      if (cachedEvent) {
        return cachedEvent;
      }
    }
    
    // 如果缓存中没有找到或缓存为空，则获取所有事件
    const allEvents = await getAllEvents();
    
    // 再次从获取的所有事件中查找
    const event = allEvents.find(event => event.id === id);
    
    if (event) {
      return event;
    } else {
      throw new Error(`Event with ID ${id} not found`);
    }
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

/**
 * 清除事件缓存
 */
export const clearEventCache = () => {
  eventsCache = [];
  lastFetchTime = 0;
};