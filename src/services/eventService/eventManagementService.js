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
  const formData = new FormData();
  
  // 添加基本字段 - 确保所有值都是字符串
  formData.append('title', String(eventData.title));
  formData.append('description', String(eventData.description));
  formData.append('short_description', String(eventData.short_description));
  formData.append('date', String(eventData.date));
  formData.append('time', String(eventData.time));
  formData.append('end_time', String(eventData.end_time));
  formData.append('venue', String(eventData.venue));
  formData.append('capacity', String(eventData.capacity)); // 明确转换为字符串
  formData.append('category', String(eventData.category));
  formData.append('status', String(eventData.status));
  formData.append('created_by', String(eventData.created_by));
  
  // 添加图片URL或文件
  if (eventData.image) {
    if (typeof eventData.image === 'object' && eventData.image instanceof File) {
      // 确保文件有正确的文件名
      formData.append('image', eventData.image, eventData.image.name);
    } else if (typeof eventData.image === 'string' && eventData.image.startsWith('blob:')) {
      // 处理blob URL
      try {
        const response = await fetch(eventData.image);
        const blob = await response.blob();
        const file = new File([blob], `event_image_${Date.now()}.jpg`, { type: blob.type });
        formData.append('image', file, file.name);
      } catch (error) {
        formData.append('image', eventData.image);
      }
    } else {
      formData.append('image', eventData.image);
    }
  }
  
  if (eventData.venueseatinglayout) {
    formData.append('venueseatinglayout', eventData.venueseatinglayout);
  }
  
  // 添加票种信息
  if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
    // 确保每个票种的字段都是字符串
    const stringifiedTicketTypes = eventData.ticketTypes.map(ticket => ({
      name: String(ticket.name),
      description: String(ticket.description),
      price: String(ticket.price), // 转换为字符串
      available_quantity: String(ticket.available_quantity) // 转换为字符串
    }));
    
    formData.append('ticket_types', JSON.stringify(stringifiedTicketTypes));
  }
  
  // 添加更多日志，记录原始响应文本
  try {
    // 调用API
    const response = await fetch('/api/event', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    // 克隆响应以便读取原始文本
    const responseClone = response.clone();
    const rawText = await responseClone.text();
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create event');
    }
    
    // 在API调用后添加明确的错误检查
    let resultData;
    try {
      resultData = JSON.parse(rawText);
    } catch (parseError) {
      throw new Error("Invalid response format from server");
    }
    
    // 检查是否存在错误字段
    if (resultData && resultData.error) {
      throw new Error(resultData.error);
    }
    
    // 清除缓存确保获取最新数据
    clearEventCache();
    
    return resultData;
  } catch (error) {
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
    
    // 直接使用传入的事件数据，不通过prepareEventDataForApi处理
    // 这样可以保留原始字段结构，不会丢失或修改任何字段
    const updateData = {
      event_id: eventData.event_id || id,
      title: String(eventData.title || ''),
      description: String(eventData.description || ''),
      short_description: String(eventData.short_description || ''),
      date: String(eventData.date || ''),
      time: String(eventData.time || ''),
      end_time: String(eventData.end_time || ''),
      venue: String(eventData.venue || ''),
      capacity: String(eventData.capacity || ''),
      category: String(eventData.category || ''),
      status: String(eventData.status || 'ACTIVE'),
      created_by: String(eventData.created_by || '')
    };
    
    console.log('准备发送的更新数据:', updateData);
    
    const response = await fetch(getApiUrl('/event'), {
      method: 'PUT',
      ...getRequestOptions(),
      body: JSON.stringify(updateData)
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