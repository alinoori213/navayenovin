import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './Experience.css'

const Experience = () => {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/accounts/teachers/')
        setInstructors(response.data)
      } catch (error) {
        console.error('Error fetching teachers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  if (loading) return null

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

          <div className="instructors-grid">
            {instructors.map((instructor) => (
              <Link to={`/teachers/${instructor.id}`} key={instructor.id} className="instructor-card-link">
                <div className="instructor-card">
                  <div className="instructor-image-wrapper">
                    {instructor.avatar ? (
                      <img src={instructor.avatar} alt={`${instructor.first_name} ${instructor.last_name}`} />
                    ) : (
                      <div className="placeholder-image">تصویر ندارد</div>
                    )}
                  </div>
                  <div className="instructor-info">
                    <h3 className="instructor-name">{instructor.first_name} {instructor.last_name}</h3>
                    <p className="instructor-title">{instructor.bio ? instructor.bio.substring(0, 30) + '...' : 'استاد موسیقی'}</p>
                    <p className="instructor-description">{instructor.bio ? instructor.bio.substring(0, 100) + '...' : ''}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
