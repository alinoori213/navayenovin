import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { SettingsContext } from '../context/SettingsContext';
import './BlogPage.css'; // Reusing BlogPage styles

const NewsPage = () => {
    const { getSetting } = useContext(SettingsContext);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get('/news/');
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
        return <div className="loading">{getSetting('loading_text', 'در حال بارگذاری...')}</div>;
    }

    return (
        <div className="blog-container">
            <h1>{getSetting('news_title', 'اخبار آموزشگاه')}</h1>
            <div className="posts-grid">
                {news.length > 0 ? (
                    news.map(item => (
                        <div key={item.id} className="post-card">
                            <div className="post-image">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} />
                                ) : (
                                    <div className="placeholder-image">{getSetting('image_placeholder', 'تصویر ندارد')}</div>
                                )}
                            </div>
                            <div className="post-content">
                                <h2>{item.title}</h2>
                                <p className="post-excerpt">{item.content.substring(0, 150)}...</p>
                                <div className="post-meta">
                                    <span className="date">{new Date(item.created_at).toLocaleDateString('fa-IR')}</span>
                                </div>
                                <Link to={`/news/${item.id}`} className="read-more">{getSetting('read_more', 'ادامه مطلب')}</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{getSetting('news_no_news', 'هیچ خبری یافت نشد.')}</p>
                )}
            </div>
        </div>
    );
};

export default NewsPage;
