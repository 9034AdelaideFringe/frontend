import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents } from '../../services/eventService'
import styles from './EventManagement.module.css'

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个活动吗？此操作不可逆。')) {
      // 这里应该调用实际的删除API
      console.log('删除活动ID:', id);
      // 临时从UI中移除
      setEvents(events.filter(event => event.id !== id));
    }
  };

  // 过滤事件
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.eventManagement}>
      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="搜索活动..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/admin/events/create" className={styles.createBtn}>
          创建新活动
        </Link>
      </div>
      
      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>活动名称</th>
                <th>日期</th>
                <th>场地</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td className={styles.actions}>
                      <Link 
                        to={`/admin/events/edit/${event.id}`}
                        className={styles.editBtn}
                      >
                        编辑
                      </Link>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className={styles.deleteBtn}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noEvents}>
                    没有找到符合条件的活动
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