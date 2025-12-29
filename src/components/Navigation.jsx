import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Navigation.css'
import logo from '../assets/logo.png'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useContext(AuthContext)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="نوای نوین" className="logo-image" />
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={toggleMenu}>صفحه اصلی</Link>
          <Link to="/courses" onClick={toggleMenu}>کلاس‌ها</Link>
          <Link to="/about" onClick={toggleMenu}>درباره ما</Link>
          <Link to="/blog" onClick={toggleMenu}>وبلاگ</Link>
          <Link to="/news" onClick={toggleMenu}>اخبار</Link>
          
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.first_name || user.username} خوش آمدید</span>
              <button onClick={logout} className="logout-btn">خروج</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn" onClick={toggleMenu}>ورود</Link>
              <Link to="/register" className="register-btn" onClick={toggleMenu}>ثبت نام</Link>
            </div>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
