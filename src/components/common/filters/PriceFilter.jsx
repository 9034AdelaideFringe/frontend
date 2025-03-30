import React from 'react'
import styles from './Filters.module.css'

const PriceFilter = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }) => {
  return (
    <div className={styles.filter}>
      <h3 className={styles.filterTitle}>Price Range</h3>
      <div className={styles.priceInputs}>
        <div className={styles.priceField}>
          <label htmlFor="minPrice">Min:</label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => onMinPriceChange(parseInt(e.target.value))}
            className={styles.priceInput}
            min="0"
          />
        </div>
        <div className={styles.priceField}>
          <label htmlFor="maxPrice">Max:</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(parseInt(e.target.value))}
            className={styles.priceInput}
            min="0"
          />
        </div>
      </div>
    </div>
  )
}

export default PriceFilter