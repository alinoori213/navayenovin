import React from 'react'
import './Events.css'
import { images } from '../assets/images'

const Events = () => {
  return (
    <section className="events">
      <div className="events-container">
        <h2 className="events-title">رویدادهای پیش رو</h2>
        <div className="underline"></div>
        
        <div className="events-grid">
          <div className="event-card">
            <div className="event-image" style={{backgroundImage: `url(${images['mainpagefourpics1.jpg']})`}}>
              <div className="event-overlay"></div>
            </div>
            <div className="event-content">
              <h3 className="event-name">دورهمی موسیقی کلاسیک</h3>
            </div>
          </div>
          
          <div className="event-card">
            <div className="event-image" style={{backgroundImage: `url(${images['mainpagefourpics2.png']})`}}>
              <div className="event-overlay"></div>
            </div>
            <div className="event-content">
              <h3 className="event-name">دورهمی هنرجویان نوای نوین</h3>
            </div>
          </div>

          <div className="event-card">
            <div className="event-image" style={{backgroundImage: `url(${images['mainpage4pics3.png']})`}}>
              <div className="event-overlay"></div>
            </div>
            <div className="event-content">
              <h3 className="event-name">شروع کلاس‌های تاریخ موسیقی</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Events
