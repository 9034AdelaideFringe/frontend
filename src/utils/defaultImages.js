// 定义一个包含多个默认图片URL的数组
// 你可以根据需要替换或添加更多图片URL
const DEFAULT_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1724753996107-a35012f43bae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1517457210348-cf2cf7c6a34e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // 添加更多默认图片URL...
];

/**
 * 从默认图片URL列表中随机选择一个URL
 * @returns {string} 随机选择的默认图片URL
 */
export const getRandomDefaultImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGE_URLS.length);
  return DEFAULT_IMAGE_URLS[randomIndex];
};