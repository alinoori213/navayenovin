import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css'
import { images } from '../assets/images'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login data:', formData)
    // اینجا می‌توانید درخواست API برای ورود بفرستید
    alert('ورود موفقیت‌آمیز بود!')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-overlay"></div>
          <div className="login-content">
            <div className="logo-section">
              <img src={images['logo.png']} alt="نوای نوین" className="login-logo" />
              <h2>آموزشگاه موسیقی نوای نوین</h2>
            </div>
            <p className="welcome-text">
              به جامعه هنرجویان ما خوش آمدید
            </p>
            <div className="features-list">
              <div className="feature">
                <div className="feature-icon">♪</div>
                <p>دسترسی به مطالب آموزشی</p>
              </div>
              <div className="feature">
                <div className="feature-icon">♫</div>
                <p>پیگیری پیشرفت تحصیلی</p>
              </div>
              <div className="feature">
                <div className="feature-icon">♬</div>
                <p>ارتباط با اساتید</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="form-header">
              <h1>ورود به حساب کاربری</h1>
              <p>برای دسترسی به پنل کاربری خود وارد شوید</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">ایمیل یا نام کاربری</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">رمز عبور</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
                  </svg>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>مرا به خاطر بسپار</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>

              <button type="submit" className="login-btn">
                ورود
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="divider">
                <span>یا</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn google">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  ورود با Google
                </button>
              </div>

              <div className="signup-link">
                حساب کاربری ندارید؟
                <Link to="/register">ثبت‌نام کنید</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
