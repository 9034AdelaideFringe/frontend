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
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        alert('Error loading events: ' + (error.message || 'Please try again'));
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
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
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <tr key={event.id}>
                    <td>{event.id.substring(0, 8)}...</td>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td>{event.status}</td>
                    <td className={styles.actions}>
                      <Link 
                        to={`/admin/events/edit/${event.id}`}
                        className={styles.editBtn}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(event.id)}
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