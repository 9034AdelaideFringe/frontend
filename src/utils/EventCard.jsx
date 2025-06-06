import React from "react";
import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";
// 导入随机默认图片函数
import { getRandomDefaultImageUrl } from './defaultImages'; // 导入新创建的函数

// 从环境变量读取后端图片的基础URL
const IMAGE_BASE_URL = import.meta.env.VITE_APP_IMAGE_BASE_URL;

const EventCard = ({ event }) => {
  // console.log("event.image:", event.image); // 调试日志可以保留或移除
  const { id, title, abstract, image } = event;

  // 函数根据图片路径获取完整的 URL
  const getImageUrl = (imagePath) => {
    // 如果 imagePath 为空或无效，直接返回一个随机默认图片 URL
    if (!imagePath || typeof imagePath !== 'string') {
        return getRandomDefaultImageUrl(); // 使用随机默认图片
    }

    // 如果已经是完整的 URL，直接返回
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    // 确保 IMAGE_BASE_URL 存在
    if (!IMAGE_BASE_URL) {
        console.error("VITE_APP_IMAGE_BASE_URL is not defined in environment variables.");
        return getRandomDefaultImageUrl(); // 如果基础URL未定义，也返回随机默认图片
    }

    // 移除路径开头的 './' 或 '/'
    const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\/+/, "");

    // 拼接基础URL和清理后的路径
    // 确保基础URL没有尾部斜杠，清理后的路径没有头部斜杠
    const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const finalPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;


    return `${baseUrl}/${finalPath}`; // 拼接完整的图片 URL
  };

  // 获取图片的最终 URL
  const finalImageUrl = getImageUrl(image);


  return (
    <div className={styles.eventCard}>
      <Link to={`/events/${id}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <img
            src={finalImageUrl} // 使用计算出的最终图片 URL
            alt={title || "Event Image"} // 提供 alt 文本
            className={styles.eventImage}
            // 添加 onError 处理器来处理图片加载失败的情况
            onError={(e) => {
              e.target.onerror = null; // 防止无限循环
              e.target.src = getRandomDefaultImageUrl(); // 加载失败时显示随机默认图片
            }}
          />
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.eventTitle}>{title || "Untitled Event"}</h3>
          <p className={styles.eventAbstract}>
            {abstract || "No description available."}
          </p>
          {/* 可以根据需要添加更多事件信息，如日期、地点等 */}
        </div>
      </Link>
    </div>
  );
};

export default EventCard;