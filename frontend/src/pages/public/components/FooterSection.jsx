import { LuMapPin, LuUsers, LuFileText } from "react-icons/lu";
import IconBadge from "./IconBadge";

export default function FooterSection() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="recursos" className="bg-forma-ink dark:bg-[#000c13] dark:border-t dark:border-forma-line text-white font-raleway pt-4 pb-6">
            <div className="max-w-[1232px] mx-auto px-4 sm:px-6">

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-4">
                    <div className="max-w-[440px]">
                        <p className="font-light text-[2.1rem]">FormA</p>
                        <p className="mt-3 text-white/90 text-[1rem] leading-snug">
                            Materiales escolares en versiones accesibles, para aprender en tu forma y en tu lengua.
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-white/90 text-[1rem]">
                            <IconBadge icon={LuMapPin} size="sm" tone="navy" />
                            Formosa, Argentina.
                        </p>
                    </div>
                    <div className="md:mr-24 md:pt-5">
                        <h2 className="flex items-center gap-2 font-bold text-[1.1rem]">
                            <IconBadge icon={LuUsers} size="sm" tone="navy" />
                            Equipo
                        </h2>
                        <p className="mt-2 text-white/85 text-[1rem]">Drop_Table</p>
                    </div>
                </div>

                <div className="border-t border-white/30 pt-5">
                    <p className="flex items-center gap-2 text-white/90 text-[1rem]">
                        <IconBadge icon={LuFileText} size="sm" tone="navy" />
                        Fuentes: INDEC, Censo 2022 · Ley 26.206 de Educación Nacional · Ley 426 de Formosa.
                    </p>
                    <p className="mt-16 text-center text-white/90 text-[1rem]">
                        © {currentYear} FormA - Todos los derechos reservados
                    </p>
                </div>

            </div>
        </footer>
    );
}
