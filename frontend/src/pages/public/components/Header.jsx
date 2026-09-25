import { Link } from "react-router-dom";
import { useSettings } from "../../../hooks/useSettings.js";
import { LuVolume2, LuSlidersHorizontal, LuMoon, LuSun } from "react-icons/lu";
import Logo from "./Logo";

const navLinks = [
  { name: "Inicio", href: "#inicio" },
  { name: "La problemática", href: "#problematica" },
  { name: "Cómo funciona", href: "#como-funciona" },
  { name: "Para quién", href: "#para-quien" },
  { name: "Recursos", href: "#recursos" },
  { name: "Preguntas", href: "#preguntas" },
];

// Botones del header: píldoras translúcidas con borde fino y el ícono en celeste
const baseButton =
  "flex items-center justify-center h-10 rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forma-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-forma-navy";
const pillButton = `${baseButton} gap-2 px-4 font-raleway font-medium text-[0.9rem] tracking-wide`;
const iconButton = `${baseButton} w-10`;
const iconClass = "text-[1.15rem] text-forma-cyan";

export default function Header() {
  const { speak, theme, handleThemeChange } = useSettings();
  const isDark = theme === "dark";

  const handleLeerPagina = () => {
    speak("La educación formoseña, sin barreras. FormA es una plataforma que convierte los materiales escolares en versiones accesibles.");
  };

  return (
    <>
    <header className="w-full bg-forma-navy">
      <div className="max-w-[1210px] mx-auto px-4 sm:px-6">
        {/* Fila superior: logo y acciones */}
        <div className="flex items-center justify-between gap-4 pt-2 pb-3">
          <Link to="/" aria-label="FormA, ir al inicio">
            <Logo />
          </Link>

          <div className="flex items-center gap-2.5">
            <button onClick={handleLeerPagina} aria-label="Escuchar el contenido de esta página" className={pillButton}>
              <LuVolume2 className={iconClass} strokeWidth={1.75} aria-hidden="true" />
              <span className="hidden md:inline">Escuchar esta página</span>
            </button>
            <Link to="/settings" aria-label="Ir a los ajustes de accesibilidad" className={pillButton}>
              <LuSlidersHorizontal className={iconClass} strokeWidth={1.75} aria-hidden="true" />
              <span className="hidden md:inline">Ajustes</span>
            </Link>
            {/* Tema: solo el ícono (el nombre queda en aria-label y en el tooltip) */}
            <button
              onClick={() => handleThemeChange(isDark ? "light" : "dark")}
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              title={isDark ? "Modo claro" : "Modo oscuro"}
              aria-pressed={isDark}
              className={`${iconButton} group`}
            >
              {isDark
                ? <LuSun className={`${iconClass} transition-transform duration-500 group-hover:rotate-90`} strokeWidth={1.75} aria-hidden="true" />
                : <LuMoon className={`${iconClass} transition-transform duration-500 group-hover:-rotate-12`} strokeWidth={1.75} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="h-px bg-white/55" />
      </div>
    </header>

    {/* Navegación: queda fija arriba al scrollear (hermana del header para que sticky funcione en toda la página) */}
    <div className="sticky top-0 z-40 w-full bg-forma-navy dark:bg-forma-navy/90 dark:backdrop-blur-md border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <nav aria-label="Secciones de la página" className="max-w-[1210px] mx-auto flex flex-wrap justify-around gap-x-6 gap-y-2 py-5 px-8 lg:px-16">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="font-raleway text-[1rem] text-white hover:text-forma-cyan whitespace-nowrap transition-colors"
          >
            {link.name}
          </a>
        ))}
      </nav>
    </div>
    </>
  );
}
