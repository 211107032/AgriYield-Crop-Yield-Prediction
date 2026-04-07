import React, { useState, useEffect } from 'react';

// Reusable Glass Card Component
const GlassCard = ({ children, className = "" }) => (
    <div className={`backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);

const LandingPage = ({ onStart, onDoctor, theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`min-h-screen relative font-sans selection:bg-green-500 selection:text-white overflow-hidden
      ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-gradient-to-br from-green-50 to-emerald-100 text-gray-900'}
    `}>

            {/* Background Ambience (Animated Blobs) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 animate-pulse
          ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-300/40'}`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 animate-pulse delay-1000
          ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-teal-200/40'}`} />
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/0
        ${scrolled ? 'backdrop-blur-md bg-white/70 dark:bg-black/60 border-white/10 shadow-lg py-3' : 'py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                    {/* Logo Area */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-green-500 to-emerald-400 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                            <span className="text-xl">🌱</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">AgriYield<span className="text-green-500">.AI</span></h1>
                            <p className="text-[10px] uppercase tracking-widest opacity-60 font-semibold">Intelligence for Earth</p>
                        </div>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
                        {['Mission', 'Technology', 'Global Impact'].map((item) => (
                            <a key={item} href="#" className="hover:text-green-500 transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-500 transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Doctor Shortcut */}
                        <button
                            onClick={onDoctor}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all font-semibold text-sm backdrop-blur-sm"
                        >
                            <span className="animate-pulse">●</span> AI Doctor
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        >
                            {theme === 'dark' ? '☀' : '🌙'}
                        </button>
                        <button
                            onClick={onStart}
                            className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 sm:min-h-screen">

                {/* Text Content */}
                <div className="md:w-1/2 space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                        Version 2.0 Live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                        Cultivating the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-300">
                            Future Harvest
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed border-l-4 border-green-500/30 pl-6">
                        Harnessing the power of neural networks to predict crop yields and diagnose plant diseases with <span className="text-green-500 font-bold">99.8% accuracy.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={onStart}
                            className="group relative px-8 py-4 bg-green-600 overflow-hidden rounded-full text-white shadow-2xl hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <span className="relative font-bold text-lg flex items-center gap-2">
                                Predict Yield
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </button>

                        <button
                            onClick={onDoctor}
                            className="px-8 py-4 rounded-full border-2 border-gray-200 dark:border-white/10 hover:border-green-500 dark:hover:border-green-400 font-bold text-gray-700 dark:text-gray-200 transition-all hover:bg-green-50/50 dark:hover:bg-white/5"
                        >
                            Diagnose Disease
                        </button>
                    </div>

                    <div className="pt-8 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <p className="text-xs font-bold tracking-widest uppercase">Trusted by 10,000+ Farmers</p>
                        {/* Fake Partner Logos (Text for minimalism) */}
                        <div className="flex gap-4 font-serif italic font-bold text-lg">
                            <span>AgriTech</span>
                            <span>FarmOS</span>
                            <span>NatureWait</span>
                        </div>
                    </div>
                </div>

                {/* Visual Content (Floating Cards) */}
                <div className="md:w-1/2 relative h-[500px] w-full perspective-1000">

                    {/* Decorative Circle */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-dashed animate-[spin_60s_linear_infinite]
            ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}
          `}></div>

                    {/* Card 1: Yield Prediction */}
                    <GlassCard className="absolute top-10 right-10 w-64 z-20 animate-[float_6s_ease-in-out_infinite]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">🌾</div>
                            <span className="text-green-500 font-bold text-sm">+24%</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1">Wheat Yield</h3>
                        <p className="text-xs opacity-60 mb-3">Projected harvest analysis</p>
                        <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[78%]"></div>
                        </div>
                    </GlassCard>

                    {/* Card 2: Disease Status */}
                    <GlassCard className="absolute bottom-20 left-10 w-72 z-30 animate-[float_5s_ease-in-out_infinite_1s]">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Alert Detected</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg bg-gray-800 border border-white/10 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-1">
                                    <span className="text-[10px] text-white">SCAN</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Early Blight</h4>
                                <p className="text-[10px] opacity-60">Confidence: 99.2%</p>
                                <button onClick={onDoctor} className="text-[10px] text-blue-400 mt-1 hover:underline">View Diagnosis &rarr;</button>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Card 3: Weather Data */}
                    <GlassCard className="absolute top-1/2 right-0 w-48 z-10 scale-90 opacity-80 blur-[1px] hover:blur-0 transition-all animate-[float_7s_ease-in-out_infinite_2s]">
                        <div className="text-center">
                            <div className="text-3xl mb-1">⛅</div>
                            <div className="font-bold text-xl">24°C</div>
                            <div className="text-xs opacity-60">Optimal for Sowing</div>
                        </div>
                    </GlassCard>

                </div>
            </main>

            {/* Global CSS for custom animations if Tailwind config misses them */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in-up {
           animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }
        .perspective-1000 {
           perspective: 1000px;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
