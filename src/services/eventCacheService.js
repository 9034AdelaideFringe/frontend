import { getEventById } from './eventService';

const CACHE_KEY_PREFIX = 'event_cache_';
const CACHE_EXPIRY_MINUTES = 30;

/**
 * 生成缓存键名
 * @param {string} eventId - 事件ID
 * @returns {string} 缓存键名
 */
const getCacheKey = (eventId) => `${CACHE_KEY_PREFIX}${eventId}`;

/**
 * 检查缓存是否过期
 * @param {Object} cachedData - 缓存数据
 * @returns {boolean} 是否过期
 */
const isCacheExpired = (cachedData) => {
  if (!cachedData || !cachedData.timestamp) {
    return true;
  }
  
  const now = new Date().getTime();
  const cacheTime = new Date(cachedData.timestamp).getTime();
  const diffMinutes = (now - cacheTime) / (1000 * 60);
  
  return diffMinutes > CACHE_EXPIRY_MINUTES;
};

/**
 * 从localStorage获取事件数据
 * @param {string} eventId - 事件ID
 * @returns {Object|null} 缓存的事件数据
 */
const getEventFromCache = (eventId) => {
  try {
    const cacheKey = getCacheKey(eventId);
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      console.log(`事件 ${eventId} 缓存不存在`);
      return null;
    }
    
    const parsed = JSON.parse(cachedData);
    
    if (isCacheExpired(parsed)) {
      console.log(`事件 ${eventId} 缓存已过期，清除缓存`);
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.data;
    
  } catch (error) {
    console.error(`读取事件 ${eventId} 缓存失败:`, error);
    return null;
  }
};

/**
 * 将事件数据保存到localStorage
 * @param {string} eventId - 事件ID
 * @param {Object} eventData - 事件数据
 */
const saveEventToCache = (eventId, eventData) => {
  try {
    const cacheKey = getCacheKey(eventId);
    const cacheData = {
      data: eventData,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`事件 ${eventId} 已缓存，有效期: ${CACHE_EXPIRY_MINUTES} 分钟`);
    
  } catch (error) {
    console.error(`缓存事件 ${eventId} 失败:`, error);
  }
};

/**
 * 获取事件数据（优先从缓存获取）
 * @param {string} eventId - 事件ID
 * @returns {Promise<Object>} 事件数据
 */
export const getCachedEventById = async (eventId) => {
  
  // 首先尝试从缓存获取
  const cachedEvent = getEventFromCache(eventId);
  if (cachedEvent) {
    return cachedEvent;
  }
  
  try {
    const eventData = await getEventById(eventId);
    
    if (eventData) {
      // 保存到缓存
      saveEventToCache(eventId, eventData);
    }
    
    return eventData;
  } catch (error) {
    console.error(`获取事件 ${eventId} 失败:`, error);
    throw error;
  }
};

/**
 * 批量获取事件数据
 * @param {Array<string>} eventIds - 事件ID数组
 * @returns {Promise<Array>} 事件数据数组
 */
export const getMultipleCachedEvents = async (eventIds) => {
  
  try {
    const promises = eventIds.map(id => getCachedEventById(id));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);
  } catch (error) {
    console.error('批量获取事件数据失败:', error);
    throw error;
  }
};

/**
 * 清除过期的事件缓存
 */
export const cleanExpiredEventCache = () => {
  console.log('清理过期的事件缓存');
  
  try {
    const keys = Object.keys(localStorage);
    const eventCacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    
    let cleanedCount = 0;
    eventCacheKeys.forEach(key => {
      try {
        const cachedData = JSON.parse(localStorage.getItem(key));
        if (isCacheExpired(cachedData)) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
      } catch (error) {
        // 如果解析失败，直接删除
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });
    
    console.log(`已清理 ${cleanedCount} 个过期缓存`);
  } catch (error) {
    console.error('清理缓存失败:', error);
  }
};