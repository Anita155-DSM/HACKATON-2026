import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

import { Card, Button, Input, Modal, ConfirmModal } from "../../components/ui";
import { Loading } from "../../components/layout";
import clienteAxios from "../../config/axios";

export default function Users() {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Estados para saber qué user estamos manipulando
  const [userAEditar, setuserAEditar] = useState(null);
  const [userAEliminar, setuserAEliminar] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const { data } = await clienteAxios.get("/users");
        setusers(data);
      } catch (error) {
        toast.error("Error al cargar los users");
      } finally {
        setLoading(false);
      }
    };
    fetchusers();
  }, []);

  // --- LÓGICA DE CREACIÓN Y EDICIÓN ---

  // Abre el modal limpio para crear
  const handleNuevouser = () => {
    setuserAEditar(null);
    reset({ nombre: "", email: "" }); // Limpia los inputs
    setIsModalOpen(true);
  };

  // Abre el modal con los datos del user cargados
  const handleEditaruser = (user) => {
    setuserAEditar(user);
    reset(user); // Magia de react-hook-form: llena los inputs automáticamente
    setIsModalOpen(true);
  };

  // Guarda los datos (Crea o Actualiza según el estado)
  const onSubmit = async (data) => {
    try {
      if (userAEditar) {
        // MODO EDICIÓN
        await clienteAxios.put(`/users/${userAEditar.id}`, data);
        
        // Actualiza el array local reemplazando solo el modificado
        setusers(users.map(u => 
          u.id === userAEditar.id ? { ...u, nombre: data.nombre, email: data.email } : u
        ));
        toast.success("user actualizado correctamente");

      } else {
        // MODO CREACIÓN
        await clienteAxios.post("/users", data);
        const nuevouser = { id: Date.now(), nombre: data.nombre, email: data.email, rol: "user" };
        setusers([...users, nuevouser]);
        toast.success("user creado correctamente");
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Hubo un error al guardar");
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  
  const handleClickEliminar = (user) => {
    setuserAEliminar(user);
    setIsConfirmOpen(true);
  };

  const confirmarEliminacion = async () => {
    try {
      setusers(users.filter(u => u.id !== userAEliminar.id));
      toast.success("user eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el user");
    } finally {
      setIsConfirmOpen(false);
      setuserAEliminar(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de users</h1>
          <p className="text-gray-500 text-sm">Administra los accesos al sistema.</p>
        </div>
        <Button onClick={handleNuevouser} className="flex items-center gap-2">
          <FaPlus /> Nuevo user
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
                  <td className="py-3 px-4 font-medium text-gray-900">{user.nombre}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.rol === 'Administrador' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {/* Botón Editar modificado */}
                    <button 
                      onClick={() => handleEditaruser(user)}
                      className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleClickEliminar(user)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
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

      {/* Modal Dinámico (Crear / Editar) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={userAEditar ? "Editar user" : "Crear Nuevo user"}
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
              {isSubmitting ? "Guardando..." : (userAEditar ? "Actualizar Datos" : "Guardar user")}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmarEliminacion}
        title="Eliminar user"
        message={`¿Estás seguro de que deseas eliminar a ${userAEliminar?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDestructive={true}
      />

    </div>
  );
}