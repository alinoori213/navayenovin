import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { SettingsContext } from '../context/SettingsContext'
import './Courses.css'

const Courses = () => {
  const { getSetting } = useContext(SettingsContext)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses/')
        setCourses(response.data.slice(0, 3)) // Get first 3 courses
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) return null

  return (
    <section className="courses">
      <div className="courses-container">
        <h2 className="courses-title">{getSetting('home_courses_title', 'کلاس‌های در حال ثبت نام')}</h2>
        <div className="underline"></div>
        
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-badge">{course.title.split(' ')[0]}</div>
              <h3 className="course-name">{course.title}</h3>
              
              <div className="course-info">
                <h4 className="course-level">{course.title}</h4>
                <p className="course-description">
                  {course.description.substring(0, 100)}...
                </p>
                <Link to="/courses">
                  <button className="course-button">{getSetting('course_more_info_button', 'اطلاعات تکمیلی')} ←</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courses
