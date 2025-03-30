import React from 'react'
import styles from './Filters.module.css'

const VenueFilter = ({ venues, selectedVenues, onChange }) => {
  const handleVenueChange = (venue) => {
    if (selectedVenues.includes(venue)) {
      onChange(selectedVenues.filter(v => v !== venue));
    } else {
      onChange([...selectedVenues, venue]);
    }
  };

  return (
    <div className={styles.filter}>
      <h3 className={styles.filterTitle}>Venue</h3>
      <div className={styles.checkboxGroup}>
        {venues.map(venue => (
          <label key={venue} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedVenues.includes(venue)}
              onChange={() => handleVenueChange(venue)}
              className={styles.checkbox}
            />
            <span>{venue}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default VenueFilter