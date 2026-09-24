import { Modal } from "./Modal";
import { Button } from "../Button";
import { FaExclamationTriangle } from "react-icons/fa";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de que deseas continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = true, // Si es true, el botón será rojo
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center py-4">
        <FaExclamationTriangle 
          className={`text-5xl mb-4 ${isDestructive ? 'text-red-500' : 'text-yellow-500'}`} 
        />
        
        <p className="text-gray-600 mb-8 text-lg px-4">
          {message}
        </p>
        
        <div className="flex gap-3 w-full justify-center">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          
          <Button 
            variant="primary"
            onClick={onConfirm} 
            disabled={isLoading}
            // Forzamos clases rojas si la acción es destructiva (eliminar)
            className={isDestructive ? "bg-red-600 hover:bg-red-700 border-none text-white" : ""}
          >
            {isLoading ? "Procesando..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};