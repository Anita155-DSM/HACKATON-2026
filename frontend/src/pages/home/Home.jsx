import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { Card, Button } from "../../components/ui";
import { FaUsers, FaTasks, FaChartLine, FaPlus } from "react-icons/fa";
import clienteAxios from "../../config/axios";
import { toast } from "sonner";
import { Loading } from "../../components/layout";

export default function Home() {
  const { user } = useAuth();
  const [usuariosAPI, setUsuariosAPI] = useState([]);
  const [loading, setLoading] = useState(true);

  const nombreMostrar = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
    : "Invitado";

  // 1. CARGAMOS LOS DATOS REALES DE TU BASE DE DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await clienteAxios.get("/users");
        // Tu backend devuelve la lista dentro de data.data.items
        setUsuariosAPI(data.data.items || []);
      } catch (error) {
        toast.error("Error al cargar los datos del panel");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  // 2. CONECTAMOS LAS MÉTRICAS A LOS DATOS REALES
  const metricas = [
    {
      titulo: "Usuarios Totales",
      valor: usuariosAPI.length.toString(), // <-- DATO REAL 
      icono: <FaUsers className="text-blue-500 text-2xl" />,
      fondo: "bg-blue-50 dark:bg-blue-900/30", // Adaptado al modo oscuro
    },
    {
      titulo: "Tareas Activas",
      valor: "0", // Lo dejamos en 0 hasta que conectes una tabla de tareas
      icono: <FaTasks className="text-green-500 text-2xl" />,
      fondo: "bg-green-50 dark:bg-green-900/30",
    },
    {
      titulo: "Visitas Mensuales",
      valor: "1", // Como no tenés sistema de analíticas aún, lo dejamos estático por ahora
      icono: <FaChartLine className="text-purple-500 text-2xl" />,
      fondo: "bg-purple-50 dark:bg-purple-900/30",
    },
  ];

  // 3. ARMAMOS LA TABLA CON LOS ÚLTIMOS 5 USUARIOS REALES REGISTRADOS
  // (Tomamos los primeros 5 del array asumiendo que el backend los ordena por fecha)
  const actividadReciente = usuariosAPI.slice(0, 5).map(u => ({
    id: u.id,
    accion: "Nuevo usuario registrado",
    user: `${u.firstName} ${u.lastName}`,
    fecha: new Date(u.createdAt).toLocaleDateString() // Formateamos la fecha real
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Agregado dark:text-white */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
            ¡Hola de nuevo, {nombreMostrar}!
          </h1>
          {/* Agregado dark:text-gray-400 */}
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
                    <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">
                      {item.fecha}
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