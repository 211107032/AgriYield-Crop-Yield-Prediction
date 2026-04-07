/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'agri-black': '#050505',
                'agri-dark': '#121212',
                'agri-card': '#1E1E1E',
                'agri-green': '#00FFA3', // Neon green from screenshot
                'agri-orange': '#FF9900', // Orange button
                'agri-purple': '#6C63FF', // Form accents
                'field-bg': '#1F2937'     // Dark blue-grey for inputs
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
