import React, { useState, useEffect } from 'react'
import api from '../services/api'
import './LatestPosts.css'

const LatestPosts = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await api.get('/posts/')
        // Take the latest 5 posts
        setPosts(response.data.slice(0, 5))
      } catch (error) {
        console.error('Error fetching latest posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPosts()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (loading) return null
  if (posts.length === 0) return null

  return (
    <section className="latest-posts">
      <div className="latest-posts-container">
        <h2 className="latest-posts-title">آخرین مطالب و اخبار</h2>
        <div className="title-underline"></div>

        <div className="slider-container">
          <button className="slider-btn prev" onClick={prevSlide}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="slider-content">
            <div className="post-card">
              <div className="post-image-wrapper">
                {posts[currentSlide].image ? (
                  <img src={posts[currentSlide].image} alt={posts[currentSlide].title} />
                ) : (
                  <div className="placeholder-image">تصویر ندارد</div>
                )}
                <span className="post-category">مقاله</span>
              </div>
              <div className="post-info">
                <span className="post-date">
                  {new Date(posts[currentSlide].created_at).toLocaleDateString('fa-IR')}
                </span>
                <h3 className="post-title">{posts[currentSlide].title}</h3>
                <p className="post-excerpt">{posts[currentSlide].content.substring(0, 100)}...</p>
                <button className="post-btn">مشاهده</button>
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
          {posts.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestPosts
