import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import YieldForm from './components/YieldForm';
import DiseaseDetection from './components/DiseaseDetection';

// FORCE CONNECT TO BACKEND
axios.defaults.baseURL = 'http://127.0.0.1:8000';

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [view, setView] = useState('landing'); // 'landing' or 'predict'

    // EFFECT: Apply theme to HTML tag for global effect
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        // The outer div inherits the global theme from 'html' but ensures height coverage
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">

            {view === 'landing' ? (
                <LandingPage
                    onStart={() => setView('predict')}
                    onDoctor={() => setView('disease')}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            ) : view === 'predict' ? (
                <YieldForm
                    onBack={() => setView('landing')}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            ) : view === 'disease' ? (
                <DiseaseDetection
                    onBack={() => setView('landing')}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            ) : null}
        </div>
    );
}

export default App;
