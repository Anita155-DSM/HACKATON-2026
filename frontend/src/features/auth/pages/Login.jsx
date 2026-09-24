import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

import { Card, Button, Input } from "../../../components/ui";
import { useAuth } from "../../../hooks/useAuth.js";
import clienteAxios from "../../../config/axios.js";
import { playSound } from "../../../helpers/sounds/audio.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await clienteAxios.post("/auth/login", data);

      playSound('success');
      toast.success("¡Bienvenido al sistema!");

      const { user, accessToken } = response.data.data;

      login(user, accessToken);
      navigate("/");

    } catch (error) {
      playSound('error');
      const mensaje = error.response?.data?.mensaje || "Error al iniciar sesión";
      toast.error(mensaje);
    }
  };

  return (
    <div className="w-full max-w-md animate-pop">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
          Iniciar Sesión
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
          Ingresa tus datos para continuar
        </p>
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
            aria-label="Botón para ingresar al panel de administración"
            title="Ingresar al Panel"
          >
            {isSubmitting ? "Verificando..." : "Ingresar al Panel"}
            {!isSubmitting && <FaSignInAlt aria-hidden="true" />}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            Regístrate aquí
          </Link>
        </div>
      </Card>
    </div>
  );
}