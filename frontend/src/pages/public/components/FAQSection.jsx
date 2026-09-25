export default function FAQSection() {
    const faqs = [
        {
            question: "¿Tengo que registrarme?",
            answer: "No. Entrás y usás los materiales sin crear una cuenta."
        },
        {
            question: "¿Funciona sin internet?",
            answer: "Sí. Descargás el material una vez y lo usás sin conexión."
        },
        {
            question: "¿Quién traduce al wichí?",
            answer: "Una persona de la comunidad. Por ahora: Traducción pendiente - Simulado."
        },
        {
            question: "¿Me piden datos de salud?",
            answer: "No. FormA nunca te pide datos de salud."
        }
    ];

    return (
        <section id="preguntas" className="py-24 lg:py-32 bg-[#F8FAFC] text-gray-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Encabezado Centrado */}
                <div className="text-center mb-16">
                    <span className="inline-block px-5 py-1.5 bg-[#BDE0FE] text-[#023E8A] font-bold rounded-full text-sm tracking-wide mb-6 uppercase">
                        Preguntas
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#041E2A]">
                        Preguntas frecuentes
                    </h2>
                </div>

                {/* Grilla de Tarjetas (2 columnas) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 shadow-sm rounded-[1.25rem] p-8 flex flex-col justify-center"
                        >
                            <h3 className="text-[1.15rem] font-bold text-[#041E2A] mb-3">
                                {faq.question}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}