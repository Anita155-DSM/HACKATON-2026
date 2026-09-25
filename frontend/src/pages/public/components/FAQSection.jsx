import { LuUserPlus, LuWifiOff, LuLanguages, LuShieldCheck } from "react-icons/lu";
import SectionBadge from "./SectionBadge";
import IconBadge from "./IconBadge";

const faqs = [
    { icon: LuUserPlus, question: "¿Tengo que registrarme?", answer: "No. Entrás y usás los materiales sin crear una cuenta." },
    { icon: LuWifiOff, question: "¿Funciona sin internet?", answer: "Sí. Descargás el material una vez y lo usás sin conexión." },
    { icon: LuLanguages, question: "¿Quién traduce al wichí?", answer: "Una persona de la comunidad. Por ahora: Traducción pendiente – Simulado." },
    { icon: LuShieldCheck, question: "¿Me piden datos de salud?", answer: "No. FormA nunca te pide datos de salud." },
];

export default function FAQSection() {
    return (
        <section id="preguntas" className="bg-white dark:bg-forma-night font-raleway pt-20 pb-16">
            <div className="max-w-[1232px] mx-auto px-4 sm:px-6 flex flex-col items-center">

                <SectionBadge className="px-16">Preguntas</SectionBadge>
                <h2 className="mt-5 text-forma-ink dark:text-white text-[2.1rem] text-center">Preguntas frecuentes</h2>

                <div className="mt-9 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                    {faqs.map((faq) => (
                        <div key={faq.question} className="bg-white rounded-[20px] shadow-soft border border-[#f1f3f5] dark:bg-forma-midnight dark:border-forma-line dark:shadow-none px-7 pt-6 pb-10 min-h-[170px]">
                            <h3 className="flex items-center gap-3 text-forma-primary dark:text-forma-cyan font-bold text-[1.1rem]">
                                <IconBadge icon={faq.icon} />
                                {faq.question}
                            </h3>
                            <p className="mt-4 text-forma-ink dark:text-slate-300 text-[1rem] leading-snug">{faq.answer}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
