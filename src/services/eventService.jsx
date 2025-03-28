// 模拟事件数据
const events = [
  {
    id: '1',
    title: '马戏团表演',
    abstract: '世界顶级杂技团带来的惊险刺激的马戏表演，包括高空飞人、魔术表演等精彩节目。',
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: '这是一场不容错过的视觉盛宴！世界顶级杂技团将带来一系列惊险刺激的马戏表演，包括高空飞人、魔术表演、小丑表演等精彩节目。适合全家观看，保证让您惊叹不已！',
    date: '2025-03-10',
    time: '19:30',
    venue: '阿德莱德艺术中心',
    price: '40-120'
  },
  {
    id: '2',
    title: '爵士音乐节',
    abstract: '汇集了来自全球的爵士音乐大师，带来一场听觉盛宴。',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: '这场爵士音乐节汇集了来自全球的爵士音乐大师，将带来一场难忘的听觉盛宴。无论您是资深爵士乐迷还是新手，都能在这里找到心仪的表演。现场乐队演奏，即兴创作，让您体验爵士乐的魅力！',
    date: '2025-03-15',
    time: '18:00',
    venue: '阿德莱德植物园',
    price: '55-95'
  },
  {
    id: '3',
    title: '当代艺术展',
    abstract: '展示当地和国际艺术家的前卫作品，探索现代社会的议题。',
    image: 'https://images.unsplash.com/photo-1594796582908-71d3b16c8afd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: '这场当代艺术展将展示当地和国际艺术家的前卫作品，主题围绕探索现代社会的各种议题。展览包括装置艺术、多媒体作品、绘画和雕塑等多种形式。特别设有互动区域，观众可以参与艺术创作。',
    date: '2025-03-01 - 2025-03-20',
    time: '10:00 - 18:00',
    venue: '阿德莱德现代艺术馆',
    price: '25'
  },
  {
    id: '4',
    title: '戏剧表演《夜幕降临》',
    abstract: '获奖剧团带来的一部关于家庭和记忆的感人戏剧。',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: '获奖剧团带来的一部关于家庭和记忆的感人戏剧。故事讲述了一个家庭如何面对失去和重新连接的过程。演员阵容包括多位国际知名演员，舞台设计新颖独特，将带给观众一场视觉和情感的双重震撼。',
    date: '2025-03-08',
    time: '19:00',
    venue: '皇家剧院',
    price: '35-85'
  },
  {
    id: '5',
    title: '街头美食节',
    abstract: '品尝来自世界各地的美食，体验不同文化的味蕾之旅。',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: '在这个街头美食节上，您可以品尝来自世界各地的美食，体验一场不同文化的味蕾之旅。有超过50个摊位，提供各种美食、饮料和甜点。还有现场音乐表演和烹饪示范，让您在享用美食的同时获得更多乐趣。',
    date: '2025-03-12 - 2025-03-14',
    time: '11:00 - 22:00',
    venue: '维多利亚广场',
    price: '免费入场，食品另计'
  },
  {
    id: '6',
    title: '喜剧之夜',
    abstract: '一晚笑声不断的喜剧表演，多位著名脱口秀艺人轮番上阵。',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: '准备好大笑一晚上吧！这场喜剧之夜将有多位著名脱口秀艺人轮番上阵，带来最新、最搞笑的段子。从讽刺时事到生活趣事，各种笑料不断，保证让你笑到肚子疼。',
    date: '2025-03-18',
    time: '20:00',
    venue: '笑果俱乐部',
    price: '30'
  }
];

// 获取所有事件
export const getAllEvents = () => {
  return Promise.resolve(events);
};

// 获取热门事件（这里简单返回前3个作为示例）
export const getFeaturedEvents = () => {
  return Promise.resolve(events.slice(0, 3));
};

// 根据ID获取单个事件
export const getEventById = (id) => {
  const event = events.find(event => event.id === id);
  if (event) {
    return Promise.resolve(event);
  }
  return Promise.reject(new Error('Event not found'));
};