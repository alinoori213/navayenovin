import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './BlogPage.css'; // Reusing BlogPage styles

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Assuming news are posts with a specific category or flag
                // For now, fetching all posts as a placeholder
                const response = await api.get('/posts/');
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <div className="loading">در حال بارگذاری...</div>;
    }

    return (
        <div className="blog-container">
            <h1>اخبار آموزشگاه</h1>
            <div className="posts-grid">
                {news.length > 0 ? (
                    news.map(item => (
                        <div key={item.id} className="post-card">
                            <div className="post-image">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} />
                                ) : (
                                    <div className="placeholder-image">تصویر ندارد</div>
                                )}
                            </div>
                            <div className="post-content">
                                <h2>{item.title}</h2>
                                <p className="post-excerpt">{item.content.substring(0, 150)}...</p>
                                <div className="post-meta">
                                    <span className="date">{new Date(item.created_at).toLocaleDateString('fa-IR')}</span>
                                </div>
                                <button className="read-more">ادامه مطلب</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>هیچ خبری یافت نشد.</p>
                )}
            </div>
        </div>
    );
};

export default NewsPage;
