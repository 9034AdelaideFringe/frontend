import React, { useState, useEffect } from "react"; // 导入 useEffect 和 useState
import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";

// 定义一个包含多种可能图片 URL 格式的数组
// 这些函数接收清理后的路径 (例如 'images/your-image.jpg') 并返回完整的 URL
const imageAttempts = [
  (cleanPath) => `/api/${cleanPath}`, // 尝试 1: 通过 /api 代理路径 (推荐用于部署环境)
  (cleanPath) => `https://23.22.158.203:8080/${cleanPath}`, // 尝试 2: 直接 HTTPS (如果后端支持)
  (cleanPath) => `http://23.22.158.203:8080/${cleanPath}`, // 尝试 3: 直接 HTTP (在 HTTPS 页面会触发混合内容错误，但作为尝试保留)
  (cleanPath) => `/${cleanPath}`, // 尝试 4: 相对根路径
];

// 默认图片 URL，当所有尝试都失败时使用
const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const EventCard = ({ event }) => {
  console.log("event.image:", event.image);
  const { id, title, abstract, image } = event;

  // State 来跟踪当前尝试的 URL 索引
  const [attemptIndex, setAttemptIndex] = useState(0);
  // State 来保存当前正在尝试加载的图片 URL
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // 函数根据尝试索引获取对应的 URL
  const getAttemptUrl = (imagePath, index) => {
    // 如果 imagePath 为空，直接返回默认图片
    if (!imagePath) {
      return DEFAULT_IMAGE_URL;
    }
    // 如果 imagePath 已经是完整的 http 或 https URL，直接返回，不再进行尝试
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // 清理路径，移除开头的 ./ 或 /
    const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\/+/, "");

    // 如果当前尝试索引在有效范围内，使用对应的函数生成 URL
    if (index < imageAttempts.length) {
      return imageAttempts[index](cleanPath);
    }

    // 如果所有尝试都失败了，返回默认图片 URL
    return DEFAULT_IMAGE_URL;
  };

  // 使用 useEffect 在 image 或 attemptIndex 变化时更新 currentImageUrl
  useEffect(() => {
    setCurrentImageUrl(getAttemptUrl(image, attemptIndex));
  }, [image, attemptIndex]); // 依赖 image 和 attemptIndex

  // 图片加载失败时的处理函数
  const handleImageError = () => {
    console.log(`图片加载失败 (尝试 ${attemptIndex + 1}/${imageAttempts.length}): ${currentImageUrl}. 尝试下一个 URL.`);
    // 增加尝试索引，触发下一次尝试
    setAttemptIndex(prevIndex => prevIndex + 1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          style={{
            maxWidth: "100%",
            maxHeight: "400px",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
          // 使用 currentImageUrl 作为图片的 src
          src={currentImageUrl}
          alt={event.title}
          // 在图片加载失败时调用 handleImageError
          onError={handleImageError}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.abstract}>{abstract}</p>
        <Link to={`/events/${id}`} className={styles.link}>
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default EventCard;