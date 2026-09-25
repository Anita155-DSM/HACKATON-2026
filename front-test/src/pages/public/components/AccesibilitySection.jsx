import {
    FaVolumeUp, FaFont, FaAdjust, FaBookOpen,
    FaBullseye, FaClosedCaptioning, FaSignal, FaHeadSideCough
} from "react-icons/fa";

export default function AccessibilitySection() {
    // Arreglo de datos para generar las tarjetas dinámicamente y no repetir código
    const features = [
        {
            icon: <FaVolumeUp className="text-blue-500 text-xl" aria-hidden="true" />,
            title: "Leer en voz alta",
            desc: "Escuchá cualquier texto."
        },
        {
            icon: <FaFont className="text-gray-400 text-xl" aria-hidden="true" />,
            title: "Letra más grande",
            desc: "Agrandá sin perder nada."
        },
        {
            icon: <FaAdjust className="text-gray-800 text-xl" aria-hidden="true" />,
            title: "Alto contraste",
            desc: "Colores fáciles de ver."
        },
        {
            icon: <FaBookOpen className="text-red-400 text-xl" aria-hidden="true" />,
            title: "Lectura fácil",
            desc: "Frases cortas y claras."
        },
        {
            icon: <FaBullseye className="text-red-500 text-xl" aria-hidden="true" />,
            title: "Modo concentración",
            desc: "Sin distracciones en pantalla."
        },
        {
            icon: <FaClosedCaptioning className="text-gray-500 text-xl" aria-hidden="true" />,
            title: "Subtítulos",
            desc: "En todos los videos."
        },
        {
            icon: <FaSignal className="text-orange-400 text-xl" aria-hidden="true" />,
            title: "Sin internet",
            desc: "Descargá y usá sin señal."
        },
        {
            icon: <FaHeadSideCough className="text-blue-700 text-xl" aria-hidden="true" />,
            title: "En wichí",
            desc: "Traducción pendiente – Simulado"
        },
    ];

    return (
        <section id="para-quien" className="py-24 lg:py-32 bg-white flex flex-col justify-center min-h-[70vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

                {/* Encabezado Centrado */}
                <div className="text-center mb-16">
                    <span className="inline-block px-5 py-1.5 bg-[#BDE0FE] text-[#023E8A] font-bold rounded-full text-sm tracking-wide mb-6 uppercase">
                        Accesibilidad
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#041E2A]">
                        Pensado para cada persona
                    </h2>
                </div>

                {/* Grilla de 8 Tarjetas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 flex flex-col items-start"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                {feature.icon}
                                <h3 className="text-lg font-bold text-[#041E2A] leading-tight">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 text-sm md:text-base">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}