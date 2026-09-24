import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { Card, Input, Button } from "../../components/ui";

export default function Profile() {
  const { user } = useAuth();
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      nombre: user?.nombre || "",
      email: user?.email || ""
    }
  });

  const onSubmit = (data) => {
    // Aquí iría la llamada PUT a tu API real en el futuro
    toast.success("Datos actualizados correctamente (Simulación)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-gray-500 text-sm">Visualiza y gestiona tu información personal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta lateral con avatar */}
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
          <FaUserCircle className="text-8xl text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">{user?.nombre || "Usuario"}</h2>
          <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {user?.rol || "Sin Rol"}
          </span>
        </Card>

        {/* Tarjeta principal con formulario */}
        <Card title="Datos de la Cuenta" className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre Completo"
              id="nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            
            <Input
              label="Correo Electrónico"
              id="email"
              type="email"
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
              {...register("email")}
            />
            
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Card>
        
      </div>
    </div>
  );
}