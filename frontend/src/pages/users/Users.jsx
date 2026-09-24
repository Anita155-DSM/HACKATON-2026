import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaPlus, FaTrash, FaEdit, FaUserCircle } from "react-icons/fa";

import { Card, Button, Input, Modal, ConfirmModal } from "../../components/ui";
import { Loading } from "../../components/layout";
import clienteAxios from "../../config/axios";
import { useAuth } from "../../hooks/useAuth";

export default function Users() {
  const { user: currentUser } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [userAEditar, setUserAEditar] = useState(null);
  const [userAEliminar, setUserAEliminar] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // 1. CARGAR USUARIOS: Extraemos de data.data.items según tu user.controllers.js
  const fetchUsers = async () => {
    try {
      const { data } = await clienteAxios.get("/users");
      setUsers(data.data.items || []); 
    } catch (error) {
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNuevoUser = () => {
    setUserAEditar(null);
    reset({ nombre: "", email: "" }); 
    setIsModalOpen(true);
  };

  const handleEditarUser = (user) => {
    setUserAEditar(user);
    // Unimos el nombre para que react-hook-form lo muestre en el input
    reset({ nombre: `${user.firstName} ${user.lastName}`.trim(), email: user.email }); 
    setIsModalOpen(true);
  };

  // 2. CREACIÓN: Adaptamos el payload a tu ruta /auth/register
  const onSubmit = async (data) => {
    try {
      if (userAEditar) {
        toast.info("Tu backend no tiene una ruta para editar nombres aún. Solo roles o estado.");
        return;
      }

      // Dividimos el input único en firstName y lastName
      const partes = data.nombre.trim().split(" ");
      const firstName = partes[0];
      const lastName = partes.slice(1).join(" ") || "N/A"; // lastName es allowNull: false

      await clienteAxios.post("/auth/register", {
        firstName,
        lastName,
        email: data.email,
        password: "Password123!" // Contraseña por defecto requerida por tu modelo
      });

      toast.success("Usuario creado. Se envió el email de verificación.");
      setIsModalOpen(false);
      fetchUsers(); // Recargamos la tabla para obtener el ID real
      
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || "Hubo un error al guardar";
      toast.error(mensaje);
    }
  };
  
  const handleClickEliminar = (user) => {
    setUserAEliminar(user);
    setIsConfirmOpen(true);
  };

  // 3. ELIMINACIÓN: Conectado a tu DELETE /api/users/:id
  const confirmarEliminacion = async () => {
    try {
      await clienteAxios.delete(`/users/${userAEliminar.id}`);
      setUsers(users.filter(u => u.id !== userAEliminar.id));
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el usuario");
    } finally {
      setIsConfirmOpen(false);
      setUserAEliminar(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {currentUser && (
        <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <FaUserCircle className="text-3xl text-blue-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">
              Sesión iniciada como: {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              {currentUser.email} • Nivel de acceso: {currentUser.role === 'admin' ? 'Administrador' : 'Usuario'}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm">Administra los accesos al sistema.</p>
        </div>
        <Button onClick={handleNuevoUser} className="flex items-center gap-2">
          <FaPlus /> Nuevo Usuario
        </Button>
      </div>

      <Card className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">Nombre</th>
                <th className="py-3 px-4 font-medium">Correo</th>
                <th className="py-3 px-4 font-medium">Rol</th>
                <th className="py-3 px-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEditarUser(user)}
                      className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                      title="Editar usuario"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleClickEliminar(user)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Eliminar usuario"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={userAEditar ? "Editar Usuario" : "Crear Nuevo Usuario"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre Completo"
            id="nombre"
            placeholder="Ej: Juan Pérez"
            error={errors.nombre?.message}
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          
          <Input
            label="Correo Electrónico"
            id="email"
            type="email"
            placeholder="ejemplo@mail.com"
            error={errors.email?.message}
            {...register("email", { 
              required: "El correo es obligatorio",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato inválido" }
            })}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Usuario"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmarEliminacion}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a ${userAEliminar?.firstName}?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </div>
  );
}