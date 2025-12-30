import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { SettingsContext } from '../context/SettingsContext';
import './BlogPage.css';

const BlogPage = () => {
    const { getSetting } = useContext(SettingsContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts/');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="loading">{getSetting('loading_text', 'در حال بارگذاری...')}</div>;
    }

    return (
        <div className="blog-container">
            <h1>{getSetting('blog_title', 'وبلاگ نوای نوین')}</h1>
            <div className="posts-grid">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-image">
                                {post.image ? (
                                    <img src={post.image} alt={post.title} />
                                ) : (
                                    <div className="placeholder-image">{getSetting('image_placeholder', 'تصویر ندارد')}</div>
                                )}
                            </div>
                            <div className="post-content">
                                <h2>{post.title}</h2>
                                <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                                <div className="post-meta">
                                    <span className="author">{getSetting('post_author_prefix', 'نویسنده:')} {post.author.first_name || post.author.username}</span>
                                    <span className="date">{new Date(post.created_at).toLocaleDateString('fa-IR')}</span>
                                </div>
                                <Link to={`/blog/${post.id}`} className="read-more">{getSetting('read_more', 'ادامه مطلب')}</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{getSetting('blog_no_posts', 'هیچ مطلبی یافت نشد.')}</p>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
