import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { SettingsContext } from '../context/SettingsContext';
import './BlogPostPage.css';

const BlogPostPage = () => {
    const { getSetting } = useContext(SettingsContext);
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}/`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
                setError(getSetting('post_not_found', 'مطلب مورد نظر یافت نشد.'));
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, getSetting]);

    if (loading) return <div className="loading">{getSetting('loading_text', 'در حال بارگذاری...')}</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!post) return null;

    return (
        <div className="blog-post-container">
            <div className="blog-post-header">
                <span className="blog-post-category">{post.category_name || getSetting('default_category', 'مقاله')}</span>
                <h1>{post.title}</h1>
                <div className="blog-post-meta">
                    <span className="author">{getSetting('post_author_prefix', 'نویسنده:')} {post.author.first_name || post.author.username}</span>
                    <span className="date">{new Date(post.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
            </div>

            <div className="blog-post-image">
                {post.image ? (
                    <img src={post.image} alt={post.title} />
                ) : (
                    <div className="placeholder-image">{getSetting('image_placeholder', 'تصویر ندارد')}</div>
                )}
            </div>

            <div className="blog-post-content">
                {post.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            <div className="blog-post-footer">
                <Link to="/blog" className="back-btn">{getSetting('back_to_blog', 'بازگشت به وبلاگ')}</Link>
            </div>
        </div>
    );
};

export default BlogPostPage;
