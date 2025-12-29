import React from 'react'
import './CoursesPage.css'
import { images } from '../assets/images'

const CoursesPage = () => {
  const courses = [
    {
      title: 'نوازندگی پیانو',
      description: 'کلاس‌های تخصصی پیانو با بهترین اساتید، همراه با آموزش و تمرین برای آمادگی آزمون‌ بین‌المللی ABRSM.',
      image: images['mainpage4pics3.png'],
      tag: 'نوازندگی پیانو'
    },
    {
      title: 'آواز کلاسیک و سلفژ',
      description: 'آموزش آواز کلاسیک همراه با تمرین‌های سلفژ برای تقویت گوش موسیقایی، همراه با آموزش و تمرین برای آمادگی آزمون‌ بین‌المللی ABRSM.',
      image: images['mainpagefourpics1.jpg'],
      tag: 'آواز کلاسیک'
    },
    {
      title: 'تئوری موسیقی',
      description: 'یادگیری مباحث پایه و پیشرفته تئوری موسیقی و آماده‌سازی هنرجویان برای آزمون‌های بین‌المللی ABRSM.',
      image: images['ourclass.jpg'],
      tag: 'تئوری موسیقی'
    },
    {
      title: 'آواز کلاسیک و سلفژ',
      description: 'آموزش آواز کلاسیک همراه با تمرین‌های سلفژ برای تقویت گوش موسیقایی، همراه با آموزش و تمرین برای آمادگی آزمون‌ بین‌المللی ABRSM.',
      image: images['mainpage2.jpg'],
      tag: 'روز امتحان'
    },
    {
      title: 'ثبت‌نام و دریافت مدرک',
      description: 'همراهی کامل در روند ثبت‌نام و مراحل آزمون‌های بین‌المللی ABRSM تا دریافت مدرک معتبر و رسمی.',
      image: images['sabt.jpg'],
      tag: 'ثبت‌نام'
    }
  ]

  return (
    <div className="courses-page">
      <div className="courses-hero" style={{backgroundImage: `url(${images['ourclass.jpg']})`}}>
        <div className="courses-hero-overlay"></div>
        <h1 className="courses-hero-title">کلاس‌های ما</h1>
      </div>

      <div className="courses-intro">
        <h2 className="intro-title">شروع سفر شما به دنیای موسیقی</h2>
        <p className="intro-subtitle">با ما همراه شوید و تجربه‌ای متفاوت و حرفه‌ای در دنیای موسیقی کلاسیک کسب کنید</p>
      </div>

      <div className="courses-grid-section">
        <div className="courses-grid-container">
          {courses.map((course, index) => (
            <div key={index} className="course-item">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-overlay">
                  <span className="course-tag">{course.tag}</span>
                </div>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="why-section">
        <div className="why-container">
          <h2 className="why-title">چرا نوای نوین</h2>
          <p className="why-description">
            «ما باور داریم یادگیری موسیقی باید تجربه‌ای جذاب و الهام‌بخش باشد، نه فقط کلاس‌های خشک. در نوای نوین تکنواز، مسیر یادگیری شما با همراهی استادان مجرب و فعالیت‌های عملی پر از انرژی و لذت است.»
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <p>همراهی استادان حرفه‌ای و صمیمی</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <p>یادگیری عملی با تمرین و اجرا</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <p>فرصت تجربه موسیقی در کنسرت‌ها و ایونت‌ها</p>
            </div>
          </div>
        </div>
      </div>

      <div className="experience-section">
        <div className="experience-container">
          <h2 className="experience-title">چیزهایی که با ما تجربه می‌کنید</h2>
          <p className="experience-description">
            «در کلاس‌های ما، همه چیز برای رشد شما فراهم است: از یادگیری اصولی تا اجرای زنده و تجربه واقعی موسیقی.»
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">★</div>
              <p>آمادگی برای آزمون‌های بین‌المللی ABRSM</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">★</div>
              <p>تمرین عملی و نمایش توانایی‌ها</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">★</div>
              <p>راهنمایی و حمایت تا رسیدن به مهارت و اعتمادبه‌نفس</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
