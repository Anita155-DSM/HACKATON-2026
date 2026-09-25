import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaLandmark, FaSchool, FaArrowRight } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-br from-[#072B3B] via-forma-dark to-forma-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
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
  );
}