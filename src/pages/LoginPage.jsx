import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const { getSetting } = useContext(SettingsContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(getSetting('login_error', 'نام کاربری یا رمز عبور اشتباه است'));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{getSetting('login_title', 'ورود به حساب کاربری')}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{getSetting('username_label', 'نام کاربری')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{getSetting('password_label', 'رمز عبور')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">{getSetting('login_button', 'ورود')}</button>
                </form>
                <p className="auth-link">
                    {getSetting('no_account_text', 'حساب کاربری ندارید؟')} <Link to="/register">{getSetting('register_link_text', 'ثبت نام کنید')}</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
