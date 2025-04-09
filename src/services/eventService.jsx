import { authenticatedRequest } from './authService';

// 预定义的活动图片数组
const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1549451371-64aa98a6f660?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1599639668273-17601acd5eea?auto=format&fit=crop&q=80&w=800&h=600',
  'https://images.unsplash.com/photo-1603318275937-5a67aa22de7e?auto=format&fit=crop&q=80&w=800&h=600',
];

// 类别特定的图片映射
const CATEGORY_IMAGES = {
  music: [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800&h=600',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800&h=600',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800&h=600',
  ],
  comedy: [
    'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=800&h=600',
    'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800&h=600',
  ],
  theater: [
    'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=800&h=600',
    'https://images.unsplash.com/photo-1610890690846-5149750c8634?auto=format&fit=crop&q=80&w=800&h=600',
  ],
  art: [
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800&h=600',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800&h=600',
  ],
  dance: [
    'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80&w=800&h=600',
    'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80&w=800&h=600',
  ],
  festival: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800&h=600',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800&h=600',
  ],
};

/**
 * 基于事件标题和描述获取合适的图片URL
 * @param {Object} event - 事件对象
 * @returns {string} 图片URL
 */
const getEventImage = (event) => {
  // 将标题和描述转为小写以便搜索关键词
  const titleLower = (event.title || '').toLowerCase();
  const descLower = (event.des || '').toLowerCase();
  const textToSearch = titleLower + ' ' + descLower;
  
  // 尝试根据关键词匹配类别
  if (textToSearch.includes('music') || textToSearch.includes('concert') || textToSearch.includes('band')) {
    return getRandomImage(CATEGORY_IMAGES.music);
  } else if (textToSearch.includes('comedy') || textToSearch.includes('laugh')) {
    return getRandomImage(CATEGORY_IMAGES.comedy);
  } else if (textToSearch.includes('theatre') || textToSearch.includes('theater') || textToSearch.includes('play')) {
    return getRandomImage(CATEGORY_IMAGES.theater);
  } else if (textToSearch.includes('art') || textToSearch.includes('exhibition') || textToSearch.includes('gallery')) {
    return getRandomImage(CATEGORY_IMAGES.art);
  } else if (textToSearch.includes('dance') || textToSearch.includes('ballet') || textToSearch.includes('choreography')) {
    return getRandomImage(CATEGORY_IMAGES.dance);
  } else if (textToSearch.includes('festival') || textToSearch.includes('celebration')) {
    return getRandomImage(CATEGORY_IMAGES.festival);
  }
  
  // 如果没有匹配到特定类别，则使用基于ID的一致性随机选择
  return getConsistentRandomImage(event.id);
};

/**
 * 从数组中随机获取一张图片
 * @param {Array} imageArray - 图片URL数组
 * @returns {string} 随机图片URL
 */
const getRandomImage = (imageArray) => {
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  return imageArray[randomIndex];
};

/**
 * 基于ID获取一致的随机图片（同一事件每次都会得到相同的图片）
 * @param {string} id - 事件ID
 * @returns {string} 图片URL
 */
const getConsistentRandomImage = (id) => {
  // 使用ID的哈希来确定索引，这样同一ID总是获得相同的图片
  const numericHash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = numericHash % EVENT_IMAGES.length;
  return EVENT_IMAGES[index];
};

/**
 * 将API数据属性映射成前端需要的格式
 * @param {Object} apiEvent - API返回的原始事件数据
 * @returns {Object} 格式化后的事件数据
 */
const mapEventData = (apiEvent) => {
  return {
    id: apiEvent.id,
    title: apiEvent.title || 'Untitled Event',
    // 提取描述的第一句作为摘要
    abstract: apiEvent.des ? (apiEvent.des.split('.')[0] + '.') : 'No description available.',
    // 使用我们的随机图片生成策略
    image: getEventImage(apiEvent),
    description: apiEvent.des || 'No description available.',
    // 格式化日期
    date: formatDateRange(apiEvent.start, apiEvent.end),
    // 从日期时间中提取时间部分
    time: formatTimeRange(apiEvent.start, apiEvent.end),
    venue: apiEvent.venue || 'TBA',
    // 格式化价格
    price: apiEvent.price ? `$${apiEvent.price}` : 'Free',
    // 添加额外属性
    location: apiEvent.location || '',
    capacity: apiEvent.capacity || '0',
    status: apiEvent.status || 'DRAFT',
    // 添加原始时间戳
    createdAt: apiEvent.createdAt,
    updatedAt: apiEvent.updatedAt,
    startRaw: apiEvent.start,
    endRaw: apiEvent.end
  };
};

/**
 * 格式化日期范围
 * @param {string} start - 开始日期时间
 * @param {string} end - 结束日期时间
 * @returns {string} 格式化的日期范围
 */
const formatDateRange = (start, end) => {
  if (!start) return 'Date TBA';
  
  const startDate = new Date(start);
  // 以YYYY-MM-DD格式显示日期
  const formattedStart = startDate.toISOString().split('T')[0];
  
  if (!end) return formattedStart;
  
  const endDate = new Date(end);
  const formattedEnd = endDate.toISOString().split('T')[0];
  
  // 如果开始和结束日期相同，只显示一个日期
  if (formattedStart === formattedEnd) {
    return formattedStart;
  }
  
  // 否则显示日期范围
  return `${formattedStart} - ${formattedEnd}`;
};

/**
 * 格式化时间范围
 * @param {string} start - 开始日期时间
 * @param {string} end - 结束日期时间
 * @returns {string} 格式化的时间范围
 */
const formatTimeRange = (start, end) => {
  if (!start) return 'Time TBA';
  
  const startDate = new Date(start);
  // 以HH:MM格式显示时间
  const startTime = startDate.toTimeString().substring(0, 5);
  
  if (!end) return startTime;
  
  const endDate = new Date(end);
  const endTime = endDate.toTimeString().substring(0, 5);
  
  // 显示时间范围
  return `${startTime} - ${endTime}`;
};

// 添加一个内存缓存来存储所有事件，避免重复请求
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
  
  // 如果缓存有效且不需要强制刷新，直接返回缓存数据
  if (!forceRefresh && eventsCache.length > 0 && (now - lastFetchTime) < CACHE_TTL) {
    return eventsCache;
  }
  
  try {
    const response = await fetch('/api/event');
    const result = await response.json();
    
    if (result.message === 'ok' && Array.isArray(result.data)) {
      // 将API数据映射成前端需要的格式
      eventsCache = result.data.map(mapEventData);
      lastFetchTime = now;
      return eventsCache;
    } else {
      console.error('Invalid response format from API:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
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
    throw error;
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
 * 创建新活动（管理员功能）
 * @param {Object} eventData - 事件数据
 * @returns {Promise<Object>} API响应
 */
export const createEvent = async (eventData) => {
  // 将前端数据格式转换为API期望的格式
  const apiEventData = {
    title: eventData.title,
    des: eventData.description,
    start: eventData.startDate || new Date().toISOString(),
    end: eventData.endDate || new Date().toISOString(),
    venue: eventData.venue,
    location: eventData.location || 'Adelaide',
    capacity: eventData.capacity || '100',
    price: eventData.price || '0.00',
    status: 'DRAFT'
  };

  return authenticatedRequest('/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiEventData)
  });
};

/**
 * 更新活动（管理员功能）
 * @param {string} id - 活动ID
 * @param {Object} eventData - 更新的事件数据
 * @returns {Promise<Object>} API响应
 */
export const updateEvent = async (id, eventData) => {
  try {
    // 将前端表单数据格式转换为API期望的格式
    const apiEventData = {
      id: id, // 添加ID字段
      title: eventData.title,
      des: eventData.description,
      start: eventData.startDate,
      end: eventData.endDate,
      venue: eventData.venue,
      location: eventData.location || 'Adelaide',
      capacity: eventData.capacity || '100',
      price: eventData.price || '0.00',
      status: eventData.status || 'DRAFT'
    };

    console.log('正在发送更新数据:', apiEventData);

    // 使用authenticatedRequest发送PUT请求到/event/update端点
    const response = await fetch('/api/event/update', {
      method: 'POST', // 使用POST而不是PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiEventData),
      credentials: 'include'
    });

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('无法解析错误响应:', jsonError);
      }
      
      throw new Error(errorMessage);
    }

    // 尝试解析响应
    try {
      const result = await response.json();
      console.log('更新成功,响应:', result);
      return result;
    } catch (jsonError) {
      // 如果响应不是JSON格式但状态码成功，则返回成功状态
      console.log('响应不是JSON格式，但请求成功');
      return { success: true, message: 'Event updated successfully' };
    }
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
    
    // 使用POST请求，将ID放在请求体中
    const response = await fetch('/api/event', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
      credentials: 'include' // 确保包含cookie进行认证
    });
    
    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        console.log('删除失败的响应内容:', errorText);
        
        // 尝试解析为JSON，如果可能的话
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (jsonError) {
          // 如果不是JSON，使用原始文本
          if (errorText) {
            errorMessage = `Error: ${errorText}`;
          }
        }
      } catch (e) {
        console.error('无法读取错误响应:', e);
      }
      
      throw new Error(errorMessage);
    }
    
    // 尝试解析响应为JSON，如果失败则返回成功状态
    try {
      const result = await response.json();
      console.log('删除成功,响应:', result);
      
      // 如果有缓存，从缓存中移除已删除的事件
      if (typeof eventsCache !== 'undefined' && Array.isArray(eventsCache)) {
        eventsCache = eventsCache.filter(event => event.id !== id);
      }
      
      return result;
    } catch (jsonError) {
      console.log('响应不是JSON格式，但请求成功');
      
      // 如果有缓存，从缓存中移除已删除的事件
      if (typeof eventsCache !== 'undefined' && Array.isArray(eventsCache)) {
        eventsCache = eventsCache.filter(event => event.id !== id);
      }
      
      return { success: true, message: 'Event deleted successfully' };
    }
  } catch (error) {
    console.error('Delete event error:', error);
    throw error;
  }
};