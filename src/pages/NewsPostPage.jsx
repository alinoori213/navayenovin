import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { SettingsContext } from '../context/SettingsContext';
import './BlogPostPage.css'; // Reuse styles

const NewsPostPage = () => {
    const { getSetting } = useContext(SettingsContext);
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get(`/news/${id}/`);
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
                setError(getSetting('news_not_found', 'خبر مورد نظر یافت نشد.'));
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id, getSetting]);

    if (loading) return <div className="loading">{getSetting('loading_text', 'در حال بارگذاری...')}</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!news) return null;

    return (
        <div className="blog-post-container">
            <div className="blog-post-header">
                <span className="blog-post-category">{getSetting('news_category', 'اخبار')}</span>
                <h1>{news.title}</h1>
                <div className="blog-post-meta">
                    <span className="date">{new Date(news.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
            </div>

            <div className="blog-post-image">
                {news.image ? (
                    <img src={news.image} alt={news.title} />
                ) : (
                    <div className="placeholder-image">{getSetting('image_placeholder', 'تصویر ندارد')}</div>
                )}
            </div>

            <div className="blog-post-content">
                {news.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            <div className="blog-post-footer">
                <Link to="/news" className="back-btn">{getSetting('back_to_news', 'بازگشت به اخبار')}</Link>
            </div>
        </div>
    );
};

export default NewsPostPage;
