import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Adelaide Fringe</Link>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
