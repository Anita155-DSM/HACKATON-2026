import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export const Modal = ({ isOpen, onClose, title, children }) => {
  // Bloquea el scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    // Limpieza: restaura el scroll si el componente se desmonta inesperadamente
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Si no está abierto, no renderiza absolutamente nada
  if (!isOpen) return null;

  return (
    // Contenedor principal: ocupa toda la pantalla con fondo oscuro semitransparente
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      
      {/* La caja blanca del modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-pop">
        
        {/* Cabecera del modal */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Contenido (Acá inyectaremos el formulario) */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>

    </div>
  );
};