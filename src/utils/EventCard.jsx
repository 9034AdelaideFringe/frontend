import React from 'react'
import { Link } from 'react-router-dom'
import styles from './EventCard.module.css'

const EventCard = ({ event }) => {
  const { id, title, abstract, image } = event

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.abstract}>{abstract}</p>
        <Link to={`/events/${id}`} className={styles.link}>
          Learn More
        </Link>
      </div>
    </div>
  )
}

export default EventCard