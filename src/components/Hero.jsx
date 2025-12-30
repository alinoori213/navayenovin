import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { SettingsContext } from '../context/SettingsContext'
import './Hero.css'
import { images } from '../assets/images'

const Hero = () => {
  const { getSetting } = useContext(SettingsContext);

  return (
    <section className="hero" id="home" style={{backgroundImage: `url(${images['mainPage1.png']})`}}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{getSetting('home_hero_title', 'آموزشگاه موسیقی نوای نوین')}</h1>
        <p className="hero-subtitle-small">{getSetting('home_hero_subtitle', 'با هدف رشد موسیقی کلاسیک در ایران')}</p>
        <Link to="/courses">
          <button className="hero-button">{getSetting('home_hero_button_text', 'مشاهده کلاس‌ها')}</button>
        </Link>
      </div>
      <div className="hero-quote">
        <div className="quote-icon">"</div>
        <p>{getSetting('home_hero_quote', 'موسیقی، ادبیات قلب است. از جایی شروع می شود که سخن پایان یابد.')}</p>
        <p className="quote-author">{getSetting('home_hero_quote_author', '"آلفونس دو لا مارتین"')}</p>
      </div>
    </section>
  )
}

export default Hero
