import { useAuth } from "../../hooks/useAuth.js";
import { Card, Button } from "../../components/ui";
// Asumiendo que tenés react-icons instalado según tu package.json
import { FaUsers, FaTasks, FaChartLine, FaPlus } from "react-icons/fa";

export default function Home() {
  // Consumimos el contexto para personalizar el saludo
  const { user } = useAuth();

  // Datos simulados para las métricas del dashboard
  const metricas = [
    {
      titulo: "Usuarios Totales",
      valor: "1,250",
      icono: <FaUsers className="text-blue-500 text-2xl" />,
      fondo: "bg-blue-50",
    },
    {
      titulo: "Tareas Activas",
      valor: "34",
      icono: <FaTasks className="text-green-500 text-2xl" />,
      fondo: "bg-green-50",
    },
    {
      titulo: "Visitas Mensuales",
      valor: "15.4K",
      icono: <FaChartLine className="text-purple-500 text-2xl" />,
      fondo: "bg-purple-50",
    },
  ];

  // Datos simulados para una tabla de actividad reciente
  const actividadReciente = [
    {
      id: 1,
      accion: "Nuevo usuario registrado",
      usuario: "Juan Pérez",
      fecha: "Hace 5 min",
    },
    {
      id: 2,
      accion: "Actualización de sistema",
      usuario: "Admin",
      fecha: "Hace 2 horas",
    },
    {
      id: 3,
      accion: "Tarea completada",
      usuario: "María Gómez",
      fecha: "Hace 5 horas",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. ENCABEZADO CON ACCIÓN PRINCIPAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Hola de nuevo, {user?.nombre || "Invitado"}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Este es el resumen de tu sistema al día de hoy.
          </p>
        </div>

        {/* Usamos el componente Button que creamos antes */}
        <Button variant="primary" className="flex items-center gap-2">
          <FaPlus /> Nueva Tarea
        </Button>
      </div>

      {/* 2. GRILLA DE MÉTRICAS (Tarjetas pequeñas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricas.map((metrica, index) => (
          <Card key={index} className="flex items-center p-4">
            <div className={`p-4 rounded-full mr-4 ${metrica.fondo}`}>
              {metrica.icono}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {metrica.titulo}
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {metrica.valor}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. CONTENIDO PRINCIPAL (Tabla dentro de un Card grande) */}
      <Card title="Actividad Reciente" className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">Acción</th>
                <th className="py-3 px-4 font-medium">Usuario</th>
                <th className="py-3 px-4 font-medium text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {actividadReciente.map(item => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{item.accion}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {item.usuario}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500">
                    {item.fecha}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de la tarjeta con otro botón */}
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm">
            Ver todo el historial
          </Button>
        </div>
      </Card>
    </div>
  );
}
