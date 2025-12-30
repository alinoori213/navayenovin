import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { SettingsContext } from '../context/SettingsContext'
import './Navigation.css'
import { images } from '../assets/images'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useContext(AuthContext)
  const { getSetting } = useContext(SettingsContext)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={images['logo.png']} alt="نوای نوین" className="logo-image" />
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={toggleMenu}>{getSetting('nav_home', 'صفحه اصلی')}</Link>
          <Link to="/courses" onClick={toggleMenu}>{getSetting('nav_courses', 'کلاس‌ها')}</Link>
          <Link to="/experience" onClick={toggleMenu}>{getSetting('nav_teachers', 'اساتید')}</Link>
          <Link to="/about" onClick={toggleMenu}>{getSetting('nav_about', 'درباره ما')}</Link>
          <Link to="/blog" onClick={toggleMenu}>{getSetting('nav_blog', 'وبلاگ')}</Link>
          <Link to="/news" onClick={toggleMenu}>{getSetting('nav_news', 'اخبار')}</Link>
          
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile-link" onClick={toggleMenu}>
                <div className="user-avatar">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.username} />
                  ) : (
                    <span>{(user.first_name || user.username || '').charAt(0)}</span>
                  )}
                </div>
                <span className="user-name-text">{user.first_name || user.username}</span>
              </Link>
              
              {(user.is_staff || user.is_teacher) && (
                <a href="https://legatocore.com/management/" className="management-link" target="_blank" rel="noopener noreferrer">
                  پنل مدیریت
                </a>
              )}
              
              <button onClick={logout} className="logout-btn">{getSetting('nav_logout', 'خروج')}</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn" onClick={toggleMenu}>{getSetting('nav_login', 'ورود')}</Link>
              <Link to="/register" className="register-btn" onClick={toggleMenu}>{getSetting('nav_register', 'ثبت نام')}</Link>
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
