/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#ffffff', // Branco puro para máximo contraste
                foreground: '#020617', // Slate 950 (quase preto)
                primary: {
                    DEFAULT: '#0f172a', // Slate 900
                    foreground: '#ffffff',
                },
                accent: {
                    DEFAULT: '#f8fafc', // Slate 50
                    foreground: '#0f172a',
                },
            },
        },
    },
    plugins: [],
}
