import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaSignInAlt } from "react-icons/fa";
import { Card, Button, Input } from "../../../components/ui";
import { useAuth } from "../../../hooks/useAuth.js";
import clienteAxios from "../../../config/axios.js";
import { playSound } from "../../../helpers/sounds/audio.js"; // Importamos el helper

export default function Login() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await clienteAxios.post("/auth/login", data);
      
      // Reproduce sonido de éxito antes de redirigir
      playSound('success');
      toast.success("¡Bienvenido al sistema!");
      
      login(response.data.user, response.data.token);
    } catch (error) {
      // Reproduce sonido de error
      playSound('error');
      
      const mensaje = error.response?.data?.mensaje || "Error al iniciar sesión";
      toast.error(mensaje);
    }
  };

  return (
    <div className="w-full max-w-md animate-pop">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
        <p className="text-gray-500 text-sm mt-1">Ingresa tus datos para continuar</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Correo Electrónico"
            id="email"
            type="email"
            placeholder="ejemplo@mail.com"
            error={errors.email?.message}
            {...register("email", { required: "El correo es obligatorio" })}
          />

          <Input
            label="Contraseña"
            id="password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { required: "La contraseña es obligatoria" })}
          />

          <Button 
            type="submit" 
            className="w-full mt-4 flex justify-center items-center gap-2"
            disabled={isSubmitting}
            // Accesibilidad: El lector de pantalla leerá esto
            aria-label="Botón para ingresar al panel de administración"
            // Accesibilidad: Tooltip visual al pasar el mouse
            title="Ingresar al Panel"
          >
            {isSubmitting ? "Verificando..." : "Ingresar al Panel"}
            {!isSubmitting && <FaSignInAlt aria-hidden="true" />}
          </Button>
        </form>
      </Card>
    </div>
  );
}