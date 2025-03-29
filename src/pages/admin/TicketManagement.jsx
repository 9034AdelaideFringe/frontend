import React, { useState, useEffect } from 'react'
import styles from './TicketManagement.module.css'

// Mock data for tickets
const mockTickets = [
  { 
    id: '1', 
    eventId: '1', 
    eventName: '马戏团表演',
    customerName: '张三',
    customerEmail: 'zhang@example.com',
    purchaseDate: '2025-02-15',
    quantity: 2,
    totalPrice: '¥200',
    status: 'active'
  },
  { 
    id: '2', 
    eventId: '2', 
    eventName: '爵士音乐节',
    customerName: '李四',
    customerEmail: 'li@example.com',
    purchaseDate: '2025-02-14',
    quantity: 1,
    totalPrice: '¥95',
    status: 'active'
  },
  { 
    id: '3', 
    eventId: '4', 
    eventName: '戏剧表演《夜幕降临》',
    customerName: '王五',
    customerEmail: 'wang@example.com',
    purchaseDate: '2025-02-10',
    quantity: 4,
    totalPrice: '¥340',
    status: 'active'
  },
  { 
    id: '4', 
    eventId: '3', 
    eventName: '当代艺术展',
    customerName: '赵六',
    customerEmail: 'zhao@example.com',
    purchaseDate: '2025-02-05',
    quantity: 3,
    totalPrice: '¥75',
    status: 'used'
  }
];

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // 模拟API加载
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 800);
  }, []);

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus } 
        : ticket
    ));
  };

  // 过滤和搜索票务
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && ticket.status === filter;
  });

  return (
    <div className={styles.ticketManagement}>
      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="搜索票务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filter}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">全部票务</option>
            <option value="active">有效票</option>
            <option value="used">已使用</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
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
                <th>客户姓名</th>
                <th>客户邮箱</th>
                <th>购买日期</th>
                <th>数量</th>
                <th>总价</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id} className={styles[ticket.status]}>
                    <td>{ticket.id}</td>
                    <td>{ticket.eventName}</td>
                    <td>{ticket.customerName}</td>
                    <td>{ticket.customerEmail}</td>
                    <td>{ticket.purchaseDate}</td>
                    <td>{ticket.quantity}</td>
                    <td>{ticket.totalPrice}</td>
                    <td>
                      <span className={`${styles.status} ${styles[ticket.status]}`}>
                        {ticket.status === 'active' && '有效'}
                        {ticket.status === 'used' && '已使用'}
                        {ticket.status === 'cancelled' && '已取消'}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      {ticket.status === 'active' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(ticket.id, 'used')}
                            className={styles.useBtn}
                          >
                            标记已用
                          </button>
                          <button 
                            onClick={() => handleStatusChange(ticket.id, 'cancelled')}
                            className={styles.cancelBtn}
                          >
                            取消
                          </button>
                        </>
                      )}
                      {ticket.status === 'used' && (
                        <button 
                          onClick={() => handleStatusChange(ticket.id, 'active')}
                          className={styles.restoreBtn}
                        >
                          恢复
                        </button>
                      )}
                      {ticket.status === 'cancelled' && (
                        <button 
                          onClick={() => handleStatusChange(ticket.id, 'active')}
                          className={styles.restoreBtn}
                        >
                          恢复
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.noTickets}>
                    没有找到符合条件的票务
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

export default TicketManagement