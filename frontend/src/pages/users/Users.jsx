import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

import { Card, Button, Input, Modal, ConfirmModal } from "../../components/ui";
import { Loading } from "../../components/layout";
import clienteAxios from "../../config/axios";

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Estados para saber qué usuario estamos manipulando
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const { data } = await clienteAxios.get("/users");
        setUsuarios(data);
      } catch (error) {
        toast.error("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // --- LÓGICA DE CREACIÓN Y EDICIÓN ---

  // Abre el modal limpio para crear
  const handleNuevoUsuario = () => {
    setUsuarioAEditar(null);
    reset({ nombre: "", email: "" }); // Limpia los inputs
    setIsModalOpen(true);
  };

  // Abre el modal con los datos del usuario cargados
  const handleEditarUsuario = (usuario) => {
    setUsuarioAEditar(usuario);
    reset(usuario); // Magia de react-hook-form: llena los inputs automáticamente
    setIsModalOpen(true);
  };

  // Guarda los datos (Crea o Actualiza según el estado)
  const onSubmit = async (data) => {
    try {
      if (usuarioAEditar) {
        // MODO EDICIÓN
        await clienteAxios.put(`/users/${usuarioAEditar.id}`, data);
        
        // Actualiza el array local reemplazando solo el modificado
        setUsuarios(usuarios.map(u => 
          u.id === usuarioAEditar.id ? { ...u, nombre: data.nombre, email: data.email } : u
        ));
        toast.success("Usuario actualizado correctamente");

      } else {
        // MODO CREACIÓN
        await clienteAxios.post("/users", data);
        const nuevoUsuario = { id: Date.now(), nombre: data.nombre, email: data.email, rol: "Usuario" };
        setUsuarios([...usuarios, nuevoUsuario]);
        toast.success("Usuario creado correctamente");
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Hubo un error al guardar");
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  
  const handleClickEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setIsConfirmOpen(true);
  };

  const confirmarEliminacion = async () => {
    try {
      setUsuarios(usuarios.filter(u => u.id !== usuarioAEliminar.id));
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el usuario");
    } finally {
      setIsConfirmOpen(false);
      setUsuarioAEliminar(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm">Administra los accesos al sistema.</p>
        </div>
        <Button onClick={handleNuevoUsuario} className="flex items-center gap-2">
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
              {usuarios.map((user) => (
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
                      onClick={() => handleEditarUsuario(user)}
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
        title={usuarioAEditar ? "Editar Usuario" : "Crear Nuevo Usuario"}
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
              {isSubmitting ? "Guardando..." : (usuarioAEditar ? "Actualizar Datos" : "Guardar Usuario")}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmarEliminacion}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a ${usuarioAEliminar?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDestructive={true}
      />

    </div>
  );
}