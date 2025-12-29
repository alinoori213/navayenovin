import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import './TeacherDetailPage.css'
import { images } from '../assets/images'

const TeacherDetailPage = () => {
  const { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await api.get(`/accounts/teachers/`)
        // Filter locally for now since we don't have a detail endpoint yet or use existing list
        // Assuming API might not support detail view by ID directly yet, or we use list and find
        // Better to use detail endpoint if available. Let's assume we can filter from the list for now
        // or just fetch all and find. 
        // Ideally: api.get(`/accounts/teachers/${id}/`)
        // Let's try to find from the list as the previous step showed list view.
        
        const foundTeacher = response.data.find(t => t.id === parseInt(id))
        setTeacher(foundTeacher)
      } catch (error) {
        console.error('Error fetching teacher details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacher()
  }, [id])

  if (loading) return <div className="loading">در حال بارگذاری...</div>
  if (!teacher) return <div className="error">استاد مورد نظر یافت نشد.</div>

  return (
    <div className="teacher-detail-page">
      <div className="teacher-hero" style={{backgroundImage: `url(${images['ourclass.jpg']})`}}>
        <div className="teacher-overlay"></div>
        <h1 className="teacher-hero-title">{teacher.first_name} {teacher.last_name}</h1>
      </div>

      <div className="teacher-content">
        <div className="teacher-profile">
          <div className="teacher-image-large">
            {teacher.avatar ? (
              <img src={teacher.avatar} alt={`${teacher.first_name} ${teacher.last_name}`} />
            ) : (
              <div className="placeholder-image-large">تصویر ندارد</div>
            )}
          </div>
          <div className="teacher-info-main">
            <h2>درباره {teacher.first_name} {teacher.last_name}</h2>
            <p className="teacher-bio">{teacher.bio || 'توضیحات درباره استاد به زودی اضافه می‌شود.'}</p>
            
            <Link to={`/courses?teacher=${teacher.id}&teacherName=${encodeURIComponent(teacher.first_name + ' ' + teacher.last_name)}`}>
              <button className="view-classes-btn">مشاهده کلاس‌ها</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDetailPage
