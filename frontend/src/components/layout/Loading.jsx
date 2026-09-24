export default function Loading({ fullScreen = false }) {
  // El circulito animado aislado
  const spinner = (
    <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-[#1D7BB6] animate-spin"></div>
  );

  // 1. Si necesitas que ocupe toda la pantalla (Ej: En el Guardián o al abrir la app)
  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  // 2. Si lo usas normal (Ej: Adentro de un Card, o cargando una tabla)
  // Solo se centra en el espacio que tenga disponible, sin romper la pantalla
  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      {spinner}
    </div>
  );
}
