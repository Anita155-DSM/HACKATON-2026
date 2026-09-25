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
                forma: {
                    dark: '#041E2A',
                    darker: '#020F16',
                    card: '#072433',
                    teal: '#50E3C2',
                    tealHover: '#3AC5A5'
                }
            }
        },
    },
    plugins: [],
}