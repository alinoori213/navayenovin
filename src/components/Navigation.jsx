import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'
import { images } from '../assets/images'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={images['logo.png']} alt="نوای نوین" className="logo-image" />
        </Link>
        
        <ul className="nav-menu">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>صفحه اصلی</Link></li>
          <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>درباره ما</Link></li>
          <li><Link to="/courses" className={location.pathname === '/courses' ? 'active' : ''}>کلاس‌ها / دوره‌ها</Link></li>
          <li><Link to="/experience" className={location.pathname === '/experience' ? 'active' : ''}>معرفی اساتید</Link></li>
          <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>تماس با ما</Link></li>
        </ul>
        
        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-button">ورود</button>
          </Link>
          <Link to="/register">
            <button className="cta-button">ثبت‌نام</button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
