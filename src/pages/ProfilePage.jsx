import React, { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { getSetting } = useContext(SettingsContext);
    const { user, setUser } = useContext(AuthContext); // Assuming setUser is available or we refresh
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/user/');
                setFormData({
                    first_name: response.data.first_name || '',
                    last_name: response.data.last_name || '',
                    email: response.data.email || '',
                    phone_number: response.data.phone_number || '',
                    bio: response.data.bio || ''
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch('/auth/user/', formData);
            setEditing(false);
            setMessage('اطلاعات با موفقیت ذخیره شد.');
            // Update context if needed, though usually context re-fetches or we update it manually
            // setUser(response.data); // If setUser is exposed
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('خطا در ذخیره اطلاعات.');
        }
    };

    if (loading) return <div className="loading">{getSetting('loading_text', 'در حال بارگذاری...')}</div>;

    return (
        <div className="profile-container">
            <h1 className="profile-title">{getSetting('profile_title', 'پروفایل کاربری')}</h1>
            {message && <p className="profile-message">{message}</p>}
            
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.profile_picture ? (
                            <img src={user.profile_picture} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">{user?.username?.charAt(0).toUpperCase()}</div>
                        )}
                    </div>
                    <h2>{user?.username}</h2>
                </div>

                {editing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label>{getSetting('first_name_label', 'نام')}</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{getSetting('last_name_label', 'نام خانوادگی')}</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{getSetting('email_label', 'ایمیل')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{getSetting('phone_number_label', 'شماره موبایل')}</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>بیوگرافی</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn">{getSetting('profile_save_button', 'ذخیره تغییرات')}</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>{getSetting('profile_cancel_button', 'انصراف')}</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="label">{getSetting('first_name_label', 'نام')}:</span>
                            <span className="value">{formData.first_name || '-'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{getSetting('last_name_label', 'نام خانوادگی')}:</span>
                            <span className="value">{formData.last_name || '-'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{getSetting('email_label', 'ایمیل')}:</span>
                            <span className="value">{formData.email || '-'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{getSetting('phone_number_label', 'شماره موبایل')}:</span>
                            <span className="value">{formData.phone_number || '-'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">بیوگرافی:</span>
                            <span className="value">{formData.bio || '-'}</span>
                        </div>
                        <button className="edit-btn" onClick={() => setEditing(true)}>{getSetting('profile_edit_button', 'ویرایش اطلاعات')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
