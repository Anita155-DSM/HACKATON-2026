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

//.env para el front
//
// VITE_API_URL=http://localhost:3000/api
//const API_URL = import.meta.env.VITE_API_URL_ADMIN;
//
// VITE_API_URL_AUTH=http://localhost:3000/api/auth
// VITE_API_URL_ADMIN=http://localhost:3000/api/admin
// VITE_API_URL_UPLOADS=http://localhost:3000
//
// VITE_API_URL_EVENTOS=http://localhost:3000/api/eventos
//const API_URL_EVENTOS = import.meta.env.VITE_API_URL_EVENTOS;