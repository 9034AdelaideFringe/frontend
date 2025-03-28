import React from 'react'
import EventCard from './EventCard'
import styles from './EventList.module.css'

const EventList = ({ events, title = "活动列表" }) => {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}

export default EventList