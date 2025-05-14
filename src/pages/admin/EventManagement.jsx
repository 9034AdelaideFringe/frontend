import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents, deleteEvent } from '../../services/eventService'
import styles from './EventManagement.module.css'

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setLoading(true);
    getAllEvents()
      .then(response => {
        console.log("原始API响应:", response);
        
        // 处理可能的不同响应格式
        let eventsData;
        if (response && response.data && Array.isArray(response.data)) {
          // 格式为 {data: [...事件数组], message: "ok"}
          eventsData = response.data;
        } else if (Array.isArray(response)) {
          // 格式已经是数组
          eventsData = response;
        } else {
          console.error("意外的API响应格式:", response);
          eventsData = [];
        }
        
        console.log("处理后的事件数据:", eventsData);
        
        // 确保每个事件对象都有event_id字段
        const enhancedEvents = eventsData.map(event => {
          // 如果没有event_id但有id，使用id作为event_id
          if (!event.event_id && event.id) {
            return { ...event, event_id: event.id };
          }
          return event;
        });
        
        setEvents(enhancedEvents);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        alert('Error loading events: ' + (error.message || 'Please try again'));
        setLoading(false);
      });
  }, [refreshTrigger]);
  
  const handleDelete = async (id) => {
    // 添加验证，确保ID不是undefined
    if (!id) {
      console.error("Cannot delete event: Event ID is undefined");
      alert("Cannot delete this event: Missing event ID");
      return;
    }
    
    console.log(`Confirming deletion of event with ID: ${id}`);
    
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        setLoading(true);
        await deleteEvent(id);
        // 刷新事件列表
        setRefreshTrigger(prev => prev + 1);
        alert('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event: ' + (error.message || 'Please try again'));
        setLoading(false);
      }
    }
  };

  // 根据搜索关键词过滤事件
  const filteredEvents = events.filter(event => 
    event && event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.eventManagement}>
      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/admin/events/create" className={styles.createBtn}>
          Create New Event
        </Link>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <tr key={event.event_id}>
                    <td>{event.event_id ? `${event.event_id.substring(0, 8)}...` : 'No ID'}</td>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td>{event.status}</td>
                    <td className={styles.actions}>
                      <Link 
                        to={`/admin/events/edit/${event.event_id}`}
                        className={styles.editBtn}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(event.event_id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noEvents}>
                    No events found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EventManagement