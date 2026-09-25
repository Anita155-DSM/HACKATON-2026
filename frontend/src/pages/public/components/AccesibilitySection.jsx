import { LuVolume2, LuALargeSmall, LuContrast, LuBookOpen, LuFocus, LuCaptions, LuDownload, LuLanguages } from "react-icons/lu";
import SectionBadge from "./SectionBadge";
import IconBadge from "./IconBadge";

const features = [
    { icon: LuVolume2, title: "Leer en voz alta", desc: "Escuchá cualquier texto." },
    { icon: LuALargeSmall, title: "Letra más grande", desc: "Agrandá sin perder nada." },
    { icon: LuContrast, title: "Alto contraste", desc: "Colores fáciles de ver." },
    { icon: LuBookOpen, title: "Lectura fácil", desc: "Frases cortas y claras." },
    { icon: LuFocus, title: "Modo concentración", desc: "Sin distracciones en pantalla." },
    { icon: LuCaptions, title: "Subtítulos", desc: "En todos los videos." },
    { icon: LuDownload, title: "Sin internet", desc: "Descargá y usá sin señal." },
    { icon: LuLanguages, title: "En wichí", desc: "Traducción pendiente – Simulado" },
];

export default function AccessibilitySection() {
    return (
        <section id="para-quien" className="bg-white dark:bg-forma-night font-raleway pt-20 pb-24">
            <div className="max-w-[1266px] mx-auto px-4 sm:px-6 flex flex-col items-center">

                <SectionBadge className="px-14">Accesibilidad</SectionBadge>
                <h2 className="mt-5 text-black dark:text-white text-[2.1rem] text-center">Pensado para cada persona</h2>

                <div className="mt-9 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6">
                    {features.map((feature) => (
                        <div key={feature.title} className="bg-white rounded-2xl shadow-soft border border-[#f1f3f5] dark:bg-forma-midnight dark:border-forma-line dark:shadow-none px-5 pt-5 pb-7 min-h-[112px]">
                            <h3 className="flex items-center gap-3 text-black dark:text-white font-bold text-[1.1rem]">
                                <IconBadge icon={feature.icon} />
                                {feature.title}
                            </h3>
                            <p className="mt-3 text-black dark:text-slate-300 text-[0.95rem] leading-snug">{feature.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
