import React, { useState } from 'react'
import './Experience.css'
import { images } from '../assets/images'

const Experience = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const instructors = [
    {
      name: 'استاد احمد رضایی',
      title: 'متخصص پیانو کلاسیک',
      description: 'با بیش از 15 سال تجربه در تدریس پیانو و دارای مدرک ABRSM درجه 8، استاد رضایی با روش‌های نوین آموزشی، هنرجویان را به سطوح بین‌المللی می‌رساند.',
      image: images['mainpagefourpics1.jpg']
    },
    {
      name: 'استاد سارا محمدی',
      title: 'استاد تئوری موسیقی',
      description: 'فارغ‌التحصیل از کنسرواتوار تهران و دارای مدرک تدریس از انگلستان، استاد محمدی در زمینه تئوری موسیقی و سلفژ تخصص دارد.',
      image: images['mainpagefourpics2.png']
    },
    {
      name: 'استاد علی کریمی',
      title: 'استاد ویولن و ارکستر',
      description: 'عضو ارکستر سمفونیک تهران و دارای سابقه تدریس در موسسات معتبر بین‌المللی، استاد کریمی در آموزش ویولن و موسیقی مجموعه‌ای پیشرو است.',
      image: images['mainpage4pics3.png']
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % instructors.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + instructors.length) % instructors.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section className="experience">
      <div className="experience-hero">
        <div className="experience-hero-overlay"></div>
        <h1 className="experience-hero-title">اساتید ما</h1>
      </div>

      <div className="instructors-section">
        <div className="instructors-container">
          <h2 className="instructors-title">با اساتید مجرب ما آشنا شوید</h2>
          <div className="title-underline"></div>

          <div className="slider-container">
            <button className="slider-btn prev" onClick={prevSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="slider-content">
              <div className="instructor-card">
                <div className="instructor-image-wrapper">
                  <img src={instructors[currentSlide].image} alt={instructors[currentSlide].name} />
                </div>
                <div className="instructor-info">
                  <h3 className="instructor-name">{instructors[currentSlide].name}</h3>
                  <p className="instructor-title">{instructors[currentSlide].title}</p>
                  <p className="instructor-description">{instructors[currentSlide].description}</p>
                </div>
              </div>
            </div>

            <button className="slider-btn next" onClick={nextSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="slider-dots">
            {instructors.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
