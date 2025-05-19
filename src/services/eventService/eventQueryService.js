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
    console.log('使用缓存的事件数据，跳过API请求');
    return eventsCache;
  }
  
  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
    
    // 使用API助手构建URL
    const apiUrl = getApiUrl('/event');
    console.log(`尝试获取事件数据: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      ...getRequestOptions(),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const result = await handleApiResponse(response, '获取事件');
    
    if (result.message === 'ok' && Array.isArray(result.data)) {
      console.log(`从API获取了 ${result.data.length} 个事件`);
      
      // 映射数据前先存储未处理的原始数据
      const rawEvents = [...result.data];
      
      eventsCache = result.data.map(event => {
        const mappedEvent = mapEventData(event);
        return mappedEvent;
      });
      
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
    console.error('获取精选活动失败:', error);
    return [];
  }
};

/**
 * 通过ID获取单个活动（实现修改为直接从API获取单个事件，避免数据映射问题）
 * @param {string} id - 活动ID
 * @returns {Promise<Object>} 事件对象
 */
export const getEventById = async (id) => {
  try {
    console.log(`尝试获取ID为 ${id} 的事件数据`);
    
    // 特殊处理: 直接从API获取单个事件的详细信息
    const apiUrl = getApiUrl(`/event/${id}`);
    console.log(`获取单个事件的API URL: ${apiUrl}`);
    
    // 先尝试直接获取单个事件
    try {
      const response = await fetch(apiUrl, getRequestOptions());
      const result = await handleApiResponse(response, '获取单个事件');
      
      // 如果直接API调用成功，返回未经映射的原始数据
      if (result && (result.data || result.event_id || result.id)) {
        console.log('成功获取单个事件数据，跳过映射');
        return result.data || result;
      }
    } catch (directApiError) {
      console.warn(`直接获取事件失败，尝试从事件列表中查找: ${directApiError.message}`);
    }
    
    // 如果直接API调用失败，回退到从所有事件中查找
    console.log('从所有事件中查找指定事件');
    const allEvents = await getAllEvents(true); // 强制刷新缓存
    
    // 查找匹配的事件 (先检查id字段，再检查event_id字段)
    const event = allEvents.find(event => event.id === id || event.event_id === id);
    
    if (event) {
      return event;
    } else {
      console.error(`未找到ID为 ${id} 的事件`);
      throw new Error(`Event with ID ${id} not found`);
    }
  } catch (error) {
    console.error(`获取ID为 ${id} 的事件失败:`, error);
    throw error;
  }
};

/**
 * 清除事件缓存
 */
export const clearEventCache = () => {
  console.log('清除事件缓存');
  eventsCache = [];
  lastFetchTime = 0;
};