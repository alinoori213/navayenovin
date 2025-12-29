import React from 'react'
import './Courses.css'

const Courses = () => {
  return (
    <section className="courses">
      <div className="courses-container">
        <h2 className="courses-title">کلاس‌های در حال ثبت نام</h2>
        <div className="underline"></div>
        
        <div className="courses-grid">
          <div className="course-card">
            <div className="course-badge">ABRSM</div>
            <h3 className="course-name">Music Theory</h3>
            <p className="course-grade">Grade 1</p>
            
            <div className="course-info">
              <h4 className="course-level">تئوری موسیقی سطح۱</h4>
              <p className="course-description">
                یکشنبه ها ساعت ۱۹-۱۷ به صورت آنلاین برگزار می‌شود.
              </p>
              <button className="course-button">اطلاعات تکمیلی ←</button>
            </div>
          </div>
          
          <div className="course-card">
            <div className="course-badge">ABRSM</div>
            <h3 className="course-name">Music Theory</h3>
            <p className="course-grade">Grade 1</p>
            
            <div className="course-info">
              <h4 className="course-level">تئوری موسیقی سطح۱</h4>
              <p className="course-description">
                جمعه ها ساعت ۱۴-۱۲ به صورت حضوری برگزار می‌شود.
              </p>
              <button className="course-button">اطلاعات تکمیلی ←</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Courses
