import { getApiUrl, handleApiResponse, getRequestOptions } from './config/apiConfig';
import { prepareEventDataForApi } from './eventMapper';
import { clearEventCache } from './eventQueryService';
import { authenticatedRequest } from '../authService';

/**
 * 创建新活动（管理员功能）
 * @param {Object} eventData - 事件数据
 * @returns {Promise<Object>} API响应
 */
export const createEvent = async (eventData) => {
  try {
    const apiEventData = prepareEventDataForApi(eventData);
    
    const result = await authenticatedRequest('/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiEventData)
    });
    
    // 清除缓存确保获取最新数据
    clearEventCache();
    
    return result;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

/**
 * 更新活动（管理员功能）
 * @param {string} id - 活动ID
 * @param {Object} eventData - 更新的事件数据
 * @returns {Promise<Object>} API响应
 */
export const updateEvent = async (id, eventData) => {
  try {
    console.log('正在发送更新数据...');
    
    const apiEventData = prepareEventDataForApi(eventData, id);
    
    const response = await fetch(getApiUrl('/event/update'), {
      method: 'POST',
      ...getRequestOptions(),
      body: JSON.stringify(apiEventData)
    });
    
    const result = await handleApiResponse(response, '更新事件');
    
    // 清除缓存确保获取最新数据
    clearEventCache();
    
    return result;
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
};

/**
 * 删除活动（管理员功能）
 * @param {string} id - 活动ID
 * @returns {Promise<Object>} API响应
 */
export const deleteEvent = async (id) => {
  try {
    console.log(`尝试删除ID为 ${id} 的事件`);
    
    const response = await fetch(getApiUrl('/event'), {
      method: 'DELETE',
      ...getRequestOptions(),
      body: JSON.stringify({ event_id: id })
    });
    
    const result = await handleApiResponse(response, '删除事件');
    
    // 清除缓存确保获取最新数据
    clearEventCache();
    
    return result;
  } catch (error) {
    console.error('Delete event error:', error);
    throw error;
  }
};