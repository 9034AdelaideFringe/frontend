import React from 'react'
import styles from './FilterBar.module.css'

const FilterBar = ({ children }) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterBarContent}>
        {children}
      </div>
    </div>
  )
}

export default FilterBar