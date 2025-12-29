import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import './CoursesPage.css'
import { images } from '../assets/images'

const CoursesPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const teacherFilter = queryParams.get('teacher')

  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('همه')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses/')
        setCourses(response.data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const tags = ['همه', ...new Set(courses.map(c => c.title))]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.includes(searchTerm) || course.description.includes(searchTerm)
    const matchesTag = selectedTag === 'همه' || course.title === selectedTag
    const matchesTeacher = !teacherFilter || (course.teacher && course.teacher.id === parseInt(teacherFilter))
    return matchesSearch && matchesTag && matchesTeacher
  })

  if (loading) return <div className="loading">در حال بارگذاری...</div>

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

      <div className="courses-filter-section">
        <div className="filter-container">
          <input 
            type="text" 
            placeholder="جستجو در کلاس‌ها..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="tags-container">
            {tags.map(tag => (
              <button 
                key={tag} 
                className={`filter-tag ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          {teacherFilter && (
            <div className="active-filter-message">
              نمایش کلاس‌های: <strong>{teacherFilter}</strong>
              <button onClick={() => window.location.href='/courses'} className="clear-filter">×</button>
            </div>
          )}
        </div>
      </div>

      <div className="courses-grid-section">
        <div className="courses-grid-container">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-item">
                <div className="course-image">
                  {course.image ? (
                    <img src={course.image} alt={course.title} />
                  ) : (
                    <div className="placeholder-image">تصویر ندارد</div>
                  )}
                  <div className="course-overlay">
                    <span className="course-tag">{course.title}</span>
                  </div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  {course.teacher && (
                    <p className="course-teacher" style={{color: '#ff2558', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      مدرس: {course.teacher.first_name} {course.teacher.last_name}
                    </p>
                  )}
                  <p>{course.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">کلاسی با این مشخصات یافت نشد.</p>
          )}
        </div>
      </div>


      <div className="why-section">
        {/* ... Rest of the component unchanged ... */}
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
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
