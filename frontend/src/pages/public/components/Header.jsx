import { Link } from "react-router-dom";
import { useSettings } from "../../../hooks/useSettings.js";
import { FaVolumeUp, FaSlidersH } from "react-icons/fa";

export default function Header() {
  const { speak } = useSettings();

  const handleLeerPagina = () => {
    speak("La educación formoseña, sin barreras. FormA es una plataforma que convierte los materiales escolares en versiones accesibles.");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-forma-dark/90 backdrop-blur-md border-b border-forma-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 border-b border-forma-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-10 flex items-center justify-center text-forma-teal">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C10.34 2 9 3.34 9 5C9 6.66 10.34 8 12 8C13.66 8 15 6.66 15 5C15 3.34 13.66 2 12 2ZM16 10H8C5.79 10 4 11.79 4 14V22H6V16H18V22H20V14C20 11.79 18.21 10 16 10Z" />
              </svg>
            </div>
            <span className="text-3xl font-serif tracking-wide text-white">FormA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLeerPagina}
              aria-label="Escuchar el contenido de esta página"
              className="flex items-center gap-2 px-4 min-h-[48px] rounded-full border border-forma-teal/50 hover:bg-forma-card transition-colors text-sm font-medium"
            >
              <FaVolumeUp className="text-forma-teal text-lg" aria-hidden="true" />
              <span className="hidden sm:inline">Escuchar esta página</span>
            </button>

            <Link
              to="/settings"
              aria-label="Ir a la configuración de accesibilidad"
              className="flex items-center gap-2 px-4 min-h-[48px] rounded-full border border-forma-teal/50 hover:bg-forma-card transition-colors text-sm font-medium"
            >
              <FaSlidersH className="text-forma-teal text-lg" aria-hidden="true" />
              <span className="hidden sm:inline">Ajustes</span>
            </Link>
          </div>
        </div>

        <nav className="flex items-center gap-6 py-3 overflow-x-auto no-scrollbar text-sm font-medium text-teal-100/80">
          <a href="#inicio" className="hover:text-forma-teal whitespace-nowrap transition-colors">Inicio</a>
          <a href="#problematica" className="hover:text-forma-teal whitespace-nowrap transition-colors">La problemática</a>
          <a href="#como-funciona" className="hover:text-forma-teal whitespace-nowrap transition-colors">Cómo funciona</a>
          <a href="#para-quien" className="hover:text-forma-teal whitespace-nowrap transition-colors">Para quién</a>
          <a href="#recursos" className="hover:text-forma-teal whitespace-nowrap transition-colors">Recursos</a>
          <a href="#contacto" className="hover:text-forma-teal whitespace-nowrap transition-colors">Contacto</a>
        </nav>
      </div>
    </header>
  );
}