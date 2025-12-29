import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import { images } from '../assets/images'

const Hero = () => {
  return (
    <section className="hero" id="home" style={{backgroundImage: `url(${images['mainPage1.png']})`}}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">آموزشگاه موسیقی نوای نوین</h1>
        <p className="hero-subtitle-small">با هدف رشد موسیقی کلاسیک در ایران</p>
        <Link to="/courses">
          <button className="hero-button">مشاهده کلاس‌ها</button>
        </Link>
      </div>
      <div className="hero-quote">
        <div className="quote-icon">"</div>
        <p>موسیقی، ادبیات قلب است. از جایی شروع می شود که سخن پایان یابد.</p>
        <p className="quote-author">"آلفونس دو لا مارتین"</p>
      </div>
    </section>
  )
}

export default Hero
