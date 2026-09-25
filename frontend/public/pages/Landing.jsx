import { Link } from "react-router-dom";
import { useSettings } from "../../src/hooks/useSettings.js";
import {
  FaVolumeUp, FaSlidersH, FaHome, FaUsers,
  FaLandmark, FaSchool, FaArrowRight, FaSearch
} from "react-icons/fa";

export default function Landing() {
  const { speak } = useSettings();

  const handleLeerPagina = () => {
    speak("La educación formoseña, sin barreras. FormA es una plataforma que convierte los materiales escolares en versiones accesibles.");
  };

  return (
    <div className="min-h-screen bg-forma-dark text-white selection:bg-forma-teal selection:text-forma-dark">

      {/* HEADER & NAVEGACIÓN */}
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

      {/* SECCIÓN 1: INICIO (Hero) */}
      <section
        id="inicio"
        className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-br from-[#072B3B] via-forma-dark to-forma-darker"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Textos y Botones */}
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-5xl md:text-6xl font-serif leading-tight text-white">
                La educación <br />
                formoseña, <span className="font-serif italic text-forma-teal font-light tracking-wide">sin barreras</span>
              </h1>

              <p className="text-lg md:text-xl text-teal-50/80 max-w-lg leading-relaxed">
                FormA es una plataforma que convierte los materiales escolares en versiones accesibles. Sirve para que cualquier estudiante de Formosa pueda aprender en su forma y en su lengua.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a
                  href="#problematica"
                  className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full bg-forma-teal hover:bg-forma-tealHover text-forma-dark font-bold transition-colors shadow-[0_0_20px_rgba(80,227,194,0.3)]"
                >
                  Conocer la problematica <FaArrowRight aria-hidden="true" />
                </a>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 min-h-[48px] rounded-full border border-forma-teal hover:bg-forma-card text-forma-teal font-medium transition-colors"
                >
                  Ver plataforma
                </Link>
              </div>
            </div>

            {/* Tarjeta de Datos */}
            <div className="relative w-full max-w-lg mx-auto lg:ml-auto">
              <div className="absolute inset-0 bg-forma-teal/10 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative bg-forma-card/90 backdrop-blur-xl border border-teal-800/50 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-serif text-teal-100 mb-8">Formosa en números</h2>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  <div>
                    <FaUsers className="text-3xl text-forma-teal mb-3" aria-hidden="true" />
                    <p className="text-3xl font-bold text-white mb-1">7,8 %</p>
                    <p className="text-sm text-teal-100/70 leading-snug">se reconoce indígena <br /> (INDEC, Censo 2022)</p>
                  </div>
                  <div>
                    <FaLandmark className="text-3xl text-forma-teal mb-3" aria-hidden="true" />
                    <p className="text-3xl font-bold text-white mb-1">4</p>
                    <p className="text-sm text-teal-100/70 leading-snug">pueblos originarios</p>
                  </div>
                  <div>
                    <FaHome className="text-3xl text-forma-teal mb-3" aria-hidden="true" />
                    <p className="text-3xl font-bold text-white mb-1">+320</p>
                    <p className="text-sm text-teal-100/70 leading-snug">instituciones <br /> interculturales</p>
                  </div>
                  <div>
                    <FaSchool className="text-3xl text-forma-teal mb-3" aria-hidden="true" />
                    <p className="text-3xl font-bold text-white mb-1">34</p>
                    <p className="text-sm text-teal-100/70 leading-snug">escuelas de <br /> Educación Especial</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-teal-800/50">
                  <p className="text-sm text-teal-100/70">
                    Más datos, con sus fuentes, en <a href="#" className="text-forma-teal hover:underline">El sistema educativo</a>.
                  </p>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

      <section id="problematica" className="min-h-[50vh] flex items-center justify-center bg-forma-darker">
        <p className="text-teal-600/50 italic">Aquí irá la sección "La problemática"...</p>
      </section>
    </div>
  );
}