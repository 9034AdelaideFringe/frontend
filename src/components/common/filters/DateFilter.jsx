import React from 'react'
import styles from './Filters.module.css'

const DateFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className={styles.filter}>
      <h3 className={styles.filterTitle}>Date Range</h3>
      <div className={styles.dateInputs}>
        <div className={styles.dateField}>
          <label htmlFor="startDate">From:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.dateField}>
          <label htmlFor="endDate">To:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </div>
    </div>
  )
}

export default DateFilter