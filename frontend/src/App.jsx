import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext"; // Importamos el proveedor

export default function App() {
  return (
    // Envolvemos todo con el AuthProvider
    <AuthProvider>
      <Toaster position="top-right" richColors expand={false} />
      <AppRoutes />
    </AuthProvider>
  );
}