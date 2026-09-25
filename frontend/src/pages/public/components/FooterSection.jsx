export default function FooterSection() {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual automáticamente

    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Fila Superior: Marca y Equipo */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">

                    {/* Columna Izquierda: Logo y Descripción */}
                    <div className="max-w-md">
                        <span className="text-3xl font-serif tracking-wide text-[#041E2A] block mb-4">
                            FormA
                        </span>
                        <p className="text-gray-600 leading-relaxed">
                            Materiales escolares en versiones accesibles, para aprender en tu forma y en tu lengua. Formosa, Argentina.
                        </p>
                    </div>

                    {/* Columna Derecha: Equipo */}
                    <div className="md:text-right">
                        <h4 className="font-bold text-[#041E2A] mb-3">Equipo</h4>
                        <p className="text-gray-600 font-medium">Drop_Table</p>
                    </div>
                </div>

                {/* Fila Inferior: Fuentes y Copyright */}
                <div className="border-t border-gray-200 pt-6 flex flex-col gap-8">

                    {/* Fuentes */}
                    <p className="text-sm text-gray-500">
                        Fuentes: INDEC, Censo 2022 · Ley 26.206 de Educación Nacional · Ley 426 de Formosa.
                    </p>

                    {/* Copyright */}
                    <p className="text-sm text-gray-400 text-center">
                        © {currentYear} FormA - Todos los derechos reservados
                    </p>
                </div>

            </div>
        </footer>
    );
}