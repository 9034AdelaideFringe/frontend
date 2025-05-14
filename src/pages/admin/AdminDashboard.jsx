import React, { useState, useEffect } from 'react'
import { getAllEvents } from '../../services/eventService'
import { getTicketAnalytics } from '../../services/ticketService'
import styles from './AdminDashboard.module.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    activeTickets: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  
  // 存储分析数据
  const [venueData, setVenueData] = useState([]);
  const [salesData, setSalesData] = useState({ labels: [], tickets: [], revenues: [] });
  const [events, setEvents] = useState([]);

  // 根据选择的时间范围获取数据
  const loadDataByTimeRange = (range) => {
    setTimeRange(range);
    setLoading(true);
    
    getTicketAnalytics(range)
      .then(data => {
        setSalesData(data.salesData);
        
        // 更新票务和收入统计数据
        setStats(prevStats => ({
          ...prevStats,
          activeTickets: data.stats.activeTickets,
          totalRevenue: data.stats.totalRevenue
        }));
        
        // 根据时间范围过滤事件并计算场地数据
        calculateVenueEventData(range);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      });
  };
  
  // 计算各个场地的活动数量
  const calculateVenueEventData = (range) => {
    // 根据timeRange过滤事件
    const now = new Date();
    let startDate;
    
    switch(range) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    // 过滤选定时间范围内的事件
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.startRaw || event.start);
      return eventDate >= startDate && eventDate <= now;
    });
    
    // 按场地分组，计算每个场地的活动数量
    const venueCountMap = {};
    
    filteredEvents.forEach(event => {
      const venue = event.venue;
      if (!venueCountMap[venue]) {
        venueCountMap[venue] = {
          venue: venue,
          count: 0,
          revenue: 0 // 可以通过票务数据来补充
        };
      }
      venueCountMap[venue].count += 1;
    });
    
    // 转换为数组并排序
    const venueEventData = Object.values(venueCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // 只返回前8个场馆
    
    setVenueData(venueEventData);
  };

  useEffect(() => {
    // 获取事件数据计算统计信息
    getAllEvents()
      .then(eventsData => {
        setEvents(eventsData);
        
        const today = new Date();
        const upcoming = eventsData.filter(event => {
          const eventStartDate = new Date(event.startRaw || event.start);
          return eventStartDate > today;
        });

        // 加载分析数据
        getTicketAnalytics(timeRange)
          .then(data => {
            // 设置仪表盘统计信息
            setStats({
              totalEvents: eventsData.length,
              upcomingEvents: upcoming.length,
              activeTickets: data.stats.activeTickets,
              totalRevenue: data.stats.totalRevenue
            });
            
            setSalesData(data.salesData);
            
            // 计算场地活动数据
            calculateVenueEventData(timeRange);
            
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching analytics data:', error);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching events data:', error);
        setLoading(false);
      });
  }, []);

  // 渲染场馆热度图表（基于活动数量）
  const renderVenueHeatMap = () => {
    if (!venueData.length) {
      return <div className={styles.noData}>No venue data available for the selected time period</div>;
    }
    
    return (
      <div className={styles.chartContainer}>
        <div className={styles.venueHeatMap}>
          {venueData.map((item, index) => (
            <div key={index} className={styles.venueBar}>
              <div className={styles.venueName}>{item.venue}</div>
              <div className={styles.venueBarContainer}>
                <div 
                  className={styles.venueBarFill} 
                  style={{ 
                    width: `${(item.count / Math.max(...venueData.map(v => v.count))) * 100}%`,
                    backgroundColor: `hsl(${220 - (item.count / Math.max(...venueData.map(v => v.count)) * 60)}, 70%, 60%)`
                  }}
                >
                  <span className={styles.venueCount}>{item.count} events</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染销售数据折线图
  const renderSalesChart = () => {
    const { labels, tickets, revenues } = salesData;
    
    if (!tickets.length || !revenues.length) {
      return <div className={styles.noData}>No sales data available for the selected time period</div>;
    }
    
    const maxTickets = Math.max(...tickets);
    const maxRevenue = Math.max(...revenues);
    
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <span className={styles.ticketDot}></span>
            <span>Ticket Sales</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.revenueDot}></span>
            <span>Revenue</span>
          </div>
        </div>
        <div className={styles.lineChartContainer}>
          {/* Y轴标签 - Revenue左侧 */}
          <div className={styles.yAxisLeft}>
            <div className={styles.yAxisRevenue}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.yAxisLabel}>
                  ${Math.round(maxRevenue - (i * (maxRevenue / 4))).toLocaleString()}
                </div>
              ))}
              <div className={styles.yAxisTitle}>Revenue</div>
            </div>
          </div>
          
          {/* 图表主体 */}
          <div className={styles.lineChart}>
            {/* 绘制网格线 */}
            <div className={styles.chartGrid}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.gridLine} style={{ bottom: `${(i * 25)}%` }}></div>
              ))}
            </div>
            
            // 绘制票务折线
            <svg className={styles.chartSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={tickets.map((count, index) => {
                  const x = (index / (tickets.length - 1)) * 100;
                  const y = 100 - ((count / maxTickets) * 100);
                  return `${x},${y}`;
                }).join(' ')}
                className={styles.ticketLine}
              />
              {tickets.map((count, index) => (
                <circle
                  key={index}
                  cx={index / (tickets.length - 1) * 100}
                  cy={100 - ((count / maxTickets) * 100)}
                  r="4"
                  fill="var(--chart-ticket-color)"
                  stroke="white"
                  strokeWidth="1"
                />
              ))}
            </svg>
            
            // 绘制收入折线
            <svg className={styles.chartSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={revenues.map((revenue, index) => {
                  const x = (index / (revenues.length - 1)) * 100;
                  const y = 100 - ((revenue / maxRevenue) * 100);
                  return `${x},${y}`;
                }).join(' ')}
                className={styles.revenueLine}
              />
              {revenues.map((revenue, index) => (
                <circle
                  key={index}
                  cx={index / (revenues.length - 1) * 100}
                  cy={100 - ((revenue / maxRevenue) * 100)}
                  r="4"
                  fill="var(--chart-revenue-color)"
                  stroke="white"
                  strokeWidth="1"
                />
              ))}
            </svg>
            
            {/* X轴标签 */}
            <div className={styles.xAxis}>
              {labels.map((label, index) => (
                index % Math.ceil(labels.length / 10) === 0 && (
                  <div 
                    key={index} 
                    className={styles.xAxisLabel}
                    style={{ left: `${(index / (labels.length - 1)) * 100}%` }}
                  >
                    {label}
                  </div>
                )
              ))}
            </div>
          </div>
          
          {/* Y轴标签 - Tickets右侧 */}
          <div className={styles.yAxisRight}>
            <div className={styles.yAxisTickets}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.yAxisLabel}>
                  {Math.round(maxTickets - (i * (maxTickets / 4)))}
                </div>
              ))}
              <div className={styles.yAxisTitle}>Tickets</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Events</h3>
              <div className={styles.statValue}>{stats.totalEvents}</div>
            </div>
            <div className={styles.statCard}>
              <h3>Upcoming Events</h3>
              <div className={styles.statValue}>{stats.upcomingEvents}</div>
            </div>
            <div className={styles.statCard}>
              <h3>Active Tickets</h3>
              <div className={styles.statValue}>{stats.activeTickets}</div>
            </div>
            <div className={styles.statCard}>
              <h3>Total Revenue</h3>
              <div className={styles.statValue}>${stats.totalRevenue.toLocaleString()}</div>
            </div>
          </div>

          <div className={styles.analyticsSection}>
            <div className={styles.analyticHeader}>
              <h2 className={styles.sectionTitle}>Business Analytics</h2>
              <div className={styles.timeFilter}>
                <button 
                  className={`${styles.timeFilterBtn} ${timeRange === 'week' ? styles.active : ''}`} 
                  onClick={() => loadDataByTimeRange('week')}
                >
                  This Week
                </button>
                <button 
                  className={`${styles.timeFilterBtn} ${timeRange === 'month' ? styles.active : ''}`} 
                  onClick={() => loadDataByTimeRange('month')}
                >
                  This Month
                </button>
                <button 
                  className={`${styles.timeFilterBtn} ${timeRange === 'year' ? styles.active : ''}`} 
                  onClick={() => loadDataByTimeRange('year')}
                >
                  This Year
                </button>
              </div>
            </div>
            
            <div className={styles.analyticCharts}>
              <div className={styles.chartBox}>
                <h3 className={styles.chartTitle}>Popular Venues</h3>
                {renderVenueHeatMap()}
              </div>
              
              <div className={styles.chartBox}>
                <h3 className={styles.chartTitle}>Sales & Revenue Trends</h3>
                {renderSalesChart()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard