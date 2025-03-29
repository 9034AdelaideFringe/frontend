import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { logout } from '../../services/authService'
import styles from './AdminLayout.module.css'

const AdminLayout = () => {
  const location = useLocation();
  const { pathname } = location;
  
  const handleLogout = () => {
    logout().then(() => {
      window.location.href = '/';
    });
  };
  
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>管理控制台</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link 
                to="/admin" 
                className={pathname === '/admin' ? styles.active : ''}
              >
                仪表盘
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/events" 
                className={pathname.includes('/admin/events') ? styles.active : ''}
              >
                活动管理
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/tickets" 
                className={pathname === '/admin/tickets' ? styles.active : ''}
              >
                票务管理
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>退出登录</button>
          <Link to="/" className={styles.backToSite}>返回站点</Link>
        </div>
      </aside>
      
      <main className={styles.content}>
        <header className={styles.contentHeader}>
          <h1>
            {pathname === '/admin' && '仪表盘'}
            {pathname === '/admin/events' && '活动管理'}
            {pathname === '/admin/events/create' && '创建活动'}
            {pathname.includes('/admin/events/edit') && '编辑活动'}
            {pathname === '/admin/tickets' && '票务管理'}
          </h1>
        </header>
        <div className={styles.contentBody}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout