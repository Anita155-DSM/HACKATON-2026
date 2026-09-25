export default function ProblemSection() {
  return (
    <section id="problematica" className="py-20 lg:py-28 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de la sección */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 justify-between items-start mb-16">
          <div className="max-w-2xl">
            {/* Etiqueta */}
            <span className="inline-block px-4 py-1.5 bg-[#BDE0FE] text-[#023E8A] font-bold rounded-full text-sm tracking-wide mb-6 uppercase">
              Nuestra problemática
            </span>
            {/* Título Principal */}
            <h2 className="text-4xl md:text-5xl font-serif text-[#041E2A] leading-tight">
              Barreras de accesibilidad en contenidos y recursos digitales
            </h2>
          </div>
          {/* Texto secundario */}
          <div className="max-w-lg lg:mt-14 text-gray-600 text-lg leading-relaxed">
            <p>
              Las personas poseen diferentes capacidades, contextos y formas de interactuar con la tecnología. Muchos contenidos no contemplan estas diferencias.
            </p>
          </div>
        </div>

        {/* Grilla de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Tarjeta 1: Comunidades indígenas */}
          <div className="bg-[#F0F4F8] rounded-3xl p-8 flex flex-col h-full border border-gray-100">
            <h3 className="text-2xl font-bold text-[#041E2A] mb-1">Comunidades indígenas</h3>
            <p className="text-[#023E8A] font-semibold mb-6">Barrera: el idioma</p>
            <ul className="space-y-3 mb-8 text-gray-700 flex-1">
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Los materiales llegan solo en castellano.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Hay pocos recursos en su lengua.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Cuesta seguir la clase sin apoyo.</span>
              </li>
            </ul>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-auto">
              <h4 className="font-bold text-[#041E2A] mb-2">Qué hace FormA</h4>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Suma traducciones hechas por una persona de la comunidad y audio para escuchar el material.
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Estudiantes del interior */}
          <div className="bg-[#F0F4F8] rounded-3xl p-8 flex flex-col h-full border border-gray-100">
            <h3 className="text-2xl font-bold text-[#041E2A] mb-1">Estudiantes del interior</h3>
            <p className="text-[#023E8A] font-semibold mb-6">Barrera: la conectividad</p>
            <ul className="space-y-3 mb-8 text-gray-700 flex-1">
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Poca señal o nada de internet.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Archivos pesados que no bajan.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Videos que no cargan.</span>
              </li>
            </ul>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-auto">
              <h4 className="font-bold text-[#041E2A] mb-2">Qué hace FormA</h4>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Arma versiones livianas. Se descargan una vez y se usan sin internet.
              </p>
            </div>
          </div>

          {/* Tarjeta 3: Docentes del interior */}
          <div className="bg-[#F0F4F8] rounded-3xl p-8 flex flex-col h-full border border-gray-100">
            <h3 className="text-2xl font-bold text-[#041E2A] mb-1">Docentes del interior</h3>
            <p className="text-[#023E8A] font-semibold mb-6">Barrera: la conectividad</p>
            <ul className="space-y-3 mb-8 text-gray-700 flex-1">
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Cuesta subir y compartir materiales.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Poco tiempo para adaptar cada uno.</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold">•</span> 
                <span>Falta una herramienta simple.</span>
              </li>
            </ul>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-auto">
              <h4 className="font-bold text-[#041E2A] mb-2">Qué hace FormA</h4>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                El docente sube el material una vez. FormA crea las versiones accesibles.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}