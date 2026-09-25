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
                    tealHover: '#3AC5A5',
                    // Paleta del diseño en Canva (modo claro)
                    navy: '#002C44',
                    primary: '#003B5C',
                    ink: '#0B1F3A',
                    cyan: '#5CE1E6',
                    link: '#74C4C7',
                    sky: '#EEF5FF',
                    badge: '#B0E0FC',
                    mist: '#EDF9FF',
                    skeleton: '#D9D9D9',
                    // Modo oscuro
                    night: '#01141F',
                    midnight: '#03202F',
                    deep: '#002235',
                    line: '#173D52',
                }
            },
            fontFamily: {
                raleway: ['Raleway', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                // Degradado del hero oscuro del Canva: turquesa arriba a la izquierda, casi negro abajo a la derecha
                'hero-dark': 'radial-gradient(ellipse 45% 70% at 0% 0%, rgba(92,225,230,0.75) 0%, rgba(1,81,91,0.6) 45%, transparent 75%), linear-gradient(135deg, #01515B 0%, #012C44 40%, #061923 78%, #000101 100%)',
            },
            boxShadow: {
                soft: '0 4px 18px rgba(11, 31, 58, 0.08)',
                card: '0 6px 24px rgba(11, 31, 58, 0.10)',
            },
        },
    },
    plugins: [],
}
