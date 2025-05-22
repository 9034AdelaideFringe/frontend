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
  console.log("=== API SERVICE: CREATE EVENT STARTED ===");
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
  
  console.log("API REQUEST: Basic fields added to FormData");
  
  // 添加图片URL或文件
  if (eventData.image) {
    console.log("API REQUEST: Adding image:", typeof eventData.image === 'object' ? 'File object' : eventData.image);
    
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
        console.error("Failed to process blob URL:", error);
        formData.append('image', eventData.image);
      }
    } else {
      formData.append('image', eventData.image);
    }
  }
  
  if (eventData.venueseatinglayout) {
    console.log("API REQUEST: Adding venue layout:", typeof eventData.venueseatinglayout === 'object' ? 'File object' : eventData.venueseatinglayout);
    formData.append('venueseatinglayout', eventData.venueseatinglayout);
  }
  
  // 添加票种信息
  if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
    console.log("API REQUEST: Adding ticket types:", eventData.ticketTypes);
    
    // 确保每个票种的字段都是字符串
    const stringifiedTicketTypes = eventData.ticketTypes.map(ticket => ({
      name: String(ticket.name),
      description: String(ticket.description),
      price: String(ticket.price), // 转换为字符串
      available_quantity: String(ticket.available_quantity) // 转换为字符串
    }));
    
    formData.append('ticket_types', JSON.stringify(stringifiedTicketTypes));
    
    // 日志每个票种的详细信息
    stringifiedTicketTypes.forEach((ticket, index) => {
      console.log(`Ticket #${index + 1}:`, ticket);
    });
  }
  
  console.log("API REQUEST: Preparing to send FormData to server");
  
  // 添加更多日志，记录原始响应文本
  try {
    // 调用API
    const response = await fetch('/api/event', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    console.log("API RESPONSE: Status", response.status, response.statusText);
    
    // 克隆响应以便读取原始文本
    const responseClone = response.clone();
    const rawText = await responseClone.text();
    console.log("Raw API Response:", rawText);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Failed to create event');
    }
    
    // 在API调用后添加明确的错误检查
    let resultData;
    try {
      resultData = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      throw new Error("Invalid response format from server");
    }
    
    // 检查是否存在错误字段
    if (resultData && resultData.error) {
      console.error("API ERROR:", resultData.error);
      throw new Error(resultData.error);
    }
    
    // 只有在确认没有错误时才继续
    console.log("API SUCCESS: Event created:", resultData);
    
    // 清除缓存确保获取最新数据
    clearEventCache();
    console.log("Cache cleared to ensure fresh data on next fetch");
    
    return resultData;
  } catch (error) {
    console.error("API ERROR: Failed to create event:", error);
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