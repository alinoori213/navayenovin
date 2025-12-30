import React, { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import './About.css'
import { images } from '../assets/images'

const About = () => {
  const { getSetting } = useContext(SettingsContext);

  return (
    <section className="about">
      <div className="about-hero" style={{backgroundImage: `url(${images['mainpage2.jpg']})`}}>
        <div className="about-overlay"></div>
        <h1 className="about-hero-title">{getSetting('about_hero_title', 'درباره آموزشگاه')}</h1>
      </div>

      <div className="about-content">
        <div className="about-container">
          <div className="about-text">
            <h2 className="about-title">{getSetting('about_mission_title', 'ماموریت ما')}</h2>
            <div className="title-underline"></div>
            
            <p className="about-description">
              {getSetting('about_mission_desc_1', 'ما در نوای نوین تلاش میکنیم موسیقی را با بهترین کیفیت آموزش ارائه دهیم، با تمرکز ویژه بر موسیقی کلاسیک و استانداردهای جهانی.')}
            </p>
            
            <p className="about-description">
              {getSetting('about_mission_desc_2', 'هدف ما این است که هنرجویان نه‌تنها موسیقی را یاد بگیرند، بلکه آن را زندگی کنند و در مسیر رشد شخصی و هنرمندان به جایگاهی برسند که بتوانند در ایران و جهان بدرخشند.')}
            </p>
          </div>

          <div className="about-image">
            <img src={images['mainPagefourpics4.jpg']} alt="درباره ما" />
          </div>
        </div>

        <div className="about-experience-section">
          <h2 className="section-title">{getSetting('about_experience_title', 'تجربه‌های ویژه')}</h2>
          <div className="title-underline"></div>
          <p className="section-intro">{getSetting('about_experience_intro', 'در نوای نوین، یادگیری موسیقی فقط به کلاس محدود نمی‌شود.')}</p>
          <p className="section-description">
            {getSetting('about_experience_desc', 'ما تجربه‌ای کامل و الهام‌بخش برای هنرجویان می‌سازیم؛ آموزش با متدهای روز دنیا و آمادگی برای آزمون‌های بین‌المللی مانند ABRSM، کلاس‌ها و کارگاه‌های تخصصی با همکاری استادان برجسته، اجرای کنسرت‌های هنرجویی برای نمایش توانایی‌ها و افزایش اعتمادبه‌نفس، و دورهمی‌ها و ایونت‌های موسیقی برای ایجاد یک جامعه صمیمی و حرفه‌ای، همه بخشی از مسیر یادگیری ما هستند.')}
          </p>
        </div>

        <div className="about-values-section">
          <h2 className="section-title">{getSetting('about_values_title', 'ارزش‌های ما')}</h2>
          <div className="title-underline"></div>
          <p className="section-intro">{getSetting('about_values_intro', 'در مسیر آموزش، ما بر ارزش‌هایی پایبندیم که هویت آموزشگاه ما را می‌سازند:')}</p>
          
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>{getSetting('about_value_1', 'کیفیت در آموزش')}</h4>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>{getSetting('about_value_2', 'استانداردهای جهانی')}</h4>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>{getSetting('about_value_3', 'تعهد به رشد هنری')}</h4>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>{getSetting('about_value_4', 'ایجاد جامعه موسیقایی')}</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
