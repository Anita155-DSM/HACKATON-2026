import { Link } from "react-router-dom";
import { LuHouse, LuUsers, LuLandmark, LuBuilding2, LuSchool, LuArrowRight } from "react-icons/lu";
import IconBadge from "./IconBadge";

const stats = [
  { icon: LuUsers, value: "7,8 %", label: <>se reconoce indígena<br />(INDEC, Censo 2022)</> },
  { icon: LuLandmark, value: "4", label: "pueblos originarios" },
  { icon: LuBuilding2, value: "+320", label: <>instituciones<br />interculturales</>, bold: true },
  { icon: LuSchool, value: "34", label: <>escuelas de<br />Educación Especial</> },
];

export default function HeroSection() {
  return (
    <section id="inicio" className="bg-white dark:bg-hero-dark font-raleway pt-12 pb-16">
      <div className="max-w-[1210px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* Textos y botones */}
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forma-mist border border-[#dcecf5] text-forma-ink dark:bg-white/5 dark:border-white/25 dark:text-white uppercase text-[0.85rem]">
            <LuHouse className="text-[1.2rem] text-forma-navy dark:text-white" strokeWidth={1.75} aria-hidden="true" />
            Portal educativo-Formosa
          </span>

          <h1 className="mt-7 font-raleway font-medium tracking-tight text-forma-navy dark:text-white text-[3rem] sm:text-[4rem] leading-[1.08] [text-shadow:1px_1px_1px_rgba(0,0,0,0.25)]">
            La educación <br />
            formoseña,{" "}
            <em className="font-raleway font-semibold italic text-forma-cyan">sín barreras</em>
          </h1>

          <p className="mt-10 max-w-[560px] text-black dark:text-white text-[1.1rem] leading-[1.55]">
            FormA es una plataforma que convierte los materiales escolares en versiones accesibles. Sirve para que cualquier estudiante de Formosa pueda aprender en su forma y en su lengua.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <a
              href="#problematica"
              className="inline-flex items-center gap-1.5 h-[42px] px-4 rounded-xl bg-forma-primary text-white text-[1rem] hover:bg-forma-navy dark:bg-forma-cyan dark:text-forma-navy dark:hover:bg-white transition-colors"
            >
              Conocer la problematica <LuArrowRight className="text-[1.15rem]" strokeWidth={2} aria-hidden="true" />
            </a>
            <Link
              to="/login"
              className="inline-flex items-center h-[46px] px-7 rounded-xl border-2 border-forma-primary bg-white text-forma-primary text-[1rem] hover:bg-forma-sky dark:bg-transparent dark:border-forma-cyan dark:text-forma-cyan dark:hover:bg-forma-cyan/10 transition-colors"
            >
              Ver plataforma
            </Link>
          </div>
        </div>

        {/* Tarjeta "Formosa en números" */}
        <div className="w-full max-w-[570px] lg:ml-auto rounded-[28px] border border-[#e6e8eb] bg-white shadow-card dark:bg-white/[0.03] dark:border-forma-line dark:shadow-none dark:backdrop-blur-sm px-5 pt-8 pb-6">
          <h2 className="px-5 text-black dark:text-forma-cyan text-[1.45rem]">Formosa en números</h2>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
            {stats.map(({ icon, value, label, bold }) => (
              <div key={value} className="bg-forma-sky dark:bg-forma-deep rounded-[28px] px-5 py-4 min-h-[150px] flex flex-col justify-center">
                <IconBadge icon={icon} tone="white" className="mb-2" />
                <p className={`text-black dark:text-white text-[1.55rem] leading-tight ${bold ? "font-extrabold" : ""}`}>{value}</p>
                <p className="text-black dark:text-white text-[0.95rem] leading-tight">{label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-black dark:text-white text-[0.95rem]">
            Más datos, con sus fuentes, en{" "}
            <a href="#recursos" className="text-forma-link underline underline-offset-2 hover:text-forma-primary">
              El sistema educativo
            </a>
            .
          </p>
        </div>

      </div>
    </section>
  );
}
