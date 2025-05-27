import React from "react";
import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";

const EventCard = ({ event }) => {
  console.log("event.image:", event.image);
  const { id, title, abstract, image } = event;
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  }
  // 如果已经是完整的http/https URL，直接返回
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // 移除开头的 ./ 或 /，然后通过 /api 代理路径请求
  const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\/+/, "");
  return `/api/${cleanPath}`; // 修改为通过代理请求
};

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* <img src={image} alt={title} className={styles.image} /> */}
        <img
          style={{
            maxWidth: "100%",
            maxHeight: "400px",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
          src={getImageUrl(event.image)}
          alt={event.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
          }}
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
