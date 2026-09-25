import { FaFilePdf } from "react-icons/fa";

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-[#F4F9FF] text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-1.5 bg-[#BDE0FE] text-[#023E8A] font-bold rounded-full text-sm tracking-wide mb-6 uppercase">
            Cómo funciona
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#041E2A] mb-4">
            Así funciona FormA
          </h2>
          <p className="text-gray-600 text-lg">
            Tres pasos, sin vueltas.
          </p>
        </div>

        {/* Grilla de los 3 pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 w-full max-w-5xl">
          
          {/* Paso 1 */}
          <div className="flex flex-col items-center text-center">
            {/* Maqueta del Celular */}
            <div className="w-56 h-[400px] border-[10px] border-[#041E2A] rounded-[2.5rem] bg-white shadow-xl flex flex-col overflow-hidden mb-8 relative">
              <div className="bg-[#50E3C2] text-[#041E2A] font-bold py-2.5 text-sm w-10/12 mx-auto rounded-b-md">
                FormA
              </div>
              <div className="p-4 flex flex-col flex-1 mt-2">
                <p className="font-bold text-[#041E2A] text-[15px] mb-6">Nuevo material</p>
                <div className="border-2 border-blue-100 bg-blue-50/50 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <FaFilePdf className="text-gray-400" aria-hidden="true" /> apunte.pdf
                </div>
                <div className="mt-auto">
                  <div className="bg-[#041E2A] text-white py-2.5 rounded-xl text-sm font-bold shadow-md">
                    Subir material
                  </div>
                </div>
              </div>
            </div>
            {/* Textos del paso */}
            <h3 className="text-xl font-bold text-[#041E2A] mb-2">1. El docente sube el material</h3>
            <p className="text-gray-600 leading-relaxed max-w-[250px]">
              Un apunte, una foto o un PDF. Una sola vez.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="flex flex-col items-center text-center">
            {/* Maqueta del Celular */}
            <div className="w-56 h-[400px] border-[10px] border-[#041E2A] rounded-[2.5rem] bg-white shadow-xl flex flex-col overflow-hidden mb-8 relative">
              <div className="bg-[#50E3C2] text-[#041E2A] font-bold py-2.5 text-sm w-10/12 mx-auto rounded-b-md">
                FormA
              </div>
              <div className="p-4 flex flex-col gap-3 mt-6">
                {['Texto', 'Audio', 'Lectura fácil', 'Traducción'].map((item, index) => (
                  <div key={index} className="bg-[#F0F4F8] text-[#023E8A] py-2.5 rounded-xl text-sm font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Textos del paso */}
            <h3 className="text-xl font-bold text-[#041E2A] mb-2">2. Se crean versiones accesibles</h3>
            <p className="text-gray-600 leading-relaxed max-w-[250px]">
              Texto real, audio, lectura fácil y traducción.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="flex flex-col items-center text-center">
            {/* Maqueta del Celular */}
            <div className="w-56 h-[400px] border-[10px] border-[#041E2A] rounded-[2.5rem] bg-white shadow-xl flex flex-col overflow-hidden mb-8 relative">
              <div className="bg-[#50E3C2] text-[#041E2A] font-bold py-2.5 text-sm w-10/12 mx-auto rounded-b-md">
                FormA
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4 mt-4">
                <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                <div className="h-3 bg-gray-200 rounded-full w-4/5"></div>
                <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
                <div className="mt-auto">
                  <div className="bg-[#041E2A] text-white py-2.5 rounded-xl text-sm font-bold shadow-md">
                    Sin internet ✓
                  </div>
                </div>
              </div>
            </div>
            {/* Textos del paso */}
            <h3 className="text-xl font-bold text-[#041E2A] mb-2">3. El alumno lo usa sin internet</h3>
            <p className="text-gray-600 leading-relaxed max-w-[250px]">
              Lo descarga una vez y lo lee o escucha donde esté.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}