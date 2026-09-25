import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaLandmark, FaSchool, FaArrowRight } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Textos y Botones */}
          <div className="flex flex-col items-start gap-6">
            
            {/* Insignia superior */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F5FA] text-forma-dark text-xs font-bold tracking-widest uppercase border border-gray-100">
              <FaHome className="text-[#6B8A9E]" aria-hidden="true" />
              Portal Educativo-Formosa
            </div>

            {/* Título */}
            <h1 className="text-5xl md:text-6xl font-serif leading-tight text-forma-dark">
              La educación <br />
              formoseña, <span className="font-serif italic text-[#3BB29B] font-light tracking-wide">sin barreras</span>
            </h1>

            {/* Párrafo */}
            <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              FormA es una plataforma que convierte los materiales escolares en versiones accesibles. Sirve para que cualquier estudiante de Formosa pueda aprender en su forma y en su lengua.
            </p>

            {/* Botones */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href="#problematica"
                className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full bg-forma-dark hover:bg-[#020F16] text-white font-bold transition-colors shadow-md"
              >
                Conocer la problematica <FaArrowRight aria-hidden="true" />
              </a>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 min-h-[48px] rounded-full bg-white border border-forma-dark hover:bg-gray-50 text-forma-dark font-medium transition-colors"
              >
                Ver plataforma
              </Link>
            </div>
          </div>

          {/* Tarjeta de Datos */}
          <div className="relative w-full max-w-lg mx-auto lg:ml-auto">
            {/* Tarjeta principal blanca con sombra suave */}
            <div className="relative bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
              <h2 className="text-2xl font-serif text-forma-dark mb-6">Formosa en números</h2>
              
              {/* Grilla interna de 4 cuadrantes con fondo celeste */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-[#F0F5FA] rounded-2xl p-5 flex flex-col justify-center">
                  <FaUsers className="text-2xl text-[#6B8A9E] mb-3" aria-hidden="true" />
                  <p className="text-2xl font-bold text-forma-dark mb-1">7,8 %</p>
                  <p className="text-xs text-gray-600 leading-tight">se reconoce indígena <br /> (INDEC, Censo 2022)</p>
                </div>
                
                <div className="bg-[#F0F5FA] rounded-2xl p-5 flex flex-col justify-center">
                  <FaLandmark className="text-2xl text-[#6B8A9E] mb-3" aria-hidden="true" />
                  <p className="text-2xl font-bold text-forma-dark mb-1">4</p>
                  <p className="text-xs text-gray-600 leading-tight">pueblos originarios</p>
                </div>
                
                <div className="bg-[#F0F5FA] rounded-2xl p-5 flex flex-col justify-center">
                  <FaHome className="text-2xl text-[#6B8A9E] mb-3" aria-hidden="true" />
                  <p className="text-2xl font-bold text-forma-dark mb-1">+320</p>
                  <p className="text-xs text-gray-600 leading-tight">instituciones <br /> interculturales</p>
                </div>
                
                <div className="bg-[#F0F5FA] rounded-2xl p-5 flex flex-col justify-center">
                  <FaSchool className="text-2xl text-[#6B8A9E] mb-3" aria-hidden="true" />
                  <p className="text-2xl font-bold text-forma-dark mb-1">34</p>
                  <p className="text-xs text-gray-600 leading-tight">escuelas de <br /> Educación Especial</p>
                </div>

              </div>

              {/* Pie de la tarjeta */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Más datos, con sus fuentes, en <a href="#" className="text-[#3BB29B] hover:underline font-medium">El sistema educativo</a>.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}