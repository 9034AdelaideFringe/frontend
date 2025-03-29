import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { logout, getCurrentUser } from '../../services/authService'
import styles from './UserLayout.module.css'

const UserLayout = () => {
  const location = useLocation();
  const { pathname } = location;
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logout().then(() => {
      window.location.href = '/';
    });
  };
  
  return (
    <div className={styles.userLayout}>
      <header className={styles.userHeader}>
        <div className={styles.headerContainer}>
          <nav className={styles.userNav}>
            <ul>
              <li>
                <Link 
                  to="/user" 
                  className={pathname === '/user' ? styles.active : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/user/tickets" 
                  className={pathname === '/user/tickets' ? styles.active : ''}
                >
                  My Tickets
                </Link>
              </li>
              <li>
                <Link 
                  to="/user/profile" 
                  className={pathname === '/user/profile' ? styles.active : ''}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  to="/user/favorites" 
                  className={pathname === '/user/favorites' ? styles.active : ''}
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className={styles.headerRight}>
            <div className={styles.actionButtons}>
              <Link to="/" className={styles.backToSite}>
                Back to Site
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className={styles.content}>
        <div className={styles.contentHeader}>
          <h1>
            {pathname === '/user' && 'User Dashboard'}
            {pathname === '/user/tickets' && 'My Tickets'}
            {pathname === '/user/profile' && 'Profile Settings'}
            {pathname === '/user/favorites' && 'My Favorites'}
          </h1>
        </div>
        <div className={styles.contentBody}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default UserLayout