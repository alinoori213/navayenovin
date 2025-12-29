import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                // Assuming we use session auth or token. If session, browser handles cookies.
                // If token, we need to store it. For simplicity, let's assume Django Session Auth for now
                // but usually React+Django uses Token/JWT. 
                // Since I implemented basic LoginView with session login(request, user), 
                // we need to make sure axios sends credentials.
                // However, DRF TokenAuth is better for decoupled frontend.
                // Let's stick to what I wrote: login(request, user) sets session cookie.
                // So we need { withCredentials: true } in axios.
                
                // Wait, I didn't set CORS_ALLOW_CREDENTIALS = True in settings.py
                // I should update settings.py first.
                
                // For now, let's proceed with structure.
                const response = await api.get('/auth/user/');
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login/', { username, password });
        setUser(response.data);
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register/', userData);
        // Auto login after register? Or redirect to login?
        // Let's just return response
        return response.data;
    };

    const logout = async () => {
        await api.post('/auth/logout/');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
