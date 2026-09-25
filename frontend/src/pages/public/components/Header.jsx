import { Link } from "react-router-dom";
import { useSettings } from "../../../hooks/useSettings.js";
import { FaVolumeUp, FaSlidersH } from "react-icons/fa";

export default function Header() {
  const { speak } = useSettings();

  const handleLeerPagina = () => {
    speak("La educación formoseña, sin barreras. FormA es una plataforma que convierte los materiales escolares en versiones accesibles.");
  };

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "La problemática", href: "#problematica" },
    { name: "Cómo funciona", href: "#como-funciona" },
    { name: "Para quién", href: "#para-quien" },
    { name: "Recursos", href: "#recursos" },
    { name: "Preguntas", href: "#preguntas" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-forma-dark/95 backdrop-blur-md border-b border-forma-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================
            BLOQUE ÚNICO: SIEMPRE VISIBLE
        ========================================= */}
        <div className="flex items-center justify-between h-16 w-full">
          
          {/* LOGO */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-8 flex items-center justify-center text-forma-teal">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C10.34 2 9 3.34 9 5C9 6.66 10.34 8 12 8C13.66 8 15 6.66 15 5C15 3.34 13.66 2 12 2ZM16 10H8C5.79 10 4 11.79 4 14V22H6V16H18V22H20V14C20 11.79 18.21 10 16 10Z" />
              </svg>
            </div>
            <span className="text-xl font-serif tracking-wide text-white hidden sm:block">
              FormA
            </span>
          </div>

          {/* NAVEGACIÓN */}
          <nav className="hidden lg:flex items-center gap-6 overflow-hidden">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-teal-50/80 hover:text-forma-teal whitespace-nowrap transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/settings"
              aria-label="Ir a la configuración de accesibilidad"
              className="flex items-center gap-2 h-10 px-4 rounded-full border border-forma-teal/40 hover:bg-forma-card transition-colors text-sm font-medium text-white"
            >
              <FaSlidersH className="text-forma-teal text-lg" aria-hidden="true" />
              <span className="hidden md:inline">Ajustes</span>
            </Link>

            <button
              onClick={handleLeerPagina}
              aria-label="Escuchar el contenido de esta página"
              className="flex items-center gap-2 h-10 px-4 rounded-full border border-forma-teal/40 hover:bg-forma-card transition-colors text-sm font-medium text-white"
            >
              <FaVolumeUp className="text-forma-teal text-lg" aria-hidden="true" />
              <span className="hidden md:inline">Escuchar esta página</span>
            </button>
          </div>
          
        </div>

      </div>
    </header>
  );
}