import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/core/settings/');
                // Transform array to object for easier access: { key: value }
                const settingsMap = {};
                response.data.forEach(item => {
                    settingsMap[item.key] = item.value;
                });
                setSettings(settingsMap);
            } catch (error) {
                console.error('Error fetching site settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const getSetting = (key, defaultValue = '') => {
        return settings[key] || defaultValue;
    };

    return (
        <SettingsContext.Provider value={{ settings, getSetting, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
