import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Check localStorage or default to dark (since FixPix is often dark mode primary)
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('fixpix-theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        // Save to localStorage
        localStorage.setItem('fixpix-theme', isDark ? 'dark' : 'light');
        // Apply to document root (legacy)
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        
        // Apply to classList for Tailwind Config 'class' darkmode
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme: () => setIsDark(p => !p) }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
