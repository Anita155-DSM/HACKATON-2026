import { Card } from "../../components/ui";
import { FaSun, FaMoon, FaBell, FaShieldAlt } from "react-icons/fa";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Ajustes del Sistema</h1>
        <p className="text-gray-500 text-sm">Configura las preferencias de tu cuenta y el entorno.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Sección de Apariencia */}
        <Card title="Apariencia">
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-800">Tema de la Interfaz</h3>
              <p className="text-sm text-gray-500">Alternar entre modo claro y oscuro.</p>
            </div>
            
            {/* Contenedor de botones (Preparado para la futura lógica) */}
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-md text-sm font-medium text-gray-800">
                <FaSun className="text-yellow-500" /> Claro
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                <FaMoon /> Oscuro
              </button>
            </div>
          </div>
        </Card>

        {/* Sección de Notificaciones (Estructura de relleno para que se vea completo) */}
        <Card title="Notificaciones">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-full">
                <FaBell />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Alertas por Correo</h3>
                <p className="text-sm text-gray-500">Recibir resumen de actividad mensual.</p>
              </div>
            </div>
            {/* Toggle switch visual */}
            <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-5"></div>
            </div>
          </div>
        </Card>

        {/* Sección de Seguridad */}
        <Card title="Seguridad">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-500 rounded-full">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Autenticación en Dos Pasos</h3>
                <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta.</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Configurar
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}