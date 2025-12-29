import React, { useState } from 'react'
import './RegisterPage.css'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    course: '',
    level: '',
    preferredTime: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registration data:', formData)
    // اینجا می‌توانید درخواست API برای ثبت نام بفرستید
    alert('ثبت نام شما با موفقیت انجام شد! به زودی با شما تماس خواهیم گرفت.')
  }

  return (
    <div className="register-page">
      <div className="register-hero">
        <div className="register-hero-overlay"></div>
        <h1 className="register-hero-title">ثبت‌نام در دوره‌ها</h1>
        <p className="register-hero-subtitle">سفر موسیقایی خود را با ما شروع کنید</p>
      </div>

      <div className="register-content">
        <div className="register-container">
          <div className="register-info">
            <h2>چرا در نوای نوین ثبت‌نام کنید؟</h2>
            <div className="info-points">
              <div className="info-point">
                <div className="point-icon">✓</div>
                <div>
                  <h4>اساتید مجرب و حرفه‌ای</h4>
                  <p>آموزش با بهترین متدهای روز دنیا</p>
                </div>
              </div>
              
              <div className="info-point">
                <div className="point-icon">✓</div>
                <div>
                  <h4>مدارک معتبر بین‌المللی</h4>
                  <p>آمادگی برای آزمون‌های ABRSM</p>
                </div>
              </div>
              
              <div className="info-point">
                <div className="point-icon">✓</div>
                <div>
                  <h4>محیط حرفه‌ای و دوستانه</h4>
                  <p>جامعه‌ای از علاقه‌مندان موسیقی</p>
                </div>
              </div>
              
              <div className="info-point">
                <div className="point-icon">✓</div>
                <div>
                  <h4>کنسرت‌ها و رویدادها</h4>
                  <p>فرصت اجرا و نمایش توانایی‌ها</p>
                </div>
              </div>
            </div>

            <div className="contact-info-box">
              <h3>اطلاعات تماس</h3>
              <p><strong>تلفن:</strong> 021-12345678</p>
              <p><strong>ایمیل:</strong> navayenovin.ir@gmail.com</p>
              <p><strong>آدرس:</strong> تهران، ایران</p>
            </div>
          </div>

          <div className="register-form-section">
            <div className="form-header">
              <h2>فرم ثبت‌نام</h2>
              <p>لطفاً اطلاعات خود را با دقت وارد کنید</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">سن</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="سن خود را وارد کنید"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">ایمیل *</label>
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

                <div className="form-group">
                  <label htmlFor="phone">شماره تماس *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="course">دوره مورد نظر *</label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="piano">پیانو</option>
                    <option value="vocal">آواز کلاسیک</option>
                    <option value="theory">تئوری موسیقی</option>
                    <option value="solfege">سلفژ</option>
                    <option value="violin">ویولن</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="level">سطح *</label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="beginner">مبتدی</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">پیشرفته</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="preferredTime">زمان ترجیحی کلاس</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="morning">صبح (9-12)</option>
                  <option value="afternoon">عصر (14-17)</option>
                  <option value="evening">شب (17-20)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">توضیحات تکمیلی</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="سوالات یا توضیحات خود را بنویسید..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                ثبت‌نام
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
