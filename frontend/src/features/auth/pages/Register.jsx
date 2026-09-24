import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom"; 

import { Card, Button, Input } from "../../../components/ui";
import clienteAxios from "../../../config/axios.js";
import { playSound } from "../../../helpers/sounds/audio.js";

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword 
      };

      const response = await clienteAxios.post("/auth/register", payload);
      
      playSound('success');
      toast.success(response.data.mensaje || "¡Registro completado con éxito!");
      navigate("/"); 
      
    } catch (error) {
      playSound('error');
      
      console.error("Detalles del error 422:", error.response?.data);
      if (error.response?.data?.errors) {
        console.table(error.response.data.errors);
      }

      const mensaje = error.response?.data?.mensaje || "Error al registrar el usuario";
      toast.error(mensaje);
    }
  };

  return (
    <div className="w-full max-w-md animate-pop">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
          Crear Cuenta
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
          Completa tus datos para registrarte
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Nombre"
                id="firstName"
                placeholder="Ej: Juan"
                error={errors.firstName?.message}
                {...register("firstName", { required: "El nombre es obligatorio" })}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Apellido"
                id="lastName"
                placeholder="Ej: Pérez"
                error={errors.lastName?.message}
                {...register("lastName", { required: "El apellido es obligatorio" })}
              />
            </div>
          </div>

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

          <Input
            label="Contraseña"
            id="password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { 
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
            })}
          />

          <Input
            label="Confirmar Contraseña"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", { 
              required: "Debes confirmar tu contraseña",
              validate: value => value === password || "Las contraseñas no coinciden"
            })}
          />

          <Button 
            type="submit" 
            className="w-full mt-4 flex justify-center items-center gap-2"
            disabled={isSubmitting}
            aria-label="Botón para registrar una nueva cuenta"
            title="Registrarse"
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
            {!isSubmitting && <FaUserPlus aria-hidden="true" />}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            Inicia sesión aquí
          </Link>
        </div>

      </Card>
    </div>
  );
}