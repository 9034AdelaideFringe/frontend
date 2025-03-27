import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to Adelaide Fringe</h1>
      <p>Discover amazing events and performances.</p>
      <div className="action-buttons">
        <Link to="/events" className="btn btn-primary">Browse Events</Link>
      </div>
    </div>
  )
}

export default HomePage
