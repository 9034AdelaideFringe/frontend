import React from 'react'
import styles from './Filters.module.css'

const SearchFilter = ({ searchTerm, onSearchChange }) => {
  return (
    <div className={styles.filter}>
      <h3 className={styles.filterTitle}>Search</h3>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  )
}

export default SearchFilter