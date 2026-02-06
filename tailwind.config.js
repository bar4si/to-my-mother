/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#fdfbf7', // Creme suave
                foreground: '#0f172a', // Azul Marinho profundo
                primary: {
                    DEFAULT: '#1e293b',
                    foreground: '#f8fafc',
                },
                accent: {
                    DEFAULT: '#f1f5f9',
                    foreground: '#1e293b',
                },
            },
        },
    },
    plugins: [],
}
