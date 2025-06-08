import React, { useState, useEffect } from 'react'
import EventList from '../utils/EventList'
import FilterBar from '../components/common/FilterBar'
import VenueFilter from '../components/common/filters/VenueFilter'
import DateFilter from '../components/common/filters/DateFilter'
import PriceFilter from '../components/common/filters/PriceFilter'
import SearchFilter from '../components/common/filters/SearchFilter'
import CapacityFilter from '../components/common/filters/CapacityFilter'; // 确保路径正确

import { getAllEvents } from '../services/eventService'
import { extractVenues, filterEvents } from '../services/filterService'
import styles from './EventsPage.module.css'

const EventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  // filteredEvents 现在将根据所有过滤器和座位可用性进行过滤
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 新增状态：是否只显示 capacity > 0 的活动 (由 CapacityFilter 组件控制)
  const [showCapacityOnly, setShowCapacityOnly] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Available venues
  const [venues, setVenues] = useState([]);

  // Effect to fetch all events
  useEffect(() => {
    console.log('[EventsPage] Fetching all events...');
    getAllEvents()
      .then(data => {
        console.log('[EventsPage] Fetched events:', data);
        setAllEvents(data);
        // Initial filtering will happen in the next useEffect
        setVenues(extractVenues(data));
        setLoading(false);
      })
      .catch(error => {
        console.error('[EventsPage] Error fetching events:', error);
        setLoading(false);
        // 您可能希望在这里设置一个错误状态并显示给用户
      });
  }, []); // 空依赖数组表示只在组件挂载时运行一次

  // Apply filters when any filter state or allEvents changes
  useEffect(() => {
    console.log('[EventsPage] Applying filters...');
    const filters = {
      searchTerm,
      selectedVenues,
      startDate,
      endDate,
      minPrice,
      maxPrice
    };

    // 1. 先应用其他过滤器 (使用现有的 filterEvents 函数)
    const initiallyFiltered = filterEvents(allEvents, filters);

    // 2. 再根据 showCapacityOnly 状态过滤
    const finalFiltered = showCapacityOnly
      ? initiallyFiltered.filter(event => {
          const capacity = parseInt(event.capacity, 10);
          // 只包含 capacity 是有效数字且大于 0 的活动
          return !isNaN(capacity) && capacity > 0;
        })
      : initiallyFiltered; // 如果筛选关闭，显示所有通过其他过滤器的活动

    console.log(`[EventsPage] Filtered down to ${finalFiltered.length} events.`);
    setFilteredEvents(finalFiltered);

  }, [allEvents, searchTerm, selectedVenues, startDate, endDate, minPrice, maxPrice, showCapacityOnly]); // 依赖所有过滤器状态和 allEvents

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedVenues([]);
    setStartDate('');
    setEndDate('');
    setMinPrice(0);
    setMaxPrice(1000);
    // 清除其他过滤器时，不改变 capacity 筛选状态
    // setShowCapacityOnly(false);
  };

  // handleCapacityFilterToggle 函数现在由 CapacityFilter 组件内部处理

  // 在加载完成后，检查是否有符合条件的活动
  const showNoResults = !loading && filteredEvents.length === 0;


  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>All Events</h1>

      <FilterBar>
        <div className={styles.searchAndCapacityFilters}> {/* 假设您在 CSS 中定义了这个类 */}
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <CapacityFilter
                showCapacityOnly={showCapacityOnly}
                onToggle={() => setShowCapacityOnly(!showCapacityOnly)} // 将切换状态的逻辑作为 prop 传递
                disabled={loading} // 将 loading 状态传递给组件以禁用按钮
            />
        </div>

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
          {/* 在加载时显示加载状态，否则显示结果数量 */}
          {loading ? 'Loading...' : `${filteredEvents.length} events found`}
        </div>

        <button
          onClick={handleClearFilters}
          className={styles.clearFiltersBtn}
        >
          Clear Filters
        </button>
      </div>

      {/* 显示未找到结果的消息 */}
      {showNoResults && (
          <div className={styles.noResults}>
            {showCapacityOnly
                ? 'No events with capacity > 0 match your criteria. Try adjusting your filters.'
                : 'No events match your search criteria. Try adjusting your filters.'
            }
          </div>
      )}

      {/* 显示过滤后的活动列表 */}
      {/* 只有在不显示“未找到”消息时才渲染 EventList */}
      {!showNoResults && (
           <EventList events={filteredEvents} title="" />
      )}

    </div>
  )
}

export default EventsPage