import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import { useAuth } from "../../hooks/useAuth.js";
import { Card, Button } from "../../components/ui";
import { FaUsers, FaTasks, FaChartLine, FaPlus } from "react-icons/fa";
import clienteAxios from "../../config/axios";
import { Loading } from "../../components/layout";

export default function Home() {
  const { user } = useAuth();
  const nombreMostrar = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Invitado";

  // 1. MAGIA DE REACT QUERY: Adiós useState y useEffect. Todo en un hook.
  const { data: usuariosAPI = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await clienteAxios.get("/users");
      return data.data.items || [];
    }
  });

  // React Query maneja el estado de carga por nosotros
  if (isLoading) return <Loading />;

  const metricas = [
    {
      titulo: "Usuarios Totales",
      valor: usuariosAPI.length.toString(),
      icono: <FaUsers className="text-blue-500 text-2xl" />,
      fondo: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      titulo: "Tareas Activas",
      valor: "0",
      icono: <FaTasks className="text-green-500 text-2xl" />,
      fondo: "bg-green-50 dark:bg-green-900/30",
    },
    {
      titulo: "Visitas Mensuales",
      valor: "1",
      icono: <FaChartLine className="text-purple-500 text-2xl" />,
      fondo: "bg-purple-50 dark:bg-purple-900/30",
    },
  ];

  const actividadReciente = usuariosAPI.slice(0, 5).map(u => ({
    id: u.id,
    accion: "Nuevo usuario registrado",
    user: `${u.firstName} ${u.lastName}`,
    // 2. MAGIA DE DATE-FNS: Convierte la fecha ISO a "hace X minutos/días" en español
    fecha: formatDistanceToNow(new Date(u.createdAt), { addSuffix: true, locale: es })
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
            ¡Hola de nuevo, {nombreMostrar}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
            Resumen de tu sistema al día de hoy.
          </p>
        </div>

        <Button variant="primary" className="flex items-center gap-2">
          <FaPlus /> Nueva Tarea
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricas.map((metrica, index) => (
          <Card key={index} className="flex items-center p-4">
            <div className={`p-4 rounded-full mr-4 ${metrica.fondo}`}>
              {metrica.icono}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                {metrica.titulo}
              </p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
                {metrica.valor}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Actividad Reciente" className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                <th className="py-3 px-4 font-medium">Acción</th>
                <th className="py-3 px-4 font-medium">Usuario</th>
                <th className="py-3 px-4 font-medium text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
              {actividadReciente.length > 0 ? (
                actividadReciente.map(item => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">{item.accion}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {item.user}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400 capitalize">
                      {item.fecha} {/* Acá se mostrará "hace 5 minutos" */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No hay actividad reciente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 