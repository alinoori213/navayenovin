import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const RegisterPage = () => {
    const { getSetting } = useContext(SettingsContext);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        first_name: '',
        last_name: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError(getSetting('register_password_mismatch', 'رمز عبور و تکرار آن مطابقت ندارند'));
            return;
        }
        try {
            await register({
                username: formData.username,
                password: formData.password,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name
            });
            navigate('/login');
        } catch (err) {
            setError(getSetting('register_error', 'خطا در ثبت نام. لطفا مجددا تلاش کنید.'));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{getSetting('register_title', 'ثبت نام در نوای نوین')}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{getSetting('username_label', 'نام کاربری')}</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{getSetting('email_label', 'ایمیل')}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{getSetting('first_name_label', 'نام')}</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{getSetting('last_name_label', 'نام خانوادگی')}</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
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
                        <label>{getSetting('password_label', 'رمز عبور')}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{getSetting('confirm_password_label', 'تکرار رمز عبور')}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">{getSetting('register_button', 'ثبت نام')}</button>
                </form>
                <p className="auth-link">
                    {getSetting('already_registered_text', 'قبلا ثبت نام کرده‌اید؟')} <a href="/login">{getSetting('login_link_text', 'وارد شوید')}</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
