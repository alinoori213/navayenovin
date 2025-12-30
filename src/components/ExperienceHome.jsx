import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { SettingsContext } from '../context/SettingsContext'
import './ExperienceHome.css'
import { images } from '../assets/images'

const ExperienceHome = () => {
  const { getSetting } = useContext(SettingsContext);

  return (
    <section className="experience-home" style={{backgroundImage: `url(${images['mainpage2.jpg']})`}}>
      <div className="experience-home-overlay"></div>
      <div className="experience-home-content">
        <h2 className="experience-home-title">{getSetting('home_experience_title', 'با ما دنیای موسیقی را تجربه کنید.')}</h2>
        <p className="experience-home-description">
          {getSetting('home_experience_desc', '«در نوای نوین، یادگیری موسیقی تنها یک آموزش نیست؛ تجربه‌ای است برای رشد الهام و رسیدن به استانداردهای جهانی»')}
        </p>
        <Link to="/about">
          <button className="experience-home-button">{getSetting('home_experience_button', 'درباره ما ←')}</button>
        </Link>
      </div>
    </section>
  )
}

export default ExperienceHome
