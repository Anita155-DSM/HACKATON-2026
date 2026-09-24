import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, Input, Button } from "../../../components/ui";
import { useAuth } from "../../../hooks/useAuth";
import { loginService } from "../../../services/authService"; // Importamos el servicio

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async data => {
    try {
      // Llamada directa al servicio
      const respuesta = await loginService(data.email, data.password);

      // Si pasa, guardamos la sesión
      login(respuesta.user, respuesta.token);
      toast.success("Bienvenido al sistema");
      navigate("/");
    } catch (error) {
      // Si el mock (o el backend) devuelve un error 401, cae acá
      toast.error(error.response?.data?.mensaje || "Credenciales incorrectas");
    }
  };
 return (
    <div className="w-full max-w-md">
      {/* El componente Card le da el fondo blanco y la forma de caja */}
      <Card>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500 text-sm mt-1">Ingresa tus datos para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Aquí usas tus componentes personalizados <Input /> y <Button /> */}
          <Input
            label="Correo Electrónico"
            id="email"
            type="email"
            placeholder="ejemplo@mail.com"
            error={errors.email?.message}
            {...register("email", { required: "Obligatorio" })}
          />

          <Input
            label="Contraseña"
            id="password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { required: "Obligatorio" })}
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verificando..." : "Ingresar al Panel"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
