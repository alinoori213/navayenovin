import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { SettingsContext } from '../context/SettingsContext'
import './TeacherDetailPage.css'
import { images } from '../assets/images'

const TeacherDetailPage = () => {
  const { getSetting } = useContext(SettingsContext)
  const { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await api.get(`/teachers/${id}/`)
        setTeacher(response.data)
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
            <h2>{getSetting('teacher_detail_about_prefix', 'درباره')} {teacher.first_name} {teacher.last_name}</h2>
            <p className="teacher-bio">{teacher.bio || getSetting('teacher_detail_default_bio', 'توضیحات درباره استاد به زودی اضافه می‌شود.')}</p>
            
            <Link to={`/courses?teacher=${teacher.id}&teacherName=${encodeURIComponent(teacher.first_name + ' ' + teacher.last_name)}`}>
              <button className="view-classes-btn">{getSetting('teacher_detail_view_classes', 'مشاهده کلاس‌ها')}</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDetailPage
