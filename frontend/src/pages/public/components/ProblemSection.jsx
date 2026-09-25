import { LuLanguages, LuWifiOff, LuPresentation, LuSparkles } from "react-icons/lu";
import SectionBadge from "./SectionBadge";
import IconBadge from "./IconBadge";

const groups = [
  {
    icon: LuLanguages,
    title: "Comunidades indígenas",
    barrier: "Barrera: el idioma",
    items: ["Los materiales llegan solo en castellano.", "Hay pocos recursos en su lengua.", "Cuesta seguir la clase sin apoyo."],
    solution: "Suma traducciones hechas por una persona de la comunidad y audio para escuchar el material.",
  },
  {
    icon: LuWifiOff,
    title: "Estudiantes del interior",
    barrier: "Barrera: la conectividad",
    items: ["Poca señal o nada de internet.", "Archivos pesados que no bajan.", "Videos que no cargan."],
    solution: "Arma versiones livianas. Se descargan una vez y se usan sin internet.",
  },
  {
    icon: LuPresentation,
    title: "Docentes del interior",
    barrier: "Barrera: la conectividad",
    items: ["Cuesta subir y compartir materiales.", "Poco tiempo para adaptar cada uno.", "Falta una herramienta simple."],
    solution: "El docente sube el material una vez. FormA crea las versiones accesibles.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problematica" className="bg-white dark:bg-forma-night font-raleway pt-4 pb-20">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6">

        <SectionBadge>Nuestra problemática</SectionBadge>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          <h2 className="text-forma-ink dark:text-white text-[2.1rem] leading-[1.15] [text-shadow:1px_1px_1px_rgba(0,0,0,0.2)]">
            Barreras de accesibilidad en contenidos y recursos digitales
          </h2>
          <p className="text-forma-ink dark:text-white text-[1.1rem] leading-[1.45] lg:pt-1">
            Las personas poseen diferentes capacidades, contextos y formas de interactuar con la tecnología. Muchos contenidos no contemplan estas diferencias.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {groups.map((group) => (
            <article key={group.title} className="bg-forma-sky rounded-2xl shadow-soft dark:bg-forma-midnight dark:shadow-none dark:border dark:border-forma-line p-4 pt-6 flex flex-col">
              <div className="px-2.5 flex-1">
                <IconBadge icon={group.icon} tone="white" className="mb-4" />
                <h3 className="text-black dark:text-white font-bold text-[1.33rem]">{group.title}</h3>
                <p className="mt-2 text-black dark:text-white font-bold text-[1rem]">{group.barrier}</p>
                <ul className="mt-4 mb-14 text-black dark:text-white text-[1rem] leading-[1.55]">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-card dark:bg-forma-night dark:shadow-none dark:border dark:border-forma-line px-5 pt-4 pb-6 min-h-[180px]">
                <h4 className="flex items-center gap-2 text-black dark:text-white font-bold text-[1rem]">
                  <IconBadge icon={LuSparkles} size="sm" />
                  Qué hace FormA
                </h4>
                <p className="mt-2 text-black dark:text-white text-[1rem] leading-[1.45]">{group.solution}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
