import React, { useState, useEffect } from 'react'
import EventList from '../utils/EventList'
import FilterBar from '../components/common/FilterBar'
import VenueFilter from '../components/common/filters/VenueFilter'
import DateFilter from '../components/common/filters/DateFilter'
import PriceFilter from '../components/common/filters/PriceFilter'
import SearchFilter from '../components/common/filters/SearchFilter'
import { getAllEvents } from '../services/eventService'
import { extractVenues, filterEvents } from '../services/filterService'
import styles from './EventsPage.module.css'

const EventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  
  // Available venues
  const [venues, setVenues] = useState([]);
  
  useEffect(() => {
    // Get all event data
    getAllEvents()
      .then(data => {
        setAllEvents(data);
        setFilteredEvents(data);
        setVenues(extractVenues(data));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);
  
  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {
      searchTerm,
      selectedVenues,
      startDate,
      endDate,
      minPrice,
      maxPrice
    };
    
    const filtered = filterEvents(allEvents, filters);
    setFilteredEvents(filtered);
  }, [allEvents, searchTerm, selectedVenues, startDate, endDate, minPrice, maxPrice]);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedVenues([]);
    setStartDate('');
    setEndDate('');
    setMinPrice(0);
    setMaxPrice(1000);
  };

  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>All Events</h1>
      
      <FilterBar>
        <SearchFilter 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <VenueFilter 
          venues={venues}
          selectedVenues={selectedVenues}
          onChange={setSelectedVenues}
        />
        
        <DateFilter 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        
        <PriceFilter 
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />
      </FilterBar>
      
      <div className={styles.filterControls}>
        <div className={styles.resultsCount}>
          {!loading && `${filteredEvents.length} events found`}
        </div>
        <button 
          onClick={handleClearFilters}
          className={styles.clearFiltersBtn}
        >
          Clear Filters
        </button>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        filteredEvents.length > 0 ? (
          <EventList events={filteredEvents} title="" />
        ) : (
          <div className={styles.noResults}>
            No events match your search criteria. Try adjusting your filters.
          </div>
        )
      )}
    </div>
  )
}

export default EventsPage