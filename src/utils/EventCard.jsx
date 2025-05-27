import React from "react"; // 不再需要 useState, useEffect
import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";
import { DEFAULT_IMAGE } from '../services/shared/apiConfig'; // 导入默认图片

// 从环境变量读取后端图片的基础URL
// 注意：如果图片路径不是直接在根目录下，需要调整这里的逻辑
// 例如，如果图片路径是 /static/images/...，这里应该是 import.meta.env.VITE_APP_IMAGE_BASE_URL + '/static'
const IMAGE_BASE_URL = import.meta.env.VITE_APP_IMAGE_BASE_URL; // **从环境变量读取**

const EventCard = ({ event }) => {
  console.log("event.image:", event.image);
  const { id, title, abstract, image } = event;

  // 函数根据图片路径获取完整的 URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return DEFAULT_IMAGE; // 使用导入的默认图片
    }
    // 如果 imagePath 已经是完整的 http 或 https URL，直接返回
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // 清理路径，移除开头的 ./ 或 /
    const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\/+/, "");

    // 拼接基础URL和清理后的路径
    // 确保 IMAGE_BASE_URL 存在，否则可能导致错误
    if (!IMAGE_BASE_URL) {
        console.error("VITE_APP_IMAGE_BASE_URL is not defined in environment variables.");
        return DEFAULT_IMAGE; // 如果环境变量未设置，返回默认图片
    }

    // 确保基础URL没有尾部斜杠，清理后的路径没有头部斜杠，避免双斜杠
    const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const finalPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

    return `${baseUrl}/${finalPath}`;
  };

  const finalImageUrl = getImageUrl(image);

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
          // 直接使用最终计算出的图片 URL
          src={finalImageUrl}
          alt={event.title}
          // 如果图片加载失败，浏览器会自动显示 alt 文本或破损图标
          // 如果需要更复杂的错误处理，可以保留 onError 但逻辑会简化
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